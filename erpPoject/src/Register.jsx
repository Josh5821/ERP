import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "./axiosConfig";

function Register() {
  const navigate = useNavigate();

  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState({
    username: "",
    password: "",
    roleId: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get("/api/erp/role")
      .then((response) => {
        setRoles(
          Array.isArray(response.data)
            ? response.data
            : response.data.content || []
        );
      })
      .catch((error) => {
        console.error("Failed to load roles:", error);
        setMessage("Could not load roles. Check your role API.");
      });
  }, []);

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");

    try {
      const response = await axios.post("/auth/register", {
        username: form.username,
        password: form.password,
        roles: [Number(form.roleId)],
      });

      setMessage(response.data || "Registration successful");
      setForm({ username: "", password: "", roleId: "" });

      setTimeout(() => navigate("/login"), 1000);
    } catch (error) {
      setMessage(
        error.response?.data || "Registration failed. Please try again."
      );
    }
  }

  return (
    <div className="container mt-5" style={{ maxWidth: "450px" }}>
      <div className="card shadow">
        <div className="card-header bg-success text-white">
          <h3 className="mb-0">Register</h3>
        </div>

        <div className="card-body">
          {message && (
            <div className="alert alert-info">{message}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                type="text"
                name="username"
                className="form-control"
                value={form.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Role</label>
              <select
                name="roleId"
                className="form-select"
                value={form.roleId}
                onChange={handleChange}
                required
              >
                <option value="">Select a role</option>

                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.role}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn btn-success w-100">
              Register
            </button>
          </form>

          <p className="mt-3 mb-0 text-center">
            Already registered? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;