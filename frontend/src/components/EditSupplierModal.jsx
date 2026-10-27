
import { useEffect, useState } from "react";
import api from "../axiosConfig";

const SUPPLIER_API = "http://localhost:8080/api/erp/supplier";
const PRODUCT_API = "http://localhost:8080/api/erp/products";

const EditSupplierModal = ({ supplier, onClose, onUpdated }) => {
  const [products, setProducts] = useState([]);

  const [formData, setFormData] = useState({
    supplierName: "",
    description: "",
    address: "",
    email: "",
    phone: "",
    productIds: [],
  });

  const [productSearch, setProductSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!supplier) return;

    setError("");
    setProductSearch("");
    setShowSuggestions(false);

    setFormData({
      supplierName: supplier.supplierName ?? "",
      description: supplier.description ?? "",
      address: supplier.address ?? "",
      email: supplier.email ?? "",
      phone: supplier.phone ?? "",
      // Keep the products already assigned to this supplier
      productIds: (supplier.products ?? []).map((p) =>
        Number(p.id)
      ),
    });

    fetchProducts();
  }, [supplier]);

  const fetchProducts = async () => {
    try {
      const response = await api.get(PRODUCT_API);

      if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        setProducts([]);
        setError("Product API did not return a list.");
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Unable to load products.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add a product without removing existing selections
  const selectProduct = (product) => {
    const productId = Number(product.id);

    setFormData((prev) => ({
      ...prev,
      productIds: prev.productIds.includes(productId)
        ? prev.productIds
        : [...prev.productIds, productId],
    }));

    setProductSearch("");
    setShowSuggestions(false);
  };

  // Remove a selected product
  const removeProduct = (productId) => {
    setFormData((prev) => ({
      ...prev,
      productIds: prev.productIds.filter(
        (id) => Number(id) !== Number(productId)
      ),
    }));
  };

  // Show matching products that haven't been selected yet
  const filteredProducts = products.filter((product) => {
    const alreadySelected = formData.productIds.includes(
      Number(product.id)
    );

    return (
      !alreadySelected &&
      product.productName
        ?.toLowerCase()
        .includes(productSearch.trim().toLowerCase())
    );
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      await api.put(
        `${SUPPLIER_API}/${supplier.id}`,
        formData
      );

      await onUpdated();
      onClose();
    } catch (err) {
      console.error("Error updating supplier:", err);
      setError(
        err.response?.data?.message ||
          "Unable to update supplier."
      );
    } finally {
      setSaving(false);
    }
  };

  if (!supplier) return null;

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <form onSubmit={handleUpdate}>
            <div className="modal-header">
              <h5 className="modal-title">Edit Supplier</h5>

              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              />
            </div>

            <div className="modal-body">
              {error && (
                <div className="alert alert-danger">
                  {error}
                </div>
              )}

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">
                    Supplier Name
                  </label>
                  <input
                    className="form-control"
                    name="supplierName"
                    value={formData.supplierName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Phone</label>
                  <input
                    className="form-control"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Address</label>
                  <input
                    className="form-control"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-12 mb-3">
                  <label className="form-label">
                    Description
                  </label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="2"
                  />
                </div>
              </div>

              <hr />

              <h6>Search and Select Products</h6>

              {/* Product search input */}
              <div className="position-relative mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Type a product name..."
                  value={productSearch}
                  onChange={(e) => {
                    setProductSearch(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => {
                    setTimeout(
                      () => setShowSuggestions(false),
                      150
                    );
                  }}
                />

                {showSuggestions &&
                  productSearch.trim() !== "" && (
                    <div
                      className="list-group position-absolute w-100 shadow"
                      style={{
                        zIndex: 1060,
                        maxHeight: "200px",
                        overflowY: "auto",
                      }}
                    >
                      {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                          <button
                            type="button"
                            key={product.id}
                            className="list-group-item list-group-item-action"
                            onMouseDown={(e) =>
                              e.preventDefault()
                            }
                            onClick={() =>
                              selectProduct(product)
                            }
                          >
                            {product.productName}
                          </button>
                        ))
                      ) : (
                        <div className="list-group-item text-muted">
                          No matching products found
                        </div>
                      )}
                    </div>
                  )}
              </div>

              {/* Previously selected and newly selected products */}
              <label className="form-label">
                Selected Products
              </label>

              {formData.productIds.length === 0 ? (
                <p className="text-muted">
                  No products selected.
                </p>
              ) : (
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {formData.productIds.map((productId) => {
                    const product = products.find(
                      (p) => Number(p.id) === Number(productId)
                    );

                    // Keep the selection even if product details
                    // haven't loaded yet.
                    const productName =
                      product?.productName ??
                      `Product ID: ${productId}`;

                    return (
                      <span
                        key={productId}
                        className="badge bg-primary d-flex align-items-center gap-2 p-2"
                      >
                        {productName}

                        <button
                          type="button"
                          className="btn-close btn-close-white"
                          style={{
                            fontSize: "0.65rem",
                          }}
                          aria-label={`Remove ${productName}`}
                          onClick={() =>
                            removeProduct(productId)
                          }
                        />
                      </span>
                    );
                  })}
                </div>
              )}
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
                disabled={saving}
              >
                {saving ? "Updating..." : "Update Supplier"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditSupplierModal;
