
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../axiosConfig";

const API = "/api/erp";

function SalesInvoice() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [sale, setSale] = useState(null);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
  const loadInvoice = async () => {
    if (!id) {
      setError("Sales ID is missing from the URL.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      console.log("Sales ID:", id);

      const response = await api.get(
        `${API}/sales/${id}`
      );

      console.log("API response:", response.data);

      setSale(response.data);
    } catch (err) {
      console.error("Invoice error:", err);
      console.error("Response data:", err.response?.data);

      setSale(null);
      setError(
        err.response?.data?.message ||
        `Failed to load invoice. HTTP status: ${
          err.response?.status || "Network error"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  loadInvoice();
}, [id]);

  const money = (value) =>
    `₹${Number(value ?? 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  if (loading) {
    return <div className="container mt-4">Loading invoice...</div>;
  }

  if (error || !sale) {
  return (
    <div className="container mt-4">
      <h4>Unable to display invoice</h4>
      <p>{error || "No sale data received from the API."}</p>

      <button
        className="btn btn-secondary"
        onClick={() => navigate(-1)}
      >
        Go Back
      </button>
    </div>
  );
}

  const customer = sale.customer || {};
  const items = sale.items || [];

  return (
    <div className="container mt-4 mb-5">
      {/* These buttons are hidden when printing */}
      <div className="invoice-actions d-flex gap-2 mb-3">
        <button
          className="btn btn-secondary"
          onClick={() => navigate(-1)}
        >
          Back
        </button>

        <button
          className="btn btn-primary"
          onClick={() => window.print()}
        >
          Print / Save PDF
        </button>
      </div>

      {/* Only this invoice section will print */}
      <div id="sales-invoice" className="invoice-paper border p-4">
        <div className="d-flex justify-content-between align-items-start mb-4">
          <div>
            <h2 className="fw-bold mb-1">SALES INVOICE</h2>
            <p className="text-muted mb-0">Invoice #{sale.id}</p>
          </div>

          <div className="text-end">
            <h5 className="fw-bold">INVOICE</h5>
            <p className="mb-0">
              Date: {sale.salesDate || "-"}
            </p>
          </div>
        </div>

        <hr />

        <div className="mb-4">
          <h6 className="fw-bold">Bill To</h6>
          <p className="mb-1">
            <strong>{customer.customerName || "-"}</strong>
          </p>
          <p className="mb-1">{customer.address || "-"}</p>
          <p className="mb-1">{customer.phone || "-"}</p>
          <p className="mb-0">{customer.email || "-"}</p>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Product</th>
                <th className="text-end">Unit Price</th>
                <th className="text-end">Quantity</th>
                <th className="text-end">Tax %</th>
                <th className="text-end">Tax Amount</th>
                <th className="text-end">Total</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item, index) => {
                const product = item.products || {};
                const itemSubtotal =
                  Number(item.unitPrice || 0) *
                  Number(item.quantity || 0);

                return (
                  <tr key={item.id ?? index}>
                    <td>{index + 1}</td>
                    <td>
                      {product.productName ||
                        product.name ||
                        `Product #${product.id ?? "-"}`}
                    </td>
                    <td className="text-end">
                      {money(item.unitPrice)}
                    </td>
                    <td className="text-end">
                      {item.quantity}
                    </td>
                    <td className="text-end">
                      {Number(item.taxPercent || 0)}%
                    </td>
                    <td className="text-end">
                      {money(item.taxAmount)}
                    </td>
                    <td className="text-end">
                      {money(
                        item.totalPrice ??
                        (itemSubtotal + Number(item.taxAmount || 0))
                      )}
                    </td>
                  </tr>
                );
              })}

              {items.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center">
                    No items found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="row justify-content-end mt-4">
          <div className="col-md-5 col-12">
            <div className="d-flex justify-content-between mb-2">
              <span>Subtotal</span>
              <strong>{money(sale.subtotal)}</strong>
            </div>

            <div className="d-flex justify-content-between mb-2">
              <span>Total Tax</span>
              <strong>{money(sale.taxAmount)}</strong>
            </div>

            <hr />

            <div className="d-flex justify-content-between fs-5">
              <strong>Grand Total</strong>
              <strong>{money(sale.totalAmount)}</strong>
            </div>
          </div>
        </div>

        <hr className="mt-4" />

        <div className="text-center mt-4">
          <p className="mb-1">Thank you for your business!</p>
          <small className="text-muted">
            Invoice #{sale.id}
          </small>
        </div>
      </div>

      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 12mm;
          }

          body * {
            visibility: hidden !important;
          }

          #sales-invoice,
          #sales-invoice * {
            visibility: visible !important;
          }

          #sales-invoice {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
          }

          .invoice-actions {
            display: none !important;
          }

          .table-responsive {
            overflow: visible !important;
          }

          .invoice-paper {
            color: #000 !important;
            background: #fff !important;
          }

          .table {
            width: 100% !important;
            border-collapse: collapse !important;
          }

          .table th,
          .table td {
            border: 1px solid #777 !important;
            padding: 6px !important;
          }

          .table-light th {
            background: #eee !important;
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
}

export default SalesInvoice;
