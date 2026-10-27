import { useEffect, useState } from "react";
import api from "../axiosConfig";
import EditSupplierModal from "./EditSupplierModal";
import SupplierViewModal from "./SupplierViewModal";

const SUPPLIER_API = "http://localhost:8080/api/erp/supplier";
const PRODUCT_API = "http://localhost:8080/api/erp/products";

const emptySupplier = {
  supplierName: "",
  description: "",
  address: "",
  email: "",
  phone: "",
  productIds: [],
};

export default function SupplierManagement() {
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [supplier, setSupplier] = useState(emptySupplier);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [viewingSupplierId, setViewingSupplierId] = useState(null);

  useEffect(() => {
    fetchSuppliers();
    fetchProducts();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await api.get(SUPPLIER_API);
      setSuppliers(response.data);
    } catch (err) {
      console.error("Error fetching suppliers:", err);
      setError("Unable to load suppliers.");
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.get(PRODUCT_API);
      setProducts(response.data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Unable to load products. Check the product API URL.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSupplier((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProductChange = (productId) => {
    setSupplier((prev) => {
      const selected = prev.productIds.includes(productId);

      return {
        ...prev,
        productIds: selected
          ? prev.productIds.filter((id) => id !== productId)
          : [...prev.productIds, productId],
      };
    });
  };

  const openModal = () => {
    setSupplier({ ...emptySupplier, productIds: [] });
    setError("");
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      await api.post(SUPPLIER_API, supplier);

      setShowModal(false);
      setSupplier({ ...emptySupplier, productIds: [] });

      await fetchSuppliers();
    } catch (err) {
      console.error("Error adding supplier:", err);
      setError(
        err.response?.data?.message || "Unable to add supplier."
      );
    } finally {
      setSaving(false);
    }
  };

  const filteredSuppliers = suppliers.filter((item) =>
    `${item.supplierName} ${item.email} ${item.phone}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Search products

      const filteredProducts = products.filter((product) => {
      const alreadySelected = supplier.productIds.includes(
        Number(product.id)
      );

      return (
        !alreadySelected &&
        product.productName
          .toLowerCase()
          .includes(productSearch.toLowerCase())
      );
    });

    const selectProduct = (product) => {
      setSupplier((prev) => ({
        ...prev,
        productIds: [...prev.productIds, Number(product.id)],
      }));

      setProductSearch("");
      setShowSuggestions(false);
    };

    const removeProduct = (productId) => {
      setSupplier((prev) => ({
        ...prev,
        productIds: prev.productIds.filter(
          (id) => Number(id) !== Number(productId)
        ),
      }));
    };

    // Delete
    const deleteSupplier = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this supplier?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`${SUPPLIER_API}/${id}`);

      alert("Supplier deleted successfully!");

      await fetchSuppliers();
    } catch (err) {
      console.error("Error deleting supplier:", err);

      alert(
        err.response?.data?.message ||
          "Unable to delete supplier."
      );
    }
  };

  return (
    <>
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Supplier Management</h3>

        <button className="btn btn-primary" onClick={openModal}>
          + Add Supplier
        </button>
      </div>

      {error && !showModal && (
        <div className="alert alert-danger">{error}</div>
      )}

      <div className="card shadow-sm">
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Search suppliers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th>S.No</th>
                  <th>Supplier Name</th>                  
                  <th>Email</th>
                  <th>Phone</th>
                   <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredSuppliers.length > 0 ? (
                  filteredSuppliers.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.supplierName}</td>
                      <td>{item.email}</td>
                      <td>{item.phone}</td>
                      {/* <td>
                        {item.products?.length
                          ? item.products
                              .map((product) => product.productName)
                              .join(", ")
                          : "No products"}
                      </td> */}
                      <td>
                        <button
                          className="btn btn-info btn-sm me-2"
                          onClick={() => setViewingSupplierId(item.id)}
                        >
                          View
                        </button>
                        <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => setEditingSupplier(item)}
                      >
                        Edit
                      </button> 
                      <button
                      className="btn btn-danger btn-sm me-2"
                      onClick={() => deleteSupplier(item.id)}
                    >
                      Delete
                    </button>

                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      No suppliers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Edit Supplier Modal */}
        <EditSupplierModal
          supplier={editingSupplier}
          onClose={() => setEditingSupplier(null)}
          onUpdated={fetchSuppliers}
        />
      {/* View Supplier Modal */}
        <SupplierViewModal
          supplierId={viewingSupplierId}
          onClose={() => setViewingSupplierId(null)}
        />

      {/* Add Supplier Modal */}
      {showModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">Add Supplier</h5>

                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  />
                </div>

                <div className="modal-body">
                  {error && (
                    <div className="alert alert-danger">{error}</div>
                  )}

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Supplier Name</label>
                      <input
                        className="form-control"
                        name="supplierName"
                        value={supplier.supplierName}
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
                        value={supplier.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Phone</label>
                      <input
                        className="form-control"
                        name="phone"
                        value={supplier.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Address</label>
                      <input
                        className="form-control"
                        name="address"
                        value={supplier.address}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-12 mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        name="description"
                        value={supplier.description}
                        onChange={handleChange}
                        rows="2"
                      />
                    </div>
                  </div>

                  <hr />
                    
<div className="mb-3 position-relative">
  <label className="form-label">Search Products</label>

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
      setTimeout(() => setShowSuggestions(false), 150);
    }}
  />

  {showSuggestions && productSearch.trim() && (
    <div
      className="list-group position-absolute w-100 shadow"
      style={{
        zIndex: 1055,
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
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => selectProduct(product)}
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

          <div className="mb-3">
            <label className="form-label">Selected Products</label>

            {supplier.productIds.length === 0 ? (
              <p className="text-muted">No products selected.</p>
            ) : (
              <div className="d-flex flex-wrap gap-2">
                {supplier.productIds.map((productId) => {
                  const product = products.find(
                    (p) => Number(p.id) === Number(productId)
                  );

                  if (!product) return null;

                  return (
                    <span
                      key={productId}
                      className="badge bg-primary d-flex align-items-center gap-2 p-2"
                    >
                      {product.productName}

                      <button
                        type="button"
                        className="btn-close btn-close-white"
                        aria-label={`Remove ${product.productName}`}
                        onClick={() => removeProduct(productId)}
                      />
                    </span>
                  );
                })}
              </div>
            )}
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

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save Supplier"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
    </div>
      
    </>
  );
}
