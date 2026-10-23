import { useEffect, useState } from "react";
import api from "../../axiosConfig";

const CUSTOMER_API = "/api/erp/customer";
const EMPLOYEE_API = "/api/erp/employee";

function EditCustomerModal({ customer, onClose, onUpdated }) {
  const [employees, setEmployees] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
    employeeId: "",
  });

  useEffect(() => {
    if (!customer) return;

    setFormData({
      customerName: customer.customerName || "",
      email: customer.email || "",
      phone: customer.phone || "",
      address: customer.address || "",
      employeeId: customer.employee?.id
        ? String(customer.employee.id)
        : "",
    });

    api
      .get(EMPLOYEE_API)
      .then((response) => setEmployees(response.data))
      .catch(() => setError("Failed to load employees."));
  }, [customer]);

  if (!customer) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      customerName: formData.customerName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      employee: formData.employeeId
        ? { id: Number(formData.employeeId) }
        : null,
    };

    try {
      await api.put(`${CUSTOMER_API}/${customer.id}`, payload);
      await onUpdated();
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to update customer."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Edit Customer</h5>
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

              <div className="mb-3">
                <label className="form-label">Customer Name</label>
                <input
                  className="form-control"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
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

              <div className="mb-3">
                <label className="form-label">Phone</label>
                <input
                  className="form-control"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Address</label>
                <textarea
                  className="form-control"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Assigned Employee</label>
                <select
                  className="form-select"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                >
                  <option value="">No employee assigned</option>
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.firstName} {employee.lastName}
                    </option>
                  ))}
                </select>
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
                disabled={saving}
              >
                {saving ? "Updating..." : "Update Customer"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditCustomerModal;