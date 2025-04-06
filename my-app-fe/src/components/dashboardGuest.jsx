import React from "react";
import { useNavigate } from "react-router-dom";

function DashboardGuest() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  const goToBookingPage = () => {
    navigate("/rooms");
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
        position: "relative",
      }}
    >
      <div style={{ position: "absolute", top: "10px", right: "10px" }}>
        <button className="btn btn-danger btn-sm" onClick={handleLogout}>
          Odhlásiť sa
        </button>
      </div>

      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <div
          className="dashboard-box p-4 text-white"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            borderRadius: "15px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
            backdropFilter: "blur(10px)",
            width: "90%",
            maxWidth: "800px",
          }}
        >
          <h1 className="mb-4 text-center">Vitajte späť!</h1>

          <div className="mb-5">
            <h4> Moje rezervácie</h4>
            <ul>
              <li>Izba 1 - 15.04.2025 - 17.04.2025 - Potvrdené</li>
              <li>Izba 2 - 01.05.2025 - 05.05.2025 - Čaká na potvrdenie</li>
            </ul>
          </div>

          <div className="mb-5">
            <h4> Moje recenzie</h4>
            <ul>
              <li>Izba 101 - 5⭐ - "Úžasné ubytovanie!"</li>
              <li>Izba 305 - 4⭐ - "Veľmi príjemný pobyt."</li>
            </ul>
          </div>

          <div className="mb-5">
            <h4> Narodeninová zľava</h4>
            <p>Získavate 20% zľavu! Platná do 30.04.2025.</p>
          </div>

          <div className="text-center">
            <button className="btn btn-success" onClick={goToBookingPage}>
              Rezervovať izbu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardGuest;
