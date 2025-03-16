import React, { useState } from "react";
import Login from "./login";
import Registration from "./registration";

function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);

  const handleLoginClick = () => {
    setShowLogin(true);
    setShowRegistration(false);
  };

  const handleRegistrationClick = () => {
    setShowRegistration(true);
    setShowLogin(false);
  };

  return (
    <div
      className="home-container"
      style={{ position: "relative", height: "100vh" }}
    >
      {!showLogin && !showRegistration && (
        <>
          <h1
            className="brand-title"
            style={{
              position: "absolute",
              left: "10%",
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: "4rem",
              fontWeight: "bold",
              color: "#b3dbc0",
              textShadow: "2px 2px 10px rgba(0,0,0,0.5)",
              fontFamily: "'Satisfy', cursive",
            }}
          >
            La Casa Mia
          </h1>

          <div style={{ position: "absolute", top: "10px", right: "10px" }}>
            <button
              className="btn btn-primary btn-sm"
              onClick={handleLoginClick}
              style={{ marginRight: "10px" }}
            >
              Prihlásenie
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={handleRegistrationClick}
            >
              Registrácia
            </button>
          </div>
        </>
      )}

      <div className="form-container">
        {showLogin && <Login />}
        {showRegistration && <Registration />}
      </div>
    </div>
  );
}

export default Home;
