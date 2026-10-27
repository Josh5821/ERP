
import { useEffect, useState } from "react";
import api from "../../axiosConfig";

const PRODUCT_API = "/api/erp/products";

const emptyForm = {
  productName: "",
  description: "",
  price: "",
};

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // GET all products
  const fetchProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get(PRODUCT_API);

      if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        setProducts([]);
        setError("Product API did not return a list.");
      }
    } catch (err) {
      console.error(err);
      setError("Unable to fetch products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Clear inputs and exit edit mode
  const resetForm = () => {
    setFormData({ ...emptyForm });
    setEditingId(null);
    setError("");
    setSuccess("");
  };

  // Fill the same inputs with selected product details
  const handleEdit = (product) => {
    setEditingId(product.id);

    setFormData({
      productName: product.productName ?? "",
      description: product.description ?? "",
      price: product.price ?? "",
    });

    setError("");
    setSuccess("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // POST for Add, PUT for Edit
  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const productData = {
        productName: formData.productName.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
      };

      if (editingId !== null) {
        await api.put(
          `${PRODUCT_API}/${editingId}`,
          productData
        );

        setSuccess("Product updated successfully!");
      } else {
        await api.post(PRODUCT_API, productData);

        setSuccess("Product added successfully!");
      }

      resetForm();
      await fetchProducts();
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          (editingId !== null
            ? "Unable to update product."
            : "Unable to add product.")
      );
    } finally {
      setSaving(false);
    }
  };

  // Delete

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
        "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
        await api.delete(`${PRODUCT_API}/${id}`);

        setSuccess("Product deleted successfully!");
        setError("");

        await fetchProducts();
    } catch (err) {
        console.error(err);
        setError(
            err.response?.data?.message ||
            "Failed to delete product."
        );
        setSuccess("");
    }
};

  return (
    <div className="container-fluid py-4">
      <h2 className="mb-4">Product Management</h2>

      {/* Add/Edit Form */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header">
          <h5 className="mb-0">
            {editingId !== null ? "Edit Product" : "Add Product"}
          </h5>
        </div>

        <div className="card-body">
          {error && (
            <div className="alert alert-danger">{error}</div>
          )}

          {success && (
            <div className="alert alert-success">{success}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Description</label>
                <input
                  type="text"
                  className="form-control"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter description"
                  required
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Price</label>
                <input
                  type="number"
                  className="form-control"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Enter selling price"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary me-2"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId !== null
                  ? "Update Product"
                  : "Add Product"}
            </button>

            {editingId !== null && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={resetForm}
              >
                Cancel Edit
              </button>
            )}
          </form>
        </div>
      </div>

      {/* Product DataTable */}
      <div className="card shadow-sm">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Product List</h5>

          <button
            className="btn btn-outline-primary btn-sm"
            onClick={fetchProducts}
            disabled={loading}
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th>S.No</th>
                  <th>Product ID</th>
                  <th>Product Name</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {products.length > 0 ? (
                  products.map((product, index) => (
                    <tr key={product.id}>
                      <td>{index + 1}</td>
                      <td>{product.id}</td>
                      <td>{product.productName}</td>
                      <td>{product.description}</td>
                      <td>
                        {Number(product.price).toLocaleString(
                          "en-IN",
                          {
                            style: "currency",
                            currency: "INR",
                          }
                        )}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => handleEdit(product)}
                        >
                          Edit
                        </button>
                        <button
                            className="btn btn-danger btn-sm me-2"
                            onClick={() => handleDelete(product.id)}
                        >
                            Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">
                      {loading
                        ? "Loading products..."
                        : "No products found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <p className="text-muted mb-0">
            Total products: {products.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;
