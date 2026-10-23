
import { useEffect, useState } from "react";
import api from "../axiosConfig";

const SUPPLIER_API = "/api/erp/supplier";

const SupplierViewModal = ({ supplierId, onClose }) => {
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (supplierId == null) return;

    const fetchSupplier = async () => {
      setLoading(true);
      setError("");
      setSupplier(null);

      try {
        const response = await api.get(
          `${SUPPLIER_API}/${supplierId}`
        );

        setSupplier(response.data);
      } catch (err) {
        console.error("Error fetching supplier:", err);
        setError("Unable to load supplier details.");
      } finally {
        setLoading(false);
      }
    };

    fetchSupplier();
  }, [supplierId]);

  if (supplierId == null) return null;

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Supplier Details</h5>

            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            />
          </div>

          <div className="modal-body">
            {loading ? (
              <div className="text-center p-4">
                <div className="spinner-border text-primary" />
                <p className="mt-2">Loading supplier details...</p>
              </div>
            ) : error ? (
              <div className="alert alert-danger">{error}</div>
            ) : supplier ? (
              <>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <strong>Supplier ID</strong>
                    <p>{supplier.id}</p>
                  </div>

                  <div className="col-md-6 mb-3">
                    <strong>Supplier Name</strong>
                    <p>{supplier.supplierName}</p>
                  </div>

                  <div className="col-md-6 mb-3">
                    <strong>Email</strong>
                    <p>{supplier.email}</p>
                  </div>

                  <div className="col-md-6 mb-3">
                    <strong>Phone</strong>
                    <p>{supplier.phone}</p>
                  </div>

                  <div className="col-md-6 mb-3">
                    <strong>Address</strong>
                    <p>{supplier.address}</p>
                  </div>

                  <div className="col-12 mb-3">
                    <strong>Description</strong>
                    <p>{supplier.description || "No description"}</p>
                  </div>
                </div>

                <hr />

                <h6>Associated Products</h6>

                {supplier.products?.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-bordered table-sm">
                      <thead className="table-light">
                        <tr>
                          <th>S.No</th>
                          <th>Product ID</th>
                          <th>Product Name</th>
                        </tr>
                      </thead>

                      <tbody>
                        {supplier.products.map((product, index) => (
                          <tr key={product.id}>
                            <td>{index + 1}</td>
                            <td>{product.id}</td>
                            <td>{product.productName}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted">
                    No products associated with this supplier.
                  </p>
                )}
              </>
            ) : null}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierViewModal;
