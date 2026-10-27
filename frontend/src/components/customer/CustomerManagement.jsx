
import { useEffect, useState } from "react";
import api from "../../axiosConfig";
import EditCustomerModal from "./EditCustomerModal";
import ViewCustomerModal from "./ViewCustomerModal";

const CUSTOMER_API = "/api/erp/customer";
const EMPLOYEE_API = "/api/erp/employee";

function CustomerManagement() {
    const [customers, setCustomers] = useState([]);
    const [employees, setEmployees] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [search, setSearch] = useState("");

    const [editingCustomer, setEditingCustomer] = useState(null);

    const [viewingCustomerId, setViewingCustomerId] = useState(null);

    const emptyForm = {
        customerName: "",
        email: "",
        phone: "",
        address: "",
        employeeId: ""
    };

    const [formData, setFormData] = useState(emptyForm);

    // GET all customers
    const fetchCustomers = async () => {
        setLoading(true);

        try {
            const response = await api.get(CUSTOMER_API);

            if (Array.isArray(response.data)) {
                setCustomers(response.data);
            } else {
                setCustomers([]);
                setError("Customer API did not return a list.");
            }
        } catch (err) {
            console.error(err);
            setError("Failed to load customers. Check your backend GET API.");
        } finally {
            setLoading(false);
        }
    };

    // GET all employees for dropdown
    const fetchEmployees = async () => {
        try {
            const response = await api.get(EMPLOYEE_API);

            if (Array.isArray(response.data)) {
                setEmployees(response.data);
            } else {
                setEmployees([]);
                setError("Employee API did not return a list.");
            }
        } catch (err) {
            console.error(err);
            setError("Failed to load employees.");
        }
    };

    useEffect(() => {
        fetchCustomers();
        fetchEmployees();
    }, []);

    //Search input

    const filteredCustomers = customers.filter((customer) =>
    [
        customer.customerName,
        customer.email,
        customer.phone,
        customer.address,
        customer.id?.toString()
    ]
        .filter(Boolean)
        .some((value) =>
            value.toLowerCase().includes(search.toLowerCase())
        )
    );

    // Handle form inputs
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    // Open modal
    const openModal = () => {
        setFormData({ ...emptyForm });
        setError("");
        setSuccess("");
        setShowModal(true);
    };

    // Close modal
    const closeModal = () => {
        if (saving) return;

        setShowModal(false);
        setFormData({ ...emptyForm });
        setError("");
    };

    // POST customer
    const handleSubmit = async (e) => {
        e.preventDefault();

        setSaving(true);
        setError("");
        setSuccess("");

        const customerData = {
            customerName: formData.customerName.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            address: formData.address.trim(),
            employee: formData.employeeId
                ? { id: Number(formData.employeeId) }
                : null
        };

        try {
            await api.post(CUSTOMER_API, customerData);

            setShowModal(false);
            setFormData({ ...emptyForm });
            setSuccess("Customer added successfully!");

            await fetchCustomers();
        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to add customer. Please check your backend."
            );
        } finally {
            setSaving(false);
        }
    };

    // Delete
    const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
        "Are you sure you want to delete this customer?"
    );

    if (!confirmDelete) return;

    setError("");
    setSuccess("");

    try {
        await api.delete(`${CUSTOMER_API}/${id}`);

        setSuccess("Customer deleted successfully!");

        await fetchCustomers();
    } catch (err) {
        console.error(err);

        setError(
            err.response?.data?.message ||
            "Failed to delete customer."
        );
    }
};

    return (
        <div className="container mt-4 mb-5">

            {/* Page Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Customer Management</h2>

                <button
                    type="button"
                    className="btn btn-primary"
                    onClick={openModal}
                >
                    + Add Customer
                </button>
            </div>

            {/* Success Message */}
            {success && (
                <div className="alert alert-success alert-dismissible fade show">
                    {success}

                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setSuccess("")}
                    />
                </div>
            )}

            {/* Error Message */}
            {error && !showModal && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {/* Add Customer Modal */}
            {showModal && (
                <div
                    className="modal show d-block"
                    tabIndex="-1"
                    role="dialog"
                    aria-modal="true"
                    style={{
                        backgroundColor: "rgba(0, 0, 0, 0.5)"
                    }}
                >
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content">

                            {/* Modal Header */}
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    Add New Customer
                                </h5>

                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={closeModal}
                                    disabled={saving}
                                    aria-label="Close"
                                />
                            </div>

                            {/* Customer Form */}
                            <form onSubmit={handleSubmit}>

                                <div className="modal-body">

                                    {error && (
                                        <div className="alert alert-danger">
                                            {error}
                                        </div>
                                    )}

                                    <div className="row">

                                        {/* Customer Name */}
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">
                                                Customer Name
                                            </label>

                                            <input
                                                type="text"
                                                name="customerName"
                                                className="form-control"
                                                placeholder="Enter customer name"
                                                value={formData.customerName}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        {/* Email */}
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">
                                                Email
                                            </label>

                                            <input
                                                type="email"
                                                name="email"
                                                className="form-control"
                                                placeholder="Enter email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        {/* Phone */}
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">
                                                Phone
                                            </label>

                                            <input
                                                type="tel"
                                                name="phone"
                                                className="form-control"
                                                placeholder="Enter phone number"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        {/* Address */}
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">
                                                Address
                                            </label>

                                            <input
                                                type="text"
                                                name="address"
                                                className="form-control"
                                                placeholder="Enter address"
                                                value={formData.address}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        {/* Employee Dropdown */}
                                        <div className="col-12 mb-3">
                                            <label className="form-label">
                                                Assign Employee
                                            </label>

                                            <select
                                                name="employeeId"
                                                className="form-select"
                                                value={formData.employeeId}
                                                onChange={handleChange}
                                            >
                                                <option value="">
                                                    No employee assigned
                                                </option>

                                                {employees.map((employee) => (
                                                    <option
                                                        key={employee.id}
                                                        value={employee.id}
                                                    >
                                                        {employee.firstName
                                                            ? `${employee.firstName} ${employee.lastName || ""}`
                                                            : employee.username || `Employee ${employee.id}`}
                                                        {" (ID: " + employee.id + ")"}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                    </div>
                                </div>

                                {/* Modal Footer */}
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={closeModal}
                                        disabled={saving}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={saving}
                                    >
                                        {saving
                                            ? "Saving..."
                                            : "Save Customer"}
                                    </button>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Customer DataTable */}
            <div className="card-header d-flex justify-content-between align-items-center">
    <h5 className="mb-0">Customer List</h5>

    <button
        type="button"
        className="btn btn-outline-primary btn-sm"
        onClick={fetchCustomers}
        disabled={loading}
    >
        {loading ? "Loading..." : "Refresh"}
    </button>
</div>

<div className="card-body">
    <div className="row mb-3">
        <div className="col-md-5">
            <input
                type="text"
                className="form-control"
                placeholder="Search name, email, phone, address..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
        </div>
    </div>
                <div className="card-body">

                    {loading && filteredCustomers.length === 0 ? (
                        <p className="text-center">Loading customers...</p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-bordered table-hover align-middle">

                                <thead className="table-dark">
                                    <tr>
                                        <th>S.No</th>                                        
                                        <th>Customer Name</th>                                        
                                        <th>Phone</th>
                                        <th>Address</th>
                                        <th>Assigned Employee</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredCustomers.length > 0 ? (
                                        filteredCustomers.map((customer, index) => (
                                            <tr key={customer.id}>
                                                <td>{index + 1}</td>                                                
                                                <td>{customer.customerName}</td>                                                
                                                <td>{customer.phone}</td>
                                                <td>{customer.address}</td>

                                                <td>
                                                    {customer.employee
                                                        ? `${customer.employee.firstName || customer.employee.username || "Employee"}
                                                         (ID: ${customer.employee.id})`
                                                        : "Not assigned"}
                                                </td>
                                                
                                                    <td>
                                                        <button
                                                            type="button"
                                                            className="btn btn-info btn-sm me-2"
                                                            onClick={() => setViewingCustomerId(customer.id)}
                                                        >
                                                            View
                                                        </button>
                                                        <button
                                                            className="btn btn-warning btn-sm me-2"
                                                            onClick={() => setEditingCustomer(customer)}
                                                            >
                                                            Edit
                                                            </button>

                                                            <button
                                                                type="button"
                                                                className="btn btn-danger btn-sm me-2"
                                                                onClick={() => handleDelete(customer.id)}
                                                            >
                                                                Delete
                                                            </button>
                                                    </td>
                                                
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="7"
                                                className="text-center py-4"
                                            >
                                                No customers found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>

                            </table>
                        </div>
                    )}

                    <EditCustomerModal
                        customer={editingCustomer}
                        onClose={() => setEditingCustomer(null)}
                        onUpdated={fetchCustomers}
                        />

                        <ViewCustomerModal
                            customerId={viewingCustomerId}
                            onClose={() => setViewingCustomerId(null)}
                        />

                </div>
            </div>


        </div>
    );
}

export default CustomerManagement;
