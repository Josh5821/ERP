
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import SalesInvoice from "./SalesInvoice";
import api from "../../axiosConfig";


const API = "/api/erp";

function Sales() {
  const [sales, setSales] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [customerId, setCustomerId] = useState("");
  const [salesDate, setSalesDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  const [items, setItems] = useState([
    { productId: "", quantity: 1, unitPrice: 0, taxPercent: 0 }
  ]);

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const [invoiceSale, setInvoiceSale] = useState(null);

  

  useEffect(() => {
    loadSales();
    loadCustomers();
    loadProducts();
  }, []);

  // GET sales
  const loadSales = async () => {
    try {
      const response = await api.get(`${API}/sales`);
      setSales(response.data);
    } catch (error) {
      console.error("Error loading sales:", error);
    }
  };

  // GET customers
  const loadCustomers = async () => {
    try {
      const response = await api.get(`${API}/customer`);
      setCustomers(response.data);
    } catch (error) {
      console.error("Error loading customers:", error);
    }
  };

  // GET products
  const loadProducts = async () => {
    try {
      const response = await api.get(`${API}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  // Add product row
  const addItem = () => {
    setItems([
      ...items,
      { productId: "", quantity: 1, unitPrice: 0, taxPercent: 0 }
    ]);
  };

  //Delete
        const deleteSale = async (id) => {
        if (!window.confirm("Are you sure you want to delete this sale?")) {
            return;
        }

        try {
            await api.delete(`${API}/sales/${id}`);

            alert("Sale deleted successfully!");

            // Refresh the sales table
            loadSales();
        } catch (error) {
            console.error("Error deleting sale:", error);
            alert(error.response?.data?.message || "Failed to delete sale");
        }
    };

  // Remove product row
  const removeItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // Update product row
  const updateItem = (index, field, value) => {
  const updated = [...items];

  updated[index][field] = value;

  setItems(updated);
};

  // Calculate totals
  const subtotal = items.reduce(
    (sum, item) =>
      sum + Number(item.quantity || 0) * Number(item.unitPrice || 0),
    0
  );

  const taxAmount = items.reduce(
    (sum, item) =>
      sum +
      (Number(item.quantity || 0) *
        Number(item.unitPrice || 0) *
        Number(item.taxPercent || 0)) / 100,
    0
  );

  const totalAmount = subtotal + taxAmount;

  // POST sale
  const saveSale = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!customerId) {
      setMessage("Please select a customer.");
      return;
    }

    if (
      items.length === 0 ||
      items.some(
        (item) =>
          !item.productId ||
          Number(item.quantity) <= 0
      )
    ) {
      setMessage("Select products and enter valid quantities.");
      return;
    }

    const requestData = {
      customerId: Number(customerId),
      salesDate,
      items: items.map((item) => ({
        productId: Number(item.productId),
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
        taxPercent: Number(item.taxPercent)
      }))
    };

    try {
      await api.post(`${API}/sales`, requestData);

      setShowModal(false);
      setCustomerId("");
      setSalesDate(new Date().toISOString().slice(0, 10));
      setItems([
        { productId: "", quantity: 1, unitPrice: 0, taxPercent: 0 }
      ]);

      setMessage("Sale saved successfully!");
      loadSales();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        error.response?.data ||
        "Failed to save sale."
      );
    }
  };

  const formatAmount = (value) =>
    Number(value || 0).toFixed(2);

  return (
    <div className="container-fluid mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Sales Management</h3>

        <button
          className="btn btn-primary"
          onClick={() => {
            setMessage("");
            setShowModal(true);
          }}
        >
          + Add Sale
        </button>
      </div>

      {message && (
        <div className="alert alert-info">{String(message)}</div>
      )}

      {/* Sales table */}
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>Sale ID</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Subtotal</th>
              <th>Tax</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {sales.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">
                  No sales found
                </td>
              </tr>
            ) : (
              sales.map((sale) => (
                <tr key={sale.id}>
                  <td>{sale.id}</td>
                  <td>{sale.salesDate}</td>
                  <td>
                    {sale.customer?.customerName ??
                      sale.customer?.name ?? "-"}
                  </td>
                  <td>{formatAmount(sale.subtotal)}</td>
                  <td>{formatAmount(sale.taxAmount)}</td>
                  <td>{formatAmount(sale.totalAmount)}</td>
                  <td>
                    <button
                        className="btn btn-warning btn-sm"
                        onClick={() => navigate(`/sales/edit/${sale.id}`)}
                    >
                        Edit
                    </button>

                    <button
                        type="button"
                        className="btn btn-danger btn-sm ms-2"
                        onClick={() => deleteSale(sale.id)}
                        >
                        Delete
                        </button>

                        <button
                      type="button"
                      className="btn btn-success btn-sm ms-1"
                      onClick={() => navigate(`/sales-payment/${sale.id}`)}
                    >
                      Payment
                    </button>

                     <button
                      
                      className="btn btn-primary btn-sm"
                      onClick={() => navigate(`/sales-invoice/${sale.id}`)}
                    >
                      Invoice
                    </button>
                    </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {invoiceSale && (
  <SalesInvoice sale={invoiceSale} onClose={() => setInvoiceSale(null)} />
)}

      {/* Add Sale modal */}
      {showModal && (
        <>
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-xl modal-dialog-scrollable">
              <div className="modal-content">
                <form onSubmit={saveSale}>
                  <div className="modal-header">
                    <h5 className="modal-title">Add New Sale</h5>

                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowModal(false)}
                    />
                  </div>

                  <div className="modal-body">
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
                              {customer.customerName ??
                                customer.name ??
                                `Customer ${customer.id}`}
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

                    <div className="d-flex justify-content-between mb-2">
                      <h6>Sales Items</h6>

                      <button
                        type="button"
                        className="btn btn-success btn-sm"
                        onClick={addItem}
                      >
                        + Add Product
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
                            <th>Total</th>
                            <th>Action</th>
                          </tr>
                        </thead>

                        <tbody>
                          {items.map((item, index) => {
                            const lineSubtotal =
                              Number(item.quantity || 0) *
                              Number(item.unitPrice || 0);

                            const lineTotal =
                              lineSubtotal +
                              lineSubtotal *
                                Number(item.taxPercent || 0) / 100;

                            return (
                              <tr key={index}>
                                <td>
                                  <select
                                    className="form-select"
                                    value={item.productId}
                                    onChange={(e) =>
                                      updateItem(
                                        index,
                                        "productId",
                                        e.target.value
                                      )
                                    }
                                    required
                                  >
                                    <option value="">Select Product</option>

                                    {products.map((product) => (
                                      <option
                                        key={product.id}
                                        value={product.id}
                                      >
                                        {product.productName ??
                                          product.name ??
                                          `Product ${product.id}`}
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
                                      updateItem(
                                        index,
                                        "quantity",
                                        e.target.value
                                      )
                                    }
                                    required
                                  />
                                </td>

                                <td>
                                    <input
                                        type="number"
                                        className="form-control"
                                        min="0"
                                        step="0.01"
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
                                        className="form-control"
                                        min="0"
                                        max="100"
                                        step="0.01"
                                        value={item.taxPercent}
                                        onChange={(e) =>
                                        updateItem(index, "taxPercent", e.target.value)
                                        }
                                        required
                                    />
                                    </td>
                                <td>{formatAmount(lineTotal)}</td>

                                <td>
                                  <button
                                    type="button"
                                    className="btn btn-danger btn-sm"
                                    disabled={items.length === 1}
                                    onClick={() => removeItem(index)}
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

                    <div className="text-end">
                      <p>Subtotal: ₹{formatAmount(subtotal)}</p>
                      <p>Tax Amount: ₹{formatAmount(taxAmount)}</p>
                      <h5>Grand Total: ₹{formatAmount(totalAmount)}</h5>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>

                    <button type="submit" className="btn btn-primary">
                      Save Sale
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="modal-backdrop fade show" />
        </>
      )}
    </div>
  );
}

export default Sales;
