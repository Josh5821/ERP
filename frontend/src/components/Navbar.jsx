import { useState } from "react";
import { FaBars, FaBell, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Navbar({ onToggleSidebar }) {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove JWT token
    localStorage.removeItem("token");

    // Remove user details if stored
    localStorage.removeItem("user");
    localStorage.removeItem("username");

    // Close profile dropdown
    setShowMenu(false);

    // Redirect to login page
    navigate("/login", { replace: true });
  };

  return (
    <header className="navbar-top">
      <button
        className="navbar-icon-button"
        onClick={onToggleSidebar}
        aria-label="Toggle sidebar"
      >
        <FaBars />
      </button>

      <div className="navbar-right">
        <button
          className="navbar-icon-button"
          aria-label="Notifications"
        >
          <FaBell />
        </button>

        {/* <div className="profile-container">
          <button
            className="profile-button"
            onClick={() => setShowMenu(!showMenu)}
          >
            <FaUserCircle className="profile-icon" />
            <span></span>
            <span>▾</span>
          </button>

          {showMenu && (
            <div className="profile-dropdown">
              <button onClick={() => setShowMenu(false)}>
                My Profile
              </button>

              <button onClick={() => setShowMenu(false)}>
                Settings
              </button>

              <button onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div> */}
        <button onClick={handleLogout}>
                Logout
              </button>
      </div>
    </header>
  );
}

export default Navbar;