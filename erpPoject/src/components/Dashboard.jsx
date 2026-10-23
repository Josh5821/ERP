import { useEffect, useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import api from "../axiosConfig";

const API = "/api/erp";

function Dashboard() {
  const [summary, setSummary] = useState({
    totalCustomers: 0,
    totalProducts: 0,
    totalSales: 0,
    totalSalesAmount: 0,
    totalPaymentsReceived: 0,
    outstandingBalance: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await api.get(
          `${API}/dashboard/summary`
        );

        setSummary(response.data);
      } catch (err) {
        console.error("Dashboard error:", err);
        setError("Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const money = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(Number(value ?? 0));

  const cards = [
    {
      title: "Total Customers",
      value: summary.totalCustomers,
      icon: "bi-people",
      color: "primary",
      description: "Registered customers",
    },
    {
      title: "Total Products",
      value: summary.totalProducts,
      icon: "bi-box-seam",
      color: "success",
      description: "Products in inventory",
    },
    {
      title: "Total Sales",
      value: summary.totalSales,
      icon: "bi-cart-check",
      color: "info",
      description: "Number of sales",
    },
    {
      title: "Sales Amount",
      value: money(summary.totalSalesAmount),
      icon: "bi-graph-up-arrow",
      color: "primary",
      description: "Total sales value",
    },
    {
      title: "Payments Received",
      value: money(summary.totalPaymentsReceived),
      icon: "bi-wallet2",
      color: "success",
      description: "Total amount collected",
    },
    {
      title: "Outstanding Balance",
      value: money(summary.outstandingBalance),
      icon: "bi-cash-stack",
      color: "warning",
      description: "Remaining customer balance",
    },
  ];

  if (loading) {
    return (
      <div className="container-fluid p-4">
        <h4>Loading dashboard...</h4>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">ERP Dashboard</h2>
          <p className="text-muted mb-0">
            Overview of your business
          </p>
        </div>

        <button
          className="btn btn-outline-primary"
          onClick={() => window.location.reload()}
        >
          <i className="bi bi-arrow-clockwise me-2"></i>
          Refresh
        </button>
      </div>

      {error && (
        <div className="alert alert-danger">
          {error}
          <button
            className="btn btn-sm btn-outline-danger ms-3"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      )}

      <div className="row g-4">
        {cards.map((card) => (
          <div
            className="col-12 col-sm-6 col-xl-4"
            key={card.title}
          >
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="text-muted mb-2">
                      {card.title}
                    </p>

                    <h3 className="fw-bold mb-2">
                      {card.value}
                    </h3>

                    <small className="text-muted">
                      {card.description}
                    </small>
                  </div>

                  <div
                    className={`bg-${card.color}-subtle text-${card.color} rounded-3 p-3`}
                  >
                    <i className={`${card.icon} fs-3`}></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card border-0 shadow-sm mt-4">
        <div className="card-body p-4">
          <h5 className="fw-bold mb-3">
            Business Summary
          </h5>

          <div className="row g-3">
            <div className="col-md-6">
              <div className="p-3 bg-light rounded">
                <span className="text-muted">
                  Total sales value
                </span>
                <h5 className="mt-2 mb-0">
                  {money(summary.totalSalesAmount)}
                </h5>
              </div>
            </div>

            <div className="col-md-6">
              <div className="p-3 bg-light rounded">
                <span className="text-muted">
                  Balance to collect
                </span>
                <h5 className="mt-2 mb-0">
                  {money(summary.outstandingBalance)}
                </h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;