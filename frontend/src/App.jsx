import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Employee from "./components/Employee";
import RoleManagement from "./components/Rolemanagement";
import SupplierManagement from "./components/SupplierManagement";
import ProductManagement from "./components/product/ProductManagement";
import CustomerManagement from "./components/customer/CustomerManagement";
import Purchase from "./components/purchase/Purchase";
import PurchasePayment from "./components/purchase/PurchasePayment";
import PurchaseInvoice from "./components/purchase/PurchaseInvoice";
import Sales from "./components/sales/Sales";
import SalesEdit from "./components/sales/SalesEdit";
import SalesPayment from "./components/sales/SalesPayment";
import SalesInvoice from "./components/sales/SalesInvoice";
import Dashboard from "./components/Dashboard";

import Login from "./Login";
import Register from "./Register";
import "./App.css";
import ProtectedRoute from "./ProductedRoute";

// ERP layout: sidebar and navbar appear only on ERP pages
function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className={`app-layout ${sidebarOpen ? "" : "sidebar-collapsed"}`}>
      <Sidebar />

      <div className="main-area">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="page-content">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/employees" element={<Employee />} />
            <Route path="/roles" element={<RoleManagement />} />
            <Route path="/products" element={<ProductManagement />} />
            <Route path="/supplier" element={<SupplierManagement />} />
            <Route path="/customer" element={<CustomerManagement />} />
            <Route path="/purchase" element={<Purchase />} />

            <Route
              path="/purchase-payments/:purchaseId"
              element={<PurchasePayment />}
            />
            <Route
              path="/purchase-invoice/:purchaseId"
              element={<PurchaseInvoice />}
            />

            <Route path="/sales" element={<Sales />} />
            <Route path="/sales/edit/:id" element={<SalesEdit />} />
            <Route path="/sales-payment/:id" element={<SalesPayment />} />
            <Route path="/sales-invoice/:id" element={<SalesInvoice />} />

            <Route path="*" element={<Navigate to="/dashboard" replace />}
            />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protect all ERP pages */}
        <Route element={<ProtectedRoute />}>
          <Route path="/*" element={<DashboardLayout />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}


export default App;