
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../axiosConfig";

const API = "/api/erp";

function SalesEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  const [customerId, setCustomerId] = useState("");
  const [salesDate, setSalesDate] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    loadCustomers();
    loadProducts();
    loadSale();
  }, [id]);

  const loadCustomers = async () => {
    try {
      const response = await api.get(`${API}/customer`);
      setCustomers(response.data);
    } catch (error) {
      console.error("Error loading customers", error);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await api.get(`${API}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error("Error loading products", error);
    }
  };

  const loadSale = async () => {
    try {
      const response = await api.get(`${API}/sales/${id}`);
      const sale = response.data;

      setCustomerId(String(sale.customer?.id ?? ""));
      setSalesDate(sale.salesDate ?? "");

      setItems(
        (sale.items || []).map((item) => ({
          productId: String(item.products?.id ?? ""),
          quantity: item.quantity ?? 1,
          unitPrice: item.unitPrice ?? 0,
          taxPercent: item.taxPercent ?? 0,
        }))
      );
    } catch (error) {
      console.error("Error loading sale", error);
      alert("Could not load sale details");
    }
  };

  const updateItem = (index, field, value) => {
    setItems((previousItems) =>
      previousItems.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  const addItem = () => {
    setItems((previousItems) => [
      ...previousItems,
      {
        productId: "",
        quantity: 1,
        unitPrice: 0,
        taxPercent: 0,
      },
    ]);
  };

  const removeItem = (index) => {
    setItems((previousItems) =>
      previousItems.filter((_, i) => i !== index)
    );
  };

  const saveChanges = async (e) => {
    e.preventDefault();

    const requestData = {
      customerId: Number(customerId),
      salesDate,
      items: items.map((item) => ({
        productId: Number(item.productId),
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
        taxPercent: Number(item.taxPercent),
      })),
    };

    try {
      await api.put(`${API}/sales/${id}`, requestData);

      alert("Sale updated successfully!");
      navigate("/sales");
    } catch (error) {
      console.error("Error updating sale", error);
      alert(
        error.response?.data?.message || "Failed to update sale"
      );
    }
  };

  const subtotal = items.reduce(
    (sum, item) =>
      sum +
      Number(item.quantity || 0) * Number(item.unitPrice || 0),
    0
  );

  const taxAmount = items.reduce(
    (sum, item) =>
      sum +
      (Number(item.quantity || 0) *
        Number(item.unitPrice || 0) *
        Number(item.taxPercent || 0)) /
        100,
    0
  );

  return (
    <div className="container mt-4">
      <h3>Edit Sale #{id}</h3>

      <form onSubmit={saveChanges}>
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Customer</label>
            <select
              className="form-select"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              required
            >
              <option value="">Select Customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.customerName}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">Sales Date</label>
            <input
              type="date"
              className="form-control"
              value={salesDate}
              onChange={(e) => setSalesDate(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5>Sale Items</h5>
          <button
            type="button"
            className="btn btn-success btn-sm"
            onClick={addItem}
          >
            + Add Item
          </button>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Tax %</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item, index) => {
                const amount =
                  Number(item.quantity || 0) *
                  Number(item.unitPrice || 0);

                return (
                  <tr key={index}>
                    <td>
                      <select
                        className="form-select"
                        value={item.productId}
                        onChange={(e) =>
                          updateItem(index, "productId", e.target.value)
                        }
                        required
                      >
                        <option value="">Select Product</option>
                        {products.map((product) => (
                          <option key={product.id} value={product.id}>
                            {product.productName || product.name}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td>
                      <input
                        type="number"
                        min="1"
                        className="form-control"
                        value={item.quantity}
                        onChange={(e) =>
                          updateItem(index, "quantity", e.target.value)
                        }
                        required
                      />
                    </td>

                    <td>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        className="form-control"
                        value={item.unitPrice}
                        onChange={(e) =>
                          updateItem(index, "unitPrice", e.target.value)
                        }
                        required
                      />
                    </td>

                    <td>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        className="form-control"
                        value={item.taxPercent}
                        onChange={(e) =>
                          updateItem(index, "taxPercent", e.target.value)
                        }
                        required
                      />
                    </td>

                    <td>{amount.toFixed(2)}</td>

                    <td>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => removeItem(index)}
                        disabled={items.length === 1}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="text-end mb-3">
          <p>
            <strong>Subtotal:</strong> ₹{subtotal.toFixed(2)}
          </p>
          <p>
            <strong>Tax:</strong> ₹{taxAmount.toFixed(2)}
          </p>
          <h5>
            Total: ₹{(subtotal + taxAmount).toFixed(2)}
          </h5>
        </div>

        <button type="submit" className="btn btn-primary me-2">
          Update Sale
        </button>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate("/sales")}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default SalesEdit;
