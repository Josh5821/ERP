import { useEffect, useState } from "react";
import api from "../../axiosConfig";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const API = "/api/erp";

function SalesPayment() {
  const [sales, setSales] = useState([]);
  const [summary, setSummary] = useState(null);

  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);

  // Sale id from the URL (e.g. /sales/5/payment)
  const { id } = useParams();
  const [saleId, setSaleId] = useState(id || "");

  // The sale that is currently selected - gives us the customer name
  const selectedSale = sales.find((sale) => String(sale.id) === String(saleId));

  // ---------------- Load data ----------------

  // 1. Load the sales list once (this call was missing before)
  useEffect(() => {
    loadSales();
  }, []);

  // 2. When the URL id changes, select that sale automatically
  useEffect(() => {
    if (id) {
      setSaleId(String(id));
    }
  }, [id]);

  // 3. Whenever the selected sale changes, load its payment summary
  useEffect(() => {
    if (saleId) {
      loadPaymentSummary(saleId);
    } else {
      setSummary(null);
    }
  }, [saleId]);

  const loadSales = async () => {
    try {
      const response = await api.get(`${API}/sales`);
      setSales(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error loading sales:", error);
      alert("Failed to load sales");
    }
  };

  const loadPaymentSummary = async (selectedId) => {
    try {
      const response = await api.get(
        `${API}/sales/${selectedId}/payment-summary`
      );

      setSummary(response.data);
    } catch (error) {
      console.error("Error loading payment summary:", error);
      setSummary(null);
      alert("Failed to load payment summary");
    }
  };

  // ---------------- Add payment ----------------
  const handleAddPayment = async (e) => {
    e.preventDefault();

    if (!saleId) {
      alert("Please select a sale");
      return;
    }

    if (!amount || Number(amount) <= 0) {
      alert("Enter a valid payment amount");
      return;
    }

    if (Number(amount) > Number(summary?.balanceAmount ?? 0)) {
      alert("Payment cannot exceed the balance amount");
      return;
    }

    const paymentData = {
      amount: Number(amount),
      paymentMethod,
      referenceNumber,
      notes,
    };

    try {
      setLoading(true);

      await api.post(`${API}/sales/${saleId}/payments`, paymentData);

      alert("Payment added successfully!");

      setAmount("");
      setReferenceNumber("");
      setNotes("");

      // Refresh updated balance and status
      await loadPaymentSummary(saleId);
    } catch (error) {
      console.error("Error adding payment:", error);

      alert(
        error.response?.data?.message ||
          (typeof error.response?.data === "string"
            ? error.response.data
            : "Failed to add payment")
      );
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Helpers ----------------
  const formatAmount = (value) =>
    `₹${Number(value ?? 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const getStatusClass = (status) => {
    switch (status) {
      case "PAID":
        return "bg-success";
      case "PARTIALLY_PAID":
        return "bg-warning text-dark";
      default:
        return "bg-danger";
    }
  };

  const handleViewPayment = (sale) => {
    setSaleId(String(sale.id));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ---------------- UI ----------------
  return (
    <div className="container mt-4 mb-5">
      <h2 className="mb-4">Sales Payment Management</h2>

      {/* Sale details - filled automatically, not editable */}
      <div className="card shadow-sm mb-4">
        <div className="card-header fw-bold">Sale Details</div>

        <div className="card-body">
          {saleId ? (
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Sale ID</label>
                <input
                  type="text"
                  className="form-control bg-light"
                  value={saleId}
                  readOnly
                />
              </div>

              <div className="col-md-8">
                <label className="form-label">Customer Name</label>
                <input
                  type="text"
                  className="form-control bg-light"
                  value={
                    selectedSale
                      ? selectedSale.customer?.customerName || "-"
                      : ""
                  }
                  placeholder="Loading customer..."
                  readOnly
                />
              </div>
            </div>
          ) : (
            <p className="text-muted mb-0">
              No sale selected. Click "View Payment" on a sale in the list
              below.
            </p>
          )}
        </div>
      </div>

      {summary && (
        <>
          {/* Payment summary */}
          <div className="row g-3 mb-4">
            <div className="col-md-3">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <p className="text-muted mb-2">Sale Total</p>
                  <h5>{formatAmount(summary.saleTotal)}</h5>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <p className="text-muted mb-2">Total Paid</p>
                  <h5 className="text-success">
                    {formatAmount(summary.totalPaid)}
                  </h5>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <p className="text-muted mb-2">Balance Amount</p>
                  <h5 className="text-danger">
                    {formatAmount(summary.balanceAmount)}
                  </h5>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <p className="text-muted mb-2">Payment Status</p>
                  <span className={`badge ${getStatusClass(summary.status)}`}>
                    {summary.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Add payment form */}
          {Number(summary.balanceAmount) > 0 && (
            <div className="card shadow-sm mb-4">
              <div className="card-header fw-bold">
                Add Payment - Sale #{saleId}
                {selectedSale?.customer?.customerName &&
                  ` (${selectedSale.customer.customerName})`}
              </div>

              <div className="card-body">
                <form onSubmit={handleAddPayment}>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label">Payment Amount</label>

                      <input
                        type="number"
                        className="form-control"
                        min="0.01"
                        max={summary.balanceAmount}
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter payment amount"
                        required
                      />

                      <small className="text-muted">
                        Maximum: {formatAmount(summary.balanceAmount)}
                      </small>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">Payment Method</label>

                      <select
                        className="form-select"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        required
                      >
                        <option value="CASH">Cash</option>
                        <option value="UPI">UPI</option>
                        <option value="CARD">Card</option>
                        <option value="BANK_TRANSFER">Bank Transfer</option>
                        <option value="CHEQUE">Cheque</option>
                      </select>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">Reference Number</label>

                      <input
                        type="text"
                        className="form-control"
                        value={referenceNumber}
                        onChange={(e) => setReferenceNumber(e.target.value)}
                        placeholder="Transaction / cheque number"
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label">Notes</label>

                      <textarea
                        className="form-control"
                        rows="2"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Payment notes (optional)"
                      />
                    </div>

                    <div className="col-12">
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                      >
                        {loading ? "Saving..." : "Add Payment"}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}

          {summary.status === "PAID" && (
            <div className="alert alert-success">
              This sale is fully paid. No further payment is required.
            </div>
          )}
        </>
      )}

      {/* Sales table */}
      <div className="card shadow-sm mt-4">
        <div className="card-header fw-bold">Sales List</div>

        <div className="table-responsive">
          <table className="table table-bordered table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Sale ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Total Amount</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {sales.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">
                    No sales found
                  </td>
                </tr>
              ) : (
                sales.map((sale) => (
                  <tr
                    key={sale.id}
                    className={
                      String(sale.id) === String(saleId) ? "table-active" : ""
                    }
                  >
                    <td>{sale.id}</td>
                    <td>{sale.customer?.customerName || "-"}</td>
                    <td>{sale.salesDate || "-"}</td>
                    <td>{formatAmount(sale.totalAmount)}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-info btn-sm"
                        onClick={() => handleViewPayment(sale)}
                      >
                        View Payment
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
  );
}

export default SalesPayment;