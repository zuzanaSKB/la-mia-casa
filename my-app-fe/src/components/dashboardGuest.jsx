import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../services/authService";
import { fetchUserReservations, cancelReservation } from "../../services/reservationService";

function DashboardGuest(props) {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (dateStr) => new Date(dateStr).toISOString().slice(0, 10);

  const handleLogout = async () => {
    try {
      await logout();
      props.setAuthStatus(false);
      props.setUserRole(null);
      navigate('/');
    } catch (error) {
      console.log(error.message);
      props.setError(error.message);
    }
  };

  const goToBookingPage = () => {
    props.setError("");
    navigate("/bookRoomForm");
  };

  const handleCancel = async (reservationId) => {
    try {
      const response = await cancelReservation(reservationId);
      if (response.success) {
        //reload reservations after cancellation
        const updatedReservations = await fetchUserReservations(props.userId);
        setReservations(updatedReservations);
      } else {
        props.setError(response.message);
      }
    } catch (error) {
      console.error("Chyba pri zrušení rezervácie:", error);
      props.setError("Nepodarilo sa zrušiť rezerváciu.");
    }
  };

  useEffect(() => {
    const loadReservations = async () => {
      try {
        const data = await fetchUserReservations(props.userId);
        setReservations(data);
      } catch (error) {
        console.error("Chyba pri načítavaní rezervácií:", error);
        props.setError("Nepodarilo sa načítať rezervácie.");
      } finally {
        setLoading(false);
      }
    };

    if (props.userId) {
      loadReservations();
    }
  }, [props.userId]);

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
            <h4>Moje rezervácie</h4>
            {loading ? (
              <p>Načítavam rezervácie...</p>
            ) : reservations.length > 0 ? (
              <ul>
                {reservations.map((res) => (
                  <li key={res.id}>
                    {res.room_name} - {formatDate(res.start_date)} až {formatDate(res.end_date)} -{" "}
                    {res.status === "confirmed"
                      ? "Potvrdené"
                      : "Čaká na potvrdenie"} 
                    {" "}
                    <button
                      className="btn btn-outline-danger btn-sm ms-2"
                      onClick={() => handleCancel(res.id)}
                    >
                      Zrušiť
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Nemáte žiadne rezervácie.</p>
            )}
          </div>

          <div className="mb-5">
            <h4> Moje recenzie</h4>
            <ul>
              <li>Izba 1 - 5⭐ - "Úžasné ubytovanie!"</li>
              <li>Izba 3 - 4⭐ - "Veľmi príjemný pobyt."</li>
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