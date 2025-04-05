import React from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // clear stored tokens or user info
    navigate("/");
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
      {/* Logout button in top-right corner */}
      <div style={{ position: "absolute", top: "10px", right: "10px" }}>
        <button className="btn btn-danger btn-sm" onClick={handleLogout}>
          Odhlásiť sa
        </button>
      </div>

      {/* Main content centered */}
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <div
          className="dashboard-box p-4"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            borderRadius: "15px",
            padding: "20px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
            backdropFilter: "blur(10px)",
            textAlign: "center",
          }}
        >
          <h1 className="text-white mb-4">Vitajte späť!</h1>
          <p className="text-white mb-4">
            Tu budete môcť spravovať svoj účet, spravovať rezervácie a pridávať recenzie.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
