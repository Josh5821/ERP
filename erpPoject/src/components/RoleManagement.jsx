
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import api from "../axiosConfig";

const ROLE_API = "/api/erp/role";

function RoleManagement() {
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editRole, setEditRole] = useState({
    role: "",
    description: "",
    });

  const emptyRole = {
    role: "",
    description: "",
  };

  const [role, setRole] = useState(emptyRole);

  // Get all roles
  const fetchRoles = async () => {
    try {
      setLoading(true);

      const response = await api.get(ROLE_API);
      setRoles(response.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load roles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // Edit Modal
  const handleEdit = (item) => {
  setEditingId(item.id);

  setEditRole({
    role: item.role || "",
    description: item.description || "",
  });

  setError("");
  setShowEditModal(true);
};
  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setRole((previousRole) => ({
      ...previousRole,
      [name]: value,
    }));
  };

  // Open modal
  const openModal = () => {
    setRole({ ...emptyRole });
    setError("");
    setShowModal(true);
  };

  // Save role
        const handleSubmit = async (event) => {
            event.preventDefault();

            try {
            setSaving(true);
            setError("");

            await api.post(ROLE_API, role);

            setShowModal(false);
            setRole({ ...emptyRole });

            await fetchRoles();
            } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message || "Failed to add role."
            );
            } finally {
            setSaving(false);
            }
        };

        const handleUpdate = async (event) => {
        event.preventDefault();

        try {
            setSaving(true);
            setError("");

            await api.put(
            `${ROLE_API}/${editingId}`,
            editRole
            );

            setShowEditModal(false);
            setEditingId(null);

            await fetchRoles();
        } catch (err) {
            console.error(err);
            setError(
            err.response?.data?.message || "Failed to update role."
            );
        } finally {
            setSaving(false);
        }
        };

    //Delete
    const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
        "Are you sure you want to delete this role?"
    );

    if (!confirmDelete) {
        return;
    }

    try {
        await api.delete(`${ROLE_API}/${id}`);

        // Refresh the roles table
        await fetchRoles();
    } catch (err) {
        console.error(err);
        setError(
        err.response?.data?.message || "Failed to delete role."
        );
    }
    };

  return (
    <div className="container-fluid p-4">
      {/* Heading and Add button */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Role Management</h2>
          <p className="text-muted">
            View and manage system roles
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={openModal}
        >
          + Add Role
        </button>
      </div>

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      {/* Role table */}
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Role Name</th>
                  <th>Description</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="3" className="text-center">
                      Loading roles...
                    </td>
                  </tr>
                ) : roles.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center">
                      No roles found.
                    </td>
                  </tr>
                ) : (
                  roles.map((item,index) => (
                    <tr key={item.id}>
                      <td>{index+1}</td>
                      <td>{item.role}</td>
                      <td>{item.description}</td>
                      <td>
                        <button
                            className="btn btn-sm btn-warning"
                            onClick={() => handleEdit(item)}
                        >
                            Edit
                        </button>

                        <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(item.id)}
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
        </div>
      </div>

      {/* Add Role Modal */}
      {showModal && (
        <div
          className="modal d-block"
          tabIndex="-1"
          role="dialog"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">Add New Role</h5>

                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                    aria-label="Close"
                  />
                </div>

                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">
                      Role Name
                    </label>

                    <input
                      type="text"
                      className="form-control"
                      name="role"
                      value={role.role}
                      onChange={handleChange}
                      placeholder="Enter role name"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      Description
                    </label>

                    <textarea
                      className="form-control"
                      name="description"
                      value={role.description}
                      onChange={handleChange}
                      placeholder="Enter role description"
                      rows="3"
                      required
                    />
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
                    {saving ? "Saving..." : "Save Role"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
        {/* Edit Role Modal */}
        {showEditModal && (
        <div
            className="modal d-block"
            tabIndex="-1"
            style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
        >
            <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">

                <form onSubmit={handleUpdate}>

                {/* Modal Header */}
                <div className="modal-header">
                    <h5 className="modal-title">
                    Edit Role
                    </h5>

                    <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowEditModal(false)}
                    />
                </div>

                {/* Modal Body */}
                <div className="modal-body">

                    <div className="mb-3">
                    <label className="form-label">
                        Role Name
                    </label>

                    <input
                        type="text"
                        className="form-control"
                        value={editRole.role}
                        onChange={(e) =>
                        setEditRole({
                            ...editRole,
                            role: e.target.value,
                        })
                        }
                        placeholder="Enter role name"
                        required
                    />
                    </div>

                    <div className="mb-3">
                    <label className="form-label">
                        Description
                    </label>

                    <textarea
                        className="form-control"
                        rows="3"
                        value={editRole.description}
                        onChange={(e) =>
                        setEditRole({
                            ...editRole,
                            description: e.target.value,
                        })
                        }
                        placeholder="Enter role description"
                        required
                    />
                    </div>

                </div>

                {/* Modal Footer */}
                <div className="modal-footer">
                    <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowEditModal(false)}
                    >
                    Cancel
                    </button>

                    <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                    >
                    {saving ? "Updating..." : "Update Role"}
                    </button>
                </div>

                </form>

            </div>
            </div>
        </div>
        )}

    </div>
  );
}

export default RoleManagement;
