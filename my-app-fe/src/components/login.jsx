import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Email and password are required!");
      return;
    }

    //clear previous errors
    setError("");

    login(email, password)
      .then(() => {
        navigate('/dashboardGuest');
      })
      .catch((error) => {
        console.log("Error:", error);
        setError(error.message || "Prihlásenie zlyhalo.");
      });
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <div
        className="login-box p-4"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          borderRadius: "15px",
          padding: "20px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
          backdropFilter: "blur(10px)",
        }}
      >
        <h1 className="text-center mb-4 text-white">Prihlásenie</h1>
        <form className="d-flex flex-column gap-3" onSubmit={handleSubmit}>
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
            required
          />
          <input
            type="password"
            className="form-control"
            placeholder="Heslo"
            value={password}
            onChange={handlePasswordChange}
            required
          />
          {error && <div className="text-danger">{error}</div>}
          <button type="submit" className="btn btn-success w-100">
            Prihlásiť sa
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
