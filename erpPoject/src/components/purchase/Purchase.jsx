
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../axiosConfig";
import "./Purchase.css";
import PurchaseEditModal from "./PurchaseEditModal";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const API = "/api/erp";

function Purchase() {
  const [purchases, setPurchases] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);

  const [supplierId, setSupplierId] = useState("");
  const [purchaseDate, setPurchaseDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  const navigate = useNavigate();

  const [items, setItems] = useState([
    {
      productId: "",
      purchasePrice: "",
      quantity: 1,
      taxPercent: 18,
    },
  ]);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Load purchases, suppliers and products
  useEffect(() => {
    loadPurchases();
    loadSuppliers();
    loadProducts();
  }, []);

  // GET: Load all purchases
  async function loadPurchases() {
    try {
      const response = await api.get(`${API}/purchase`);
      setPurchases(response.data);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Unable to load purchases."
      );
    }
  }

  // GET: Load all suppliers
  async function loadSuppliers() {
    try {
      const response = await api.get(`${API}/supplier`);
      setSuppliers(response.data);
    } catch (error) {
      console.error("Unable to load suppliers:", error);
      setMessage("Unable to load suppliers.");
    }
  }

  // GET: Load all products
  async function loadProducts() {
    try {
      const response = await api.get(`${API}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error("Unable to load products:", error);
      setMessage("Unable to load products.");
    }
  }

  //Delete 

  const deletePurchase = async (id) => {
  const confirmed = window.confirm(
    `Are you sure you want to delete purchase ${id}?`
  );

  if (!confirmed) return;

  try {
    await api.delete(`${API}/purchase/${id}`);

    alert("Purchase deleted successfully!");

    // Refresh the purchase list
    await loadPurchases();

  } catch (error) {
    console.error("Error deleting purchase:", error);

    alert(
      error.response?.data?.message ||
      "Failed to delete purchase."
    );
  }
};

  // Update a particular item row
  function handleItemChange(index, field, value) {
    setItems((previousItems) =>
      previousItems.map((item, i) => {
        if (i !== index) return item;

        const updatedItem = { ...item, [field]: value };

        if (field === "productId") {
          const product = products.find(
            (p) => String(p.id) === String(value)
          );

          if (product) {
            updatedItem.purchasePrice = product.price ?? "";
          }
        }

        return updatedItem;
      })
    );
  }

  // Add another item row
  function addItemRow() {
    setItems((previousItems) => [
      ...previousItems,
      {
        productId: "",
        purchasePrice: "",
        quantity: 1,
        taxPercent: 18,
      },
    ]);
  }

  // Remove an item row
  function removeItemRow(index) {
    setItems((previousItems) =>
      previousItems.filter((_, i) => i !== index)
    );
  }

  // Calculate subtotal
  const subtotal = items.reduce(
    (sum, item) =>
      sum +
      Number(item.purchasePrice || 0) *
        Number(item.quantity || 0),
    0
  );

  // Calculate total tax
  const totalTax = items.reduce((sum, item) => {
    const amount =
      Number(item.purchasePrice || 0) *
      Number(item.quantity || 0);

    return (
      sum +
      (amount * Number(item.taxPercent || 0)) / 100
    );
  }, 0);

  const grandTotal = subtotal + totalTax;

  // Reset add-purchase form
  function resetForm() {
    setSupplierId("");
    setPurchaseDate(new Date().toISOString().slice(0, 10));

    setItems([
      {
        productId: "",
        purchasePrice: "",
        quantity: 1,
        taxPercent: 18,
      },
    ]);
  }

  // POST: Add a new purchase
  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    if (!supplierId) {
      setMessage("Please select a supplier.");
      return;
    }

    if (!purchaseDate) {
      setMessage("Please select a purchase date.");
      return;
    }

    if (
      items.length === 0 ||
      items.some(
        (item) =>
          !item.productId ||
          item.purchasePrice === "" ||
          !Number.isFinite(Number(item.purchasePrice)) ||
          Number(item.purchasePrice) < 0 ||
          !Number.isInteger(Number(item.quantity)) ||
          Number(item.quantity) <= 0 ||
          item.taxPercent === "" ||
          !Number.isFinite(Number(item.taxPercent)) ||
          Number(item.taxPercent) < 0 ||
          Number(item.taxPercent) > 100
      )
    ) {
      setMessage(
        "Please enter valid details for every purchase item."
      );
      return;
    }

    const payload = {
      supplierId: Number(supplierId),
      purchaseDate,
      purchaseItems: items.map((item) => ({
        productId: Number(item.productId),
        purchasePrice: Number(item.purchasePrice),
        quantity: Number(item.quantity),
        taxPercent: Number(item.taxPercent),
      })),
    };

    try {
      setLoading(true);

      await api.post(`${API}/purchase`, payload);

      setShowModal(false);
      resetForm();
      setMessage("Purchase added successfully.");

      await loadPurchases();
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to save purchase."
      );
    } finally {
      setLoading(false);
    }
  }

  // Format currency
  function money(value) {
    return Number(value ?? 0).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    });
  }

  return (
    <div className="container-fluid py-4">
      {/* Page header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Purchase Management</h2>
          <p className="text-muted mb-0">
            Manage supplier purchases and purchase items
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setMessage("");
            setShowModal(true);
          }}
        >
          + Add Purchase
        </button>
      </div>

      {/* Messages */}
      {message && (
        <div className="alert alert-info" role="alert">
          {message}

          <button
            type="button"
            className="btn-close float-end"
            onClick={() => setMessage("")}
            aria-label="Close"
          />
        </div>
      )}

      {/* Purchase table */}
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Supplier</th>
                  <th>Purchase Date</th>
                  <th>Subtotal</th>
                  <th>Tax</th>
                  <th>Grand Total</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {purchases.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center py-4"
                    >
                      No purchase records found.
                    </td>
                  </tr>
                ) : (
                  purchases.map((purchase) => (
                    <tr key={purchase.id}>
                      <td>{purchase.id}</td>

                      <td>
                        {purchase.supplier?.supplierName ??
                          `Supplier #${purchase.supplier?.id ?? ""}`}
                      </td>

                      <td>{purchase.purchaseDate}</td>

                      <td>{money(purchase.subtotal)}</td>

                      <td>{money(purchase.taxAmount)}</td>

                      <td className="fw-bold">
                        {money(purchase.totalAmount)}
                      </td>

                      <td>
                       
                        <div className="dropdown">
                        <button
                            className="btn btn-primary btn-sm dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            Actions
                        </button>

                        <ul className="dropdown-menu dropdown-menu-end">
                            <li>
                            <button
                                type="button"
                                className="dropdown-item"
                                onClick={() => setSelectedPurchase(purchase)}
                            >
                                ✏️ Edit
                            </button>
                            </li>

                            <li>
                            <button
                                type="button"
                                className="dropdown-item"
                                onClick={() => deletePurchase(purchase.id)}
                            >
                                🗑️ Delete
                            </button>
                            </li>

                            <li>
                            <button
                                type="button"
                                className="dropdown-item"
                                onClick={() =>
                                navigate(`/purchase-payments/${purchase.id}`)
                                }
                            >
                                💳 Payment
                            </button>
                            </li>

                            <li>
                            <button
                                type="button"
                                className="dropdown-item"
                                onClick={() =>
                                navigate(`/purchase-invoice/${purchase.id}`)
                                }
                            >
                                🖨️ Print Invoice
                            </button>
                            </li>
                        </ul>
                        </div>

                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      

      {/* Edit Purchase Modal */}
      {selectedPurchase && (
        <PurchaseEditModal
          purchase={selectedPurchase}
          onClose={() => setSelectedPurchase(null)}
          onUpdated={loadPurchases}
        />
      )}

      {/* Add Purchase Modal */}
      {showModal && (
        <div
          className="purchase-modal-backdrop"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !loading
            ) {
              setShowModal(false);
            }
          }}
        >
          <div
            className="purchase-modal bg-white rounded shadow-lg"
            role="dialog"
            aria-modal="true"
            aria-labelledby="purchase-modal-title"
          >
            <div className="d-flex justify-content-between align-items-center border-bottom p-3">
              <h4
                id="purchase-modal-title"
                className="mb-0"
              >
                Add Purchase
              </h4>

              <button
                type="button"
                className="btn-close"
                onClick={() => setShowModal(false)}
                disabled={loading}
                aria-label="Close"
              />
            </div>

            <form onSubmit={handleSubmit}>
              <div className="p-3">
                {/* Supplier and date */}
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <label className="form-label">
                      Supplier *
                    </label>

                    <select
                      className="form-select"
                      value={supplierId}
                      onChange={(e) =>
                        setSupplierId(e.target.value)
                      }
                      required
                    >
                      <option value="">
                        Select Supplier
                      </option>

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
                      Purchase Date *
                    </label>

                    <input
                      type="date"
                      className="form-control"
                      value={purchaseDate}
                      onChange={(e) =>
                        setPurchaseDate(e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                {/* Purchase items */}
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5>Purchase Items</h5>

                  <button
                    type="button"
                    className="btn btn-sm btn-outline-primary"
                    onClick={addItemRow}
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
                        <th>Qty</th>
                        <th>Tax %</th>
                        <th>Item Total</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {items.map((item, index) => {
                        const lineSubtotal =
                          Number(item.purchasePrice || 0) *
                          Number(item.quantity || 0);

                        const lineTax =
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
                                  handleItemChange(
                                    index,
                                    "productId",
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
                                min="0"
                                step="0.01"
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
                                min="1"
                                step="1"
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
                                min="0"
                                max="100"
                                step="0.01"
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

                            <td className="text-nowrap">
                              {money(lineSubtotal + lineTax)}
                            </td>

                            <td>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                onClick={() =>
                                  removeItemRow(index)
                                }
                                disabled={items.length === 1}
                                title="Remove item"
                              >
                                ×
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div
                  className="ms-auto mt-3"
                  style={{ maxWidth: 300 }}
                >
                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal</span>
                    <strong>{money(subtotal)}</strong>
                  </div>

                  <div className="d-flex justify-content-between mb-2">
                    <span>Total Tax</span>
                    <strong>{money(totalTax)}</strong>
                  </div>

                  <hr />

                  <div className="d-flex justify-content-between fs-5">
                    <span>Grand Total</span>
                    <strong>{money(grandTotal)}</strong>
                  </div>
                </div>
              </div>

              {/* Modal footer */}
              <div className="border-top p-3 d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                  disabled={loading}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Purchase"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Purchase;
