import React, { useState, useEffect } from "react";
import Login from "./login";
import Registration from "./registration";
import { fetchAllPublishedReviews } from "../../services/reviewService";
import { motion, AnimatePresence } from "framer-motion";

function Home({ error, setError, setAuthStatus, setUserRole, setUserId, setUsername }) {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const published = await fetchAllPublishedReviews();
        setReviews(published);
      } catch (err) {
        console.error("Error loading reviews:", err.message);
      }
    };
    loadReviews();
  }, []);

  const handleLoginClick = () => {
    setShowLogin(true);
    setShowRegistration(false);
  };

  const handleRegistrationClick = () => {
    setShowRegistration(true);
    setShowLogin(false);
  };

  return (
    <div className="home-container" style={{ position: "relative", height: "100vh" }}>
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
            <button className="btn btn-primary btn-sm" onClick={handleLoginClick} style={{ marginRight: "10px" }}>
              Prihlásenie
            </button>
            <button className="btn btn-secondary btn-sm" onClick={handleRegistrationClick}>
              Registrácia
            </button>
          </div>
        </>
      )}

      <div className="form-container">
        {showLogin && (
          <Login
            error={error}
            setError={setError}
            setAuthStatus={setAuthStatus}
            setUserRole={setUserRole}
            setUserId={setUserId}
            setUsername={setUsername}
          />
        )}
        {showRegistration && <Registration />}
      </div>

      <AnimatePresence>
        {!showLogin && !showRegistration && reviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.5 }}
            style={{
              position: "absolute",
              right: "5%",
              top: "15%",
              width: "35%",
              maxHeight: "70%",
              overflowY: "auto",
              backgroundColor: "rgba(255,255,255,0.85)",
              borderRadius: "10px",
              padding: "1rem",
              boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            }}
          >
            <h5 className="text-center mb-3">Recenzie našich hostí</h5>

            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                style={{ marginBottom: "1rem" }}
              >
                <strong>{review.user_name || "Hosť"}</strong> –{" "}
                <small>{new Date(review.date).toLocaleDateString()}</small>
                <div>
                  {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                </div>
                {review.room_name && (
                  <div style={{ fontStyle: "italic", fontSize: "0.85rem", color: "#555" }}>
                    Izba: {review.room_name}
                  </div>
                )}
                <p style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>{review.text}</p>
                <hr />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Home;