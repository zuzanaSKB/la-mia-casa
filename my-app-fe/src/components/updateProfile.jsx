import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserById, updateUserName, updateUserPhone, updateUserPassword } from "../../services/userService";
import { logout } from "../../services/authService";
import { Pencil } from "react-bootstrap-icons";

function UpdateProfile({ userId, username, setUsername, error, setError, setAuthStatus, setUserRole }) {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone_number: "",
    birth_date: "",
  });
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState({
    name: false,
    phone_number: false,
  });
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      setAuthStatus(false);
      setUserRole(null);
      navigate('/');
    } catch (error) {
      setError("Chyba pri odhlasovaní.");
    }
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchUserById(userId);
        setProfile({
          name: data.name,
          email: data.email,
          phone_number: data.phone_number || "",
          birth_date: data.birth_date ? new Date(data.birth_date).toISOString().slice(0, 10) : "",
        });
      } catch (err) {
        console.error("Chyba pri načítavaní profilu:", err);
        setError("Nepodarilo sa načítať profil.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      loadProfile();
    }
  }, [userId, setError]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setError("");

      const currentData = await fetchUserById(userId);

      if (profile.name !== currentData.name) {
        await updateUserName(userId, profile.name);
        setUsername(profile.name);
      }

      if (profile.phone_number !== (currentData.phone_number || "")) {
        await updateUserPhone(userId, profile.phone_number);
      }

      navigate("/dashboardGuest");
      console.log("Updated name:", profile.name);
    } catch (err) {
      console.error("Chyba pri ukladaní profilu:", err);
      const message =
        err.response?.data?.message || "Nepodarilo sa uložiť zmeny.";
      setError(message);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Heslá sa nezhodujú.");
      return;
    }

    try {
      await updateUserPassword(userId, newPassword);
      setError("");
      setNewPassword("");
      setConfirmPassword("");
      alert("Heslo bolo úspešne zmenené. Budete odhlásený.");
      handleLogout();
    } catch (err) {
      console.error("Chyba pri zmene hesla:", err);
      const message =
        err.response?.data?.message || "Nepodarilo sa zmeniť heslo.";
      setError(message);
    }
  };

  const toggleEdit = (field) => {
    setEditMode({ ...editMode, [field]: !editMode[field] });
  };

  return (
    <div
      className="container-fluid"
      style={{
        minHeight: "100vh",
        backgroundImage: "url('/watercolour painting-1.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div style={{ position: "fixed", top: "10px", right: "10px", zIndex: 999 }}>
        <button className="btn btn-danger btn-sm" onClick={handleLogout}>
          Odhlásiť sa
        </button>
      </div>

      <div style={{ position: "fixed", top: "20px", left: "20px", zIndex: 999 }}>
        <button className="btn btn-outline-light btn-sm" onClick={() => navigate('/dashboardGuest')}>
          ← Späť
        </button>
      </div>

      <div
        className="d-flex flex-column justify-content-center align-items-center py-5"
        style={{ minHeight: "100vh" }}
      >
        <div
          className="p-4 text-white"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            borderRadius: "15px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
            backdropFilter: "blur(10px)",
            width: "90%",
            maxWidth: "600px",
          }}
        >
          {error && <div className="alert alert-danger mt-2">{error}</div>}
          <h2 className="mb-4 text-center">Môj profil</h2>

          {loading ? (
            <p>Načítavam profil...</p>
          ) : (
            <>
              <form onSubmit={handleUpdate}>
                <div className="mb-3">
                  <label className="form-label fw-bold">Meno:</label>
                  <div className="d-flex align-items-center">
                    {editMode.name ? (
                      <input
                        type="text"
                        className="form-control me-2"
                        name="name"
                        value={profile.name}
                        onChange={handleChange}
                        required
                      />
                    ) : (
                      <div className="me-2">{profile.name}</div>
                    )}
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-light"
                      onClick={() => toggleEdit("name")}
                    >
                      <Pencil size={16} />
                    </button>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Email:</label>
                  <div className="me-2">{profile.email}</div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Telefónne číslo:</label>
                  <div className="d-flex align-items-center">
                    {editMode.phone_number ? (
                      <input
                        type="text"
                        className="form-control me-2"
                        name="phone_number"
                        value={profile.phone_number}
                        onChange={handleChange}
                      />
                    ) : (
                      <div className="me-2">{profile.phone_number || "-"}</div>
                    )}
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-light"
                      onClick={() => toggleEdit("phone_number")}
                    >
                      <Pencil size={16} />
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-bold">Dátum narodenia:</label>
                  <div className="me-2">{profile.birth_date}</div>
                </div>

                <div className="d-flex justify-content-center">
                  <button type="submit" className="btn btn-success">
                    Uložiť zmeny
                  </button>
                </div>
              </form>

              <hr className="text-white my-4" />

              <h5 className="text-white text-center mt-5">Zmena hesla</h5>

              <div className="mb-3">
                <label>Nové heslo:</label>
                <input
                  type="password"
                  className="form-control"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label>Potvrdiť heslo:</label>
                <input
                  type="password"
                  className="form-control"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <div className="d-flex justify-content-center">
                <button onClick={handlePasswordChange} className="btn btn-primary">
                  Zmeniť heslo
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default UpdateProfile;