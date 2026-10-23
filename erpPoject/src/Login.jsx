import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "./axiosConfig";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await axios.post("/auth/login", form);

      // Your backend currently returns the token as a string.
      const token =
        typeof response.data === "string"
          ? response.data
          : response.data.token;

      if (!token) {
        throw new Error("Token was not returned by the server.");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("username", form.username);

      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);

      setMessage(
        error.response?.data ||
          error.message ||
          "Login failed. Check your username and password."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mt-5" style={{ maxWidth: "450px" }}>
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">ERP Login</h3>
        </div>

        <div className="card-body">
          {message && (
            <div className="alert alert-danger">{String(message)}</div>
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
                autoComplete="username"
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
                autoComplete="current-password"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="mt-3 mb-0 text-center">
            New user? <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;