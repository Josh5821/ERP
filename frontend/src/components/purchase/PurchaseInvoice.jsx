
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../axiosConfig";
import "./PurchaseInvoice.css";

const API = "/api/erp";

const money = (value) =>
  Number(value || 0).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
  });

const dateFormat = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-IN");
};

function PurchaseInvoice() {
  const { purchaseId } = useParams();
  const navigate = useNavigate();

  const [purchase, setPurchase] = useState(null);
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadInvoice = async () => {
      try {
        setError("");

        const [purchaseResponse, paymentResponse] = await Promise.all([
          api.get(`${API}/purchase`),
          api.get(`${API}/purchase-payments/${purchaseId}`),
        ]);

        const selectedPurchase = purchaseResponse.data.find(
          (item) => String(item.id) === String(purchaseId)
        );

        if (!selectedPurchase) {
          setError("Purchase invoice not found.");
          return;
        }

        setPurchase(selectedPurchase);
        setPayments(paymentResponse.data);
      } catch (err) {
        console.error(err);
        setError("Unable to load invoice. Please check the backend API.");
      }
    };

    loadInvoice();
  }, [purchaseId]);

  if (error) {
    return (
      <div className="container mt-4">
        <p className="text-danger">{error}</p>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    );
  }

  if (!purchase) {
    return <div className="container mt-4">Loading invoice...</div>;
  }

  const items = purchase.items || [];

  const totalAmount = Number(purchase.totalAmount || 0);
  const totalPaid = payments.reduce(
    (sum, payment) => sum + Number(payment.amountPaid || 0),
    0
  );
  const balance = totalAmount - totalPaid;

  const paymentStatus =
    totalPaid <= 0
      ? "UNPAID"
      : totalPaid < totalAmount
        ? "PARTIAL"
        : totalPaid === totalAmount
          ? "PAID"
          : "ADVANCE";

  return (
    <div className="container mt-4 invoice-page">
      <div className="invoice-actions">
        <button
          className="btn btn-secondary me-2"
          onClick={() => navigate(-1)}
        >
          Back
        </button>

        <button
          className="btn btn-primary"
          onClick={() => window.print()}
        >
          Print / Save as PDF
        </button>
      </div>

      <div className="invoice-paper">
        <header className="invoice-header">
          <div>
            <h2>YOUR COMPANY NAME</h2>
            <p>Company address</p>
            <p>Phone: Your contact number</p>
            <p>Email: yourcompany@example.com</p>
          </div>

          <div className="invoice-title">
            <h1>PURCHASE INVOICE</h1>
            <p>
              <strong>Invoice No:</strong> PUR-{purchase.id}
            </p>
            <p>
              <strong>Date:</strong> {dateFormat(purchase.purchaseDate)}
            </p>
          </div>
        </header>

        <hr />

        <section className="invoice-section">
          <h3>Supplier Details</h3>
          <p>
            <strong>Name:</strong>{" "}
            {purchase.supplier?.supplierName || "-"}
          </p>
          <p>
            <strong>Address:</strong>{" "}
            {purchase.supplier?.address || "-"}
          </p>
          <p>
            <strong>Email:</strong> {purchase.supplier?.email || "-"}
          </p>
          <p>
            <strong>Phone:</strong> {purchase.supplier?.phone || "-"}
          </p>
        </section>

        <section className="invoice-section">
          <h3>Purchased Items</h3>

          <table className="table table-bordered invoice-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Tax %</th>
                <th>Tax Amount</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item, index) => (
                <tr key={item.id ?? index}>
                  <td>{index + 1}</td>
                  <td>
                    {item.product?.productName ||
                      item.product?.name ||
                      `Product ${item.product?.id ?? ""}`}
                  </td>
                  <td>{item.quantity}</td>
                  <td>{money(item.purchasePrice)}</td>
                  <td>{Number(item.taxPercent || 0)}%</td>
                  <td>{money(item.taxAmount)}</td>
                  <td>{money(item.totalPrice)}</td>
                </tr>
              ))}

              {items.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center">
                    No purchase items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        <section className="invoice-summary">
          <div>
            <span>Subtotal</span>
            <strong>{money(purchase.subtotal)}</strong>
          </div>

          <div>
            <span>Tax Amount</span>
            <strong>{money(purchase.taxAmount)}</strong>
          </div>

          <div>
            <span>Purchase Total</span>
            <strong>{money(totalAmount)}</strong>
          </div>

          <div>
            <span>Total Amount Paid</span>
            <strong>{money(totalPaid)}</strong>
          </div>

          <div className="balance-row">
            <span>Balance Amount</span>
            <strong>{money(balance)}</strong>
          </div>

          <div>
            <span>Payment Status</span>
            <strong>{paymentStatus}</strong>
          </div>
        </section>

        <section className="invoice-section">
          <h3>Payment History</h3>

          <table className="table table-bordered invoice-table">
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Payment Date</th>
                <th>Payment Method</th>
                <th>Amount Paid</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.id}</td>
                  <td>{dateFormat(payment.paymentDate)}</td>
                  <td>{payment.paymentMethod}</td>
                  <td>{money(payment.amountPaid)}</td>
                </tr>
              ))}

              {payments.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center">
                    No payments recorded yet.
                  </td>
                </tr>
              )}
            </tbody>

            <tfoot>
              <tr>
                <th colSpan="3">Total Paid</th>
                <th>{money(totalPaid)}</th>
              </tr>
            </tfoot>
          </table>
        </section>

        <footer className="invoice-footer">
          <p>Thank you.</p>
          <p>Authorized Signature: ____________________</p>
        </footer>
      </div>
    </div>
  );
}

export default PurchaseInvoice;
