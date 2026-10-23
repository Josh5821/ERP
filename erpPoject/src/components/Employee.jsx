import { useEffect, useState } from "react";
import api from "../axiosConfig";
import "bootstrap/dist/css/bootstrap.min.css";


const EMPLOYEE_API = "/api/erp/employee";
const ROLE_API = "/api/erp/role";

const emptyEmployee = {
  username: "",
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  address: "",
  password:"",
  roleIds: [],
};

function Employee() {
  const [employees, setEmployees] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ---- Search + pagination state ----
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // ---- Add modal state ----
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmployee, setNewEmployee] = useState(emptyEmployee);

  // ---- Edit modal state ----
  const [showEditModal, setShowEditModal] = useState(false);
  const [editEmployee, setEditEmployee] = useState(emptyEmployee);
  const [editingId, setEditingId] = useState(null);

  // ---- View modal state ----
  const [viewEmployee, setViewEmployee] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  

  // ---------------- Fetch data ----------------
  const fetchEmployees = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get(EMPLOYEE_API);
      setEmployees(response.data);
    } catch (err) {
      console.error("Error fetching employees:", err);
      setError("Unable to load employees.");
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await api.get(ROLE_API);
      console.log("Employee API response:", response.data);
      setRoles(response.data);
    } catch (err) {
      console.error("Error fetching roles:", err);
      setError("Unable to load roles.");
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchRoles();
  }, []);

  // ---------------- ADD ----------------
  const openAddModal = () => {
    setNewEmployee({ ...emptyEmployee, roleIds: [] });
    setMessage("");
    setError("");
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
    setNewEmployee({ ...emptyEmployee, roleIds: [] });
  };

  const handleAddChange = (event) => {
    const { name, value } = event.target;
    setNewEmployee((previous) => ({ ...previous, [name]: value }));
  };

  const handleAddRoleChange = (event) => {
    const roleId = event.target.value;
    setNewEmployee((previous) => ({
      ...previous,
      roleIds: roleId ? [Number(roleId)] : [],
    }));
  };

  const handleAddSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const response = await api.post(EMPLOYEE_API, newEmployee);
      setMessage(`Employee ${response.data.firstName} added successfully.`);
      closeAddModal();
      await fetchEmployees();
    } catch (err) {
      console.error("Error adding employee:", err);
      setError(
        err.response?.data?.message ||
          "Unable to add employee. Please check the backend."
      );
    } finally {
      setSaving(false);
    }
  };

  // ---------------- EDIT ----------------
  const openEditModal = (emp) => {
    setEditEmployee({
      username: emp.username || "",
      firstName: emp.firstName || "",
      lastName: emp.lastName || "",
      email: emp.email || "",
      phoneNumber: emp.phoneNumber || "",
      address: emp.address || "",
      roleIds: emp.roles?.map((role) => Number(role.id)) || [],
    });
    setEditingId(emp.id);
    setMessage("");
    setError("");
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingId(null);
    setEditEmployee({ ...emptyEmployee, roleIds: [] });
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditEmployee((previous) => ({ ...previous, [name]: value }));
  };

  const handleEditRoleChange = (event) => {
    const roleId = event.target.value;
    setEditEmployee((previous) => ({
      ...previous,
      roleIds: roleId ? [Number(roleId)] : [],
    }));
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      // PUT updates the existing record instead of creating a new one
      await api.put(`${EMPLOYEE_API}/${editingId}`, editEmployee);
      setMessage("Employee updated successfully.");
      closeEditModal();
      await fetchEmployees();
    } catch (err) {
      console.error("Error updating employee:", err);
      setError(
        err.response?.data?.message ||
          "Unable to update employee. Please check the backend."
      );
    } finally {
      setSaving(false);
    }
  };

  // ---------------- DELETE ----------------
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(`${EMPLOYEE_API}/${id}`);
      setMessage("Employee deleted successfully.");
      await fetchEmployees();
    } catch (err) {
      console.error("Error deleting employee:", err);
      setError(err.response?.data?.message || "Failed to delete employee.");
    }
  };

  //---------------- View By Id ----------------

    const handleView = async (id) => {
    try {
      const response = await api.get(`${EMPLOYEE_API}/${id}`);

      setViewEmployee(response.data);
      setShowViewModal(true);
    } catch (err) {
      console.error("Error fetching employee:", err);
      setError("Unable to fetch employee details.");
    }
  };

  // ---------------- SEARCH + PAGINATION ----------------
  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filteredEmployees = employees.filter((emp) => {
    if (!normalizedSearch) {
      return true;
    }

    const roleNames = emp.roles?.map((role) => role.role).join(" ") || "";

    return [
      emp.id,
      emp.username,
      emp.firstName,
      emp.lastName,
      emp.email,
      emp.phoneNumber,
      emp.address,
      roleNames,
    ]
      .join(" ")
      .toLowerCase()
      .includes(normalizedSearch);
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredEmployees.length / pageSize)
  );

  // Keeps the page valid after a delete or a new search shrinks the list
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredEmployees.length);
  const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setCurrentPage(1);
  };

  // Builds e.g. [1, "...", 4, 5, 6, "...", 12]
  const getPageNumbers = () => {
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(i - safePage) <= 1) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }

    return pages;
  };

  // ---------------- UI ----------------
  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Employee Management</h2>

        <button className="btn btn-primary" onClick={openAddModal}>
          + Add Employee
        </button>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Search + rows per page */}
      <div className="row g-2 align-items-left mb-3">
        <div className="col-lg-4 col-md-6 col-4">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Search by name, email, username, role..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {searchTerm && (
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => {
                  setSearchTerm("");
                  setCurrentPage(1);
                }}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="col-12 col-md-auto ms-md-auto d-flex align-items-center">
          <label className="me-2 mb-0 text-nowrap" htmlFor="pageSize">
            Rows per page
          </label>
          <select
            id="pageSize"
            className="form-select form-select-sm w-auto"
            value={pageSize}
            onChange={handlePageSizeChange}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Employee Data Table */}
      <div className="table-responsive shadow-sm">
        <table className="table table-bordered table-striped table-hover align-middle mb-0">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Address</th>
              <th>Roles</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className="text-center p-4">
                  Loading employees...
                </td>
              </tr>
            ) : filteredEmployees.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center p-4">
                  {searchTerm
                    ? `No employees match "${searchTerm}".`
                    : "No employees found."}
                </td>
              </tr>
            ) : (
              paginatedEmployees.map((emp,index) => (
                <tr key={emp.id}>
                  <td>{index+1}</td>
                  <td>{emp.username}</td>
                  <td>{emp.firstName}</td>
                  <td>{emp.lastName}</td>
                  <td>{emp.email}</td>
                  <td>{emp.phoneNumber}</td>
                  <td>{emp.address}</td>
                  <td>
                    {emp.roles?.length
                      ? emp.roles.map((role) => role.role).join(", ")
                      : "No roles"}
                  </td>
                  <td>
                    <button
                    className="btn btn-info btn-sm me-2"
                    onClick={() => handleView(emp.id)}
                  >
                    View
                  </button>

                    <button
                      type="button"
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => openEditModal(emp)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(emp.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!loading && filteredEmployees.length > 0 && (
        <div className="d-flex flex-wrap justify-content-between align-items-center mt-3 gap-2">
          <small className="text-muted">
            Showing {startIndex + 1}–{endIndex} of {filteredEmployees.length}{" "}
            {filteredEmployees.length === 1 ? "employee" : "employees"}
            {searchTerm && ` (filtered from ${employees.length})`}
          </small>

          <nav aria-label="Employee pages">
            <ul className="pagination pagination-sm mb-0">
              <li className={`page-item ${safePage === 1 ? "disabled" : ""}`}>
                <button
                  type="button"
                  className="page-link"
                  onClick={() => setCurrentPage(safePage - 1)}
                  disabled={safePage === 1}
                >
                  Previous
                </button>
              </li>

              {getPageNumbers().map((page, index) =>
                page === "..." ? (
                  <li key={`gap-${index}`} className="page-item disabled">
                    <span className="page-link">…</span>
                  </li>
                ) : (
                  <li
                    key={page}
                    className={`page-item ${page === safePage ? "active" : ""}`}
                  >
                    <button
                      type="button"
                      className="page-link"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  </li>
                )
              )}

              <li
                className={`page-item ${
                  safePage === totalPages ? "disabled" : ""
                }`}
              >
                <button
                  type="button"
                  className="page-link"
                  onClick={() => setCurrentPage(safePage + 1)}
                  disabled={safePage === totalPages}
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}

      {/* ================= ADD EMPLOYEE MODAL ================= */}
      {showAddModal && (
        <div
          className="modal d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <form onSubmit={handleAddSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">Add Employee</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeAddModal}
                    aria-label="Close"
                  />
                </div>

                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Username</label>
                      <input
                        className="form-control"
                        name="username"
                        value={newEmployee.username}
                        onChange={handleAddChange}
                        required
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">First Name</label>
                      <input
                        className="form-control"
                        name="firstName"
                        value={newEmployee.firstName}
                        onChange={handleAddChange}
                        required
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Last Name</label>
                      <input
                        className="form-control"
                        name="lastName"
                        value={newEmployee.lastName}
                        onChange={handleAddChange}
                        required
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={newEmployee.email}
                        onChange={handleAddChange}
                        required
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Phone Number</label>
                      <input
                        className="form-control"
                        name="phoneNumber"
                        value={newEmployee.phoneNumber}
                        onChange={handleAddChange}
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Role</label>
                      <select
                        className="form-select"
                        value={newEmployee.roleIds[0] ?? ""}
                        onChange={handleAddRoleChange}
                        required
                      >
                        <option value="">-- Select Role --</option>
                        {roles.map((role) => (
                          <option key={role.id} value={role.id}>
                            {role.role}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-12 mb-3">
                      <label className="form-label">Address</label>
                      <textarea
                        className="form-control"
                        name="address"
                        rows="2"
                        value={newEmployee.address}
                        onChange={handleAddChange}
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        name="password"
                        value={newEmployee.password}
                        onChange={handleAddChange}
                        autoComplete="new-password"
                        required
                        minLength={6}
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeAddModal}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save Employee"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ================= EDIT EMPLOYEE MODAL ================= */}
      {showEditModal && (
        <div
          className="modal d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <form onSubmit={handleEditSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">Edit Employee</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeEditModal}
                    aria-label="Close"
                  />
                </div>

                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Username</label>
                      <input
                        className="form-control"
                        name="username"
                        value={editEmployee.username}
                        onChange={handleEditChange}
                        required
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">First Name</label>
                      <input
                        className="form-control"
                        name="firstName"
                        value={editEmployee.firstName}
                        onChange={handleEditChange}
                        required
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Last Name</label>
                      <input
                        className="form-control"
                        name="lastName"
                        value={editEmployee.lastName}
                        onChange={handleEditChange}
                        required
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={editEmployee.email}
                        onChange={handleEditChange}
                        required
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Phone Number</label>
                      <input
                        className="form-control"
                        name="phoneNumber"
                        value={editEmployee.phoneNumber}
                        onChange={handleEditChange}
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Role</label>
                      <select
                        className="form-select"
                        value={editEmployee.roleIds[0] ?? ""}
                        onChange={handleEditRoleChange}
                        required
                      >
                        <option value="">-- Select Role --</option>
                        {roles.map((role) => (
                          <option key={role.id} value={role.id}>
                            {role.role}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-12 mb-3">
                      <label className="form-label">Address</label>
                      <textarea
                        className="form-control"
                        name="address"
                        rows="2"
                        value={editEmployee.address}
                        onChange={handleEditChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeEditModal}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                  >
                    {saving ? "Updating..." : "Update Employee"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ================= VIEW EMPLOYEE MODAL ================= */}

            {showViewModal && viewEmployee && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">Employee Details</h5>

                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowViewModal(false)}
                />
              </div>

              <div className="modal-body">
                <p><strong>ID:</strong> {viewEmployee.id}</p>
                <p><strong>Username:</strong> {viewEmployee.username}</p>
                <p><strong>First Name:</strong> {viewEmployee.firstName}</p>
                <p><strong>Last Name:</strong> {viewEmployee.lastName}</p>
                <p><strong>Email:</strong> {viewEmployee.email}</p>
                <p><strong>Phone:</strong> {viewEmployee.phoneNumber}</p>
                <p><strong>Address:</strong> {viewEmployee.address}</p>

                <p>
                  <strong>Roles:</strong>{" "}
                  {viewEmployee.roles?.map((role) => role.role).join(", ") || "No roles"}
                </p>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowViewModal(false)}
                >
                  Close
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Employee;