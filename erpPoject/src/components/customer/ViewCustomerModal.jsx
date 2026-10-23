
import { useEffect, useState } from "react";
import api from "../../axiosConfig";

const CUSTOMER_API = "/api/erp/customer";

function ViewCustomerModal({ customerId, onClose }) {
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (customerId == null) return;

        const fetchCustomer = async () => {
            setLoading(true);
            setError("");
            setCustomer(null);

            try {
                const response = await api.get(
                    `${CUSTOMER_API}/${customerId}`
                );
                setCustomer(response.data);
            } catch (err) {
                console.error(err);
                setError("Failed to load customer details.");
            } finally {
                setLoading(false);
            }
        };

        fetchCustomer();
    }, [customerId]);

    if (customerId == null) return null;

    return (
        <div
            className="modal show d-block"
            tabIndex="-1"
            role="dialog"
            aria-modal="true"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
            <div className="modal-dialog modal-lg modal-dialog-centered">
                <div className="modal-content">

                    <div className="modal-header">
                        <h5 className="modal-title">
                            Customer Details
                        </h5>

                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                            aria-label="Close"
                        />
                    </div>

                    <div className="modal-body">
                        {loading ? (
                            <p className="text-center">
                                Loading customer details...
                            </p>
                        ) : error ? (
                            <div className="alert alert-danger">
                                {error}
                            </div>
                        ) : customer ? (
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <strong>Customer ID</strong>
                                    <p>{customer.id}</p>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <strong>Customer Name</strong>
                                    <p>{customer.customerName}</p>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <strong>Email</strong>
                                    <p>{customer.email || "N/A"}</p>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <strong>Phone</strong>
                                    <p>{customer.phone || "N/A"}</p>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <strong>Address</strong>
                                    <p>{customer.address || "N/A"}</p>
                                </div>

                                <div className="col-md-6 mb-3">
                                    <strong>Assigned Employee</strong>
                                    <p>
                                        {customer.employee
                                            ? `${
                                                customer.employee.firstName ||
                                                customer.employee.username ||
                                                "Employee"
                                              } (ID: ${customer.employee.id})`
                                            : "Not assigned"}
                                    </p>
                                </div>
                            </div>
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
}

export default ViewCustomerModal;
