import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../services/userService";

function Registration() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    birth_date: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { name, email, phone_number, birth_date, password } = formData;
    
    if (!name || !email || !phone_number || !birth_date || !password) {
      setError("All fields are required!");
      return;
    }

    //clear previous errors
    setError("");

    try {
      const data = await register(name, email, phone_number, birth_date, password);

      //if successful, set success message and reset form
      setMessage({ type: "success", text: data.message || "Registrácia bola úspešná!" });
      setFormData({ name: "", email: "", phone_number: "", birth_date: "", password: "" });

      //redirect to login page after 2 seconds
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      console.log("Error:", error);
      setError(error.message || "Chyba pri registrácii.");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "90vh" }}>
      <div className="registration-box p-4" style={{
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        borderRadius: "15px",
        padding: "20px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
        backdropFilter: "blur(10px)",
      }}>
        <h1 className="text-center mb-4 text-white">Registrácia</h1>

        {error && <div className="text-danger">{error}</div>}
        {message.text && (
          <div className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"}`}>
            {message.text}
          </div>
        )}

        <form className="d-flex flex-column gap-3" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            className="form-control"
            placeholder="Meno Priezvisko"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phone_number"
            className="form-control"
            placeholder="Telefón"
            value={formData.phone_number}
            onChange={handleChange}
            required
          />
          <div className="d-flex flex-column">
          <label className="form-label mb-1 text-white" htmlFor="birth_date">Dátum narodenia</label>
          <input
            type="date"
            name="birth_date"
            id="birth_date"
            className="form-control"
            value={formData.birth_date}
            onChange={handleChange}
            required
          />
        </div>
          <input
            type="password"
            name="password"
            className="form-control"
            placeholder="Heslo"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="btn btn-success w-100">
            Registrovať sa
          </button>
        </form>
      </div>
    </div>
  );
}

export default Registration;
