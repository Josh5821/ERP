import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaUserShield,
  FaBox,
  FaShoppingCart,
  FaChartBar,
  FaCog,
} from "react-icons/fa";

function Sidebar() {
  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: <FaTachometerAlt /> },
    { name: "Employees", path: "/employees", icon: <FaUsers /> },
    { name: "Roles", path: "/roles", icon: <FaUserShield /> },
    { name: "Products", path: "/products", icon: <FaBox /> },
    { name: "Supplier", path: "/supplier", icon: <FaShoppingCart /> },
    { name: "Customer", path: "/customer", icon: <FaChartBar /> },
    { name: "Purchase", path: "/purchase", icon: <FaCog /> },
    { name: "Sales", path: "/sales", icon: <FaChartBar /> },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">ERP System</div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;