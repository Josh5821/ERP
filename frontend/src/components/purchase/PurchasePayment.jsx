
import { useEffect, useState, useCallback } from "react";
import api from "../../axiosConfig";
import { useParams, useNavigate } from "react-router-dom";
import "./PurchasePayment.css";

const API = "/api/erp";

function PurchasePayment() {
  const { purchaseId } = useParams();
  const navigate = useNavigate();

  const [purchase, setPurchase] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [payment, setPayment] = useState({
    paymentDate: new Date().toISOString().slice(0, 10),
    amountPaid: "",
    paymentMethod: "CASH",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [purchaseResponse, paymentResponse] = await Promise.all([
        api.get(`${API}/purchase`),
        api.get(`${API}/purchase-payments/${purchaseId}`),
      ]);

      const foundPurchase = purchaseResponse.data.find(
        (item) => String(item.id) === String(purchaseId)
      );

      if (!foundPurchase) {
        setPurchase(null);
        setPaymentHistory([]);
        setError(`Purchase ID ${purchaseId} was not found.`);
        return;
      }

      setPurchase(foundPurchase);

      const records = paymentResponse.data;
      setPaymentHistory(Array.isArray(records) ? records : []);
    } catch (err) {
      console.error("Failed to load purchase/payment details:", err);
      setError(
        "Could not load payment history. Check that the payment history GET endpoint exists."
      );
    } finally {
      setLoading(false);
    }
  }, [purchaseId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setPayment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const totalAmount = Number(purchase?.totalAmount || 0);

  const totalPaid = paymentHistory.reduce(
    (sum, record) => sum + Number(record.amountPaid || 0),
    0
  );

  const balanceAmount = totalAmount - totalPaid;

  const paymentStatus =
    totalPaid <= 0
      ? "UNPAID"
      : totalPaid < totalAmount
      ? "PARTIAL"
      : totalPaid === totalAmount
      ? "PAID"
      : "ADVANCE";

  const submitPayment = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const amount = Number(payment.amountPaid);

    if (!Number.isFinite(amount) || amount <= 0) {
      setError("Enter a valid payment amount greater than zero.");
      return;
    }

    if (!payment.paymentDate || !payment.paymentMethod) {
      setError("Please complete all payment fields.");
      return;
    }

    setSubmitting(true);

    try {
      await api.post(
        `${API}/purchase-payments/${purchaseId}`,
        {
          paymentDate: payment.paymentDate,
          amountPaid: amount,
          paymentMethod: payment.paymentMethod,
        }
      );

      setMessage("Payment recorded successfully!");

      setPayment({
        paymentDate: new Date().toISOString().slice(0, 10),
        amountPaid: "",
        paymentMethod: "CASH",
      });

      await loadData();
    } catch (err) {
      console.error("Payment failed:", err);
      setError(
        err.response?.data?.message ||
        (typeof err.response?.data === "string"
          ? err.response.data
          : "Failed to record payment.")
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="container mt-4">Loading purchase details...</div>;
  }

  if (!purchase) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          {error || "Purchase not found."}
        </div>
        <button
          className="btn btn-secondary"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>
    );
  }

  const statusClass =
    paymentStatus === "PAID"
      ? "text-bg-success"
      : paymentStatus === "PARTIAL"
      ? "text-bg-warning"
      : paymentStatus === "ADVANCE"
      ? "text-bg-info"
      : "text-bg-danger";

  return (
    <div className="container purchase-payment-container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Purchase Payment</h2>
        <button
          className="btn btn-secondary"
          onClick={() => navigate(-1)}
        >
          Back to Purchases
        </button>
      </div>

      {message && (
        <div className="alert alert-success">{message}</div>
      )}

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      {/* Purchase details */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-dark text-white">
          Purchase Details
        </div>

        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <strong>Purchase ID</strong>
              <p>{purchase.id}</p>
            </div>

            <div className="col-md-3">
              <strong>Supplier</strong>
              <p>{purchase.supplier?.supplierName || "N/A"}</p>
            </div>

            <div className="col-md-3">
              <strong>Purchase Date</strong>
              <p>{purchase.purchaseDate || "N/A"}</p>
            </div>

            <div className="col-md-3">
              <strong>Total Amount</strong>
              <p>₹{totalAmount.toFixed(2)}</p>
            </div>

            <div className="col-md-4">
              <strong>Total Paid</strong>
              <p className="text-success fw-bold">
                ₹{totalPaid.toFixed(2)}
              </p>
            </div>

            <div className="col-md-4">
              <strong>Balance Amount</strong>
              <p className={`fw-bold ${balanceAmount > 0 ? "text-danger" : "text-success"}`}>
                ₹{balanceAmount.toFixed(2)}
              </p>
            </div>

            <div className="col-md-4">
              <strong>Payment Status</strong>
              <p>
                <span className={`badge ${statusClass}`}>
                  {paymentStatus}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Record a new payment */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-success text-white">
          Record Payment for Purchase #{purchase.id}
        </div>

        <div className="card-body">
          <form onSubmit={submitPayment}>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Payment Date</label>
                <input
                  type="date"
                  name="paymentDate"
                  className="form-control"
                  value={payment.paymentDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Amount Paid (₹)</label>
                <input
                  type="number"
                  name="amountPaid"
                  className="form-control"
                  min="0.01"
                  step="0.01"
                  placeholder="Enter amount"
                  value={payment.amountPaid}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label">Payment Method</label>
                <select
                  name="paymentMethod"
                  className="form-select"
                  value={payment.paymentMethod}
                  onChange={handleChange}
                  required
                >
                  <option value="CASH">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                  <option value="CARD">Card</option>
                  <option value="CHEQUE">Cheque</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-success mt-4"
              disabled={submitting}
            >
              {submitting ? "Recording..." : "Record Payment"}
            </button>
          </form>
        </div>
      </div>

      {/* Payment history */}
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          Payment History — Purchase #{purchase.id}
        </div>

        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered table-striped table-hover align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Payment ID</th>
                  <th>Payment Date</th>
                  <th>Amount Paid</th>
                  <th>Payment Method</th>
                </tr>
              </thead>

              <tbody>
                {paymentHistory.length > 0 ? (
                  paymentHistory.map((record) => (
                    <tr key={record.id}>
                      <td>{record.id}</td>
                      <td>{record.paymentDate}</td>
                      <td className="text-success fw-bold">
                        ₹{Number(record.amountPaid || 0).toFixed(2)}
                      </td>
                      <td>{record.paymentMethod}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No payments recorded for this purchase.
                    </td>
                  </tr>
                )}
              </tbody>

              <tfoot>
                <tr>
                  <th colSpan="2" className="text-end">
                    Total Paid
                  </th>
                  <th colSpan="2">
                    ₹{totalPaid.toFixed(2)}
                  </th>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PurchasePayment;
