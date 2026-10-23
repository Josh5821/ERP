import { useEffect, useState } from "react";
import api from "../../axiosConfig";

const API = "/api/erp";

function PurchaseEditModal({ purchase, onClose, onUpdated }) {
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    supplierId: "",
    purchaseDate: "",
    purchaseItems: [],
  });

  useEffect(() => {
    if (!purchase) return;

    setForm({
      supplierId: purchase.supplier?.id || "",
      purchaseDate: purchase.purchaseDate || "",
      purchaseItems: (purchase.items || []).map((item) => ({
        productId: item.product?.id || "",
        purchasePrice: item.purchasePrice || "",
        quantity: item.quantity || 1,
        taxPercent: item.taxPercent || 0,
      })),
    });

    loadOptions();
  }, [purchase]);

  const loadOptions = async () => {
    try {
      const [supplierRes, productRes] = await Promise.all([
        api.get(`${API}/supplier`),
        api.get(`${API}/products`),
      ]);

      setSuppliers(supplierRes.data);
      setProducts(productRes.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load suppliers or products."
      );
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...form.purchaseItems];
    updatedItems[index][field] = value;

    setForm({
      ...form,
      purchaseItems: updatedItems,
    });
  };

  const handleProductChange = (index, productId) => {
    const selectedProduct = products.find(
      (p) => String(p.id) === String(productId)
    );

    const updatedItems = [...form.purchaseItems];

    updatedItems[index].productId = productId;

    if (selectedProduct) {
      updatedItems[index].purchasePrice = selectedProduct.price;
    }

    setForm({
      ...form,
      purchaseItems: updatedItems,
    });
  };

  const addItem = () => {
    setForm({
      ...form,
      purchaseItems: [
        ...form.purchaseItems,
        {
          productId: "",
          purchasePrice: "",
          quantity: 1,
          taxPercent: 0,
        },
      ],
    });
  };

  const removeItem = (index) => {
    setForm({
      ...form,
      purchaseItems: form.purchaseItems.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const payload = {
      supplierId: Number(form.supplierId),
      purchaseDate: form.purchaseDate,
      purchaseItems: form.purchaseItems.map((item) => ({
        productId: Number(item.productId),
        purchasePrice: Number(item.purchasePrice),
        quantity: Number(item.quantity),
        taxPercent: Number(item.taxPercent),
      })),
    };

    try {
      setLoading(true);

      await api.put(`${API}/purchase/${purchase.id}`, payload);

      await onUpdated();
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data ||
          err.message ||
          "Failed to update purchase."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!purchase) return null;

  const subtotal = form.purchaseItems.reduce(
    (sum, item) =>
      sum +
      Number(item.purchasePrice || 0) * Number(item.quantity || 0),
    0
  );

  const taxAmount = form.purchaseItems.reduce((sum, item) => {
    const amount =
      Number(item.purchasePrice || 0) * Number(item.quantity || 0);

    return sum + (amount * Number(item.taxPercent || 0)) / 100;
  }, 0);

  const grandTotal = subtotal + taxAmount;

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-xl modal-dialog-scrollable">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">
                Edit Purchase #{purchase.id}
              </h5>

              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              />
            </div>

            <div className="modal-body">
              {error && (
                <div className="alert alert-danger">{error}</div>
              )}

              <div className="row mb-3">
                <div className="col-md-6">
                  <label className="form-label">Supplier</label>

                  <select
                    className="form-select"
                    name="supplierId"
                    value={form.supplierId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Supplier</option>

                    {suppliers.map((supplier) => (
                      <option
                        key={supplier.id}
                        value={supplier.id}
                      >
                        {supplier.supplierName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    Purchase Date
                  </label>

                  <input
                    type="date"
                    className="form-control"
                    name="purchaseDate"
                    value={form.purchaseDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5>Purchase Items</h5>

                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm"
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
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Tax %</th>
                      <th>Line Total</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {form.purchaseItems.map((item, index) => {
                      const lineSubtotal =
                        Number(item.purchasePrice || 0) *
                        Number(item.quantity || 0);

                      const lineTotal =
                        lineSubtotal +
                        (lineSubtotal *
                          Number(item.taxPercent || 0)) /
                          100;

                      return (
                        <tr key={index}>
                          <td>
                            <select
                              className="form-select"
                              value={item.productId}
                              onChange={(e) =>
                                handleProductChange(
                                  index,
                                  e.target.value
                                )
                              }
                              required
                            >
                              <option value="">
                                Select Product
                              </option>

                              {products.map((product) => (
                                <option
                                  key={product.id}
                                  value={product.id}
                                >
                                  {product.productName}
                                </option>
                              ))}
                            </select>
                          </td>

                          <td>
                            <input
                              type="number"
                              className="form-control"
                              value={item.purchasePrice}
                              onChange={(e) =>
                                handleItemChange(
                                  index,
                                  "purchasePrice",
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
                              value={item.quantity}
                              onChange={(e) =>
                                handleItemChange(
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
                              value={item.taxPercent}
                              onChange={(e) =>
                                handleItemChange(
                                  index,
                                  "taxPercent",
                                  e.target.value
                                )
                              }
                              required
                            />
                          </td>

                          <td>₹{lineTotal.toFixed(2)}</td>

                          <td>
                            <button
                              type="button"
                              className="btn btn-outline-danger btn-sm"
                              onClick={() =>
                                removeItem(index)
                              }
                              disabled={
                                form.purchaseItems.length === 1
                              }
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

              <div className="text-end mt-3">
                <p>
                  <strong>
                    Subtotal: ₹{subtotal.toFixed(2)}
                  </strong>
                </p>

                <p>
                  <strong>
                    Tax: ₹{taxAmount.toFixed(2)}
                  </strong>
                </p>

                <h4>
                  Total: ₹{grandTotal.toFixed(2)}
                </h4>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Purchase"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PurchaseEditModal;