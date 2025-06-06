import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../services/authService";
import { fetchUserReservations, fetchPastReservations, cancelReservation } from "../../services/reservationService";
import { submitReview, fetchReviewsByUser, deleteReview } from "../../services/reviewService";

const StarRating = ({ rating, setRating }) => {
  return (
    <div className="mb-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{
            cursor: "pointer",
            color: star <= rating ? "#ffc107" : "#e4e5e9",
            fontSize: "1.5rem",
          }}
          onClick={() => setRating(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

function DashboardGuest(props) {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [pastReservations, setPastReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeReviewId, setActiveReviewId] = useState(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [userReviews, setUserReviews] = useState([]);
  
  const formatDate = (dateStr) => new Date(dateStr).toISOString().slice(0, 10);

  const getReviewByReservationId = (reservationId) => {
    return userReviews.find((review) => review.reservation_id === reservationId);
  };

  const handleLogout = async () => {
    try {
      await logout();
      props.setAuthStatus(false);
      props.setUserRole(null);
      navigate('/');
    } catch (error) {
      props.setError(error.message);
    }
  };

  const handleReviewSubmit = async (reservationId) => {
    if (reviewRating === 0) {
      props.setError("Zvoľte hodnotenie pred odoslaním.");
      return;
    }
    const reservation = pastReservations.find(res => res.id === reservationId);
    if (!reservation) return;
  
    const existingReview = getReviewByReservationId(reservationId);
  
    try {
      await submitReview(
        reservation.room_id,
        reviewText,
        reviewRating,
        reservationId,
        existingReview?.id
      );
  
      const updatedReviews = await fetchReviewsByUser();
      setUserReviews(updatedReviews);
      setActiveReviewId(null);
      setReviewRating(0);
      setReviewText("");
      props.setError("");
    } catch (error) {
      console.error("Chyba pri odosielaní recenzie:", error);
      props.setError("Nepodarilo sa odoslať recenziu.");
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
        const updatedReservations = await fetchUserReservations();
        setReservations(updatedReservations);
      } else {
        props.setError(response.message);
      }
    } catch (error) {
      console.error("Chyba pri zrušení rezervácie:", error);
      props.setError("Nepodarilo sa zrušiť rezerváciu.");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      const updatedReviews = await fetchReviewsByUser();
      setUserReviews(updatedReviews);
    } catch (error) {
      console.error("Chyba pri mazaní recenzie:", error);
      props.setError("Nepodarilo sa vymazať recenziu.");
    }
  };

  useEffect(() => {
     const loadReservations = async () => {
      try {
        const future = await fetchUserReservations();
        const past = await fetchPastReservations();
        const reviews = await fetchReviewsByUser();

        setReservations(future);
        setPastReservations(past);
        setUserReviews(reviews);
      } catch (error) {
        console.error("Chyba pri načítavaní rezervácií, recenzií alebo narodeninovej zľavy :", error);
        props.setError("Nepodarilo sa načítať údaje.");
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
      <div style={{ position: "fixed", top: "10px", right: "10px", zIndex: 999 }}>
        <button className="btn btn-danger btn-sm" onClick={handleLogout}>
          Odhlásiť sa
        </button>
      </div>

      <div
        className="d-flex flex-column justify-content-center align-items-center py-5"
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
          {props.error && (
            <div className="alert alert-danger mt-2">
              {props.error}
            </div>
          )}
          <h1 className="mb-4 text-center">
            Vitajte späť, {props.username ? props.username : "používateľ"}!
          </h1>

          <div className="text-center mb-4">
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => navigate("/updateProfile")}
            >
              Môj profil
            </button>
          </div>

          <div className="mb-5">
            <h4>Moje rezervácie</h4>
            {loading ? (
              <p>Načítavam rezervácie...</p>
            ) : reservations.length > 0 ? (
              <ul>
                {reservations.map((res) => (
                  <li key={res.id}>
                    {res.room_name} - {formatDate(res.start_date)} až {formatDate(res.end_date)} -{" "}
                    {res.status === "confirmed" ? "Potvrdené" : "Čaká na potvrdenie"} 
                    {" "}
                    <strong>– {Number(res.price).toFixed(2)} €</strong>
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
            <h4>Minulé rezervácie</h4>
            {loading ? (
              <p>Načítavam minulé rezervácie...</p>
            ) : pastReservations.length > 0 ? (
              <ul>
                {pastReservations.map((res) => {
                  const existingReview = getReviewByReservationId(res.id);

                  return (
                    <li key={res.id}>
                      {res.room_name} - {formatDate(res.start_date)} až {formatDate(res.end_date)}
                      <div className="mt-2">
                      {existingReview ? null : activeReviewId === res.id ? (
                        <div className="mb-3">
                          <StarRating rating={reviewRating} setRating={setReviewRating} />
                          <textarea
                            className="form-control mb-2"
                            placeholder="Napíšte vašu recenziu..."
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            rows={2}
                          />
                          <button
                            className="btn btn-sm btn-success me-2"
                            onClick={() => handleReviewSubmit(res.id)}
                          >
                            Odoslať recenziu
                          </button>
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => setActiveReviewId(null)}
                          >
                            Zrušiť
                          </button>
                        </div>
                      ) : (
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => setActiveReviewId(res.id)}
                        >
                          Pridať recenziu
                        </button>
                      )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p>Nemáte žiadne minulé rezervácie.</p>
            )}
          </div>

          <div className="mb-5">
            <h4>Moje recenzie</h4>
            {loading ? (
              <p>Načítavam recenzie...</p>
            ) : userReviews.length > 0 ? (
              <ul>
                {userReviews.map((review) => (
                  <li key={review.id}>
                    {review.room_name} – {formatDate(review.reservation_start)} až {formatDate(review.reservation_end)}
                    <div className="mt-2">
                      {activeReviewId === review.reservation_id ? (
                        <div className="mb-3">
                          <StarRating rating={reviewRating} setRating={setReviewRating} />
                          <textarea
                            className="form-control mb-2"
                            placeholder="Napíšte vašu recenziu..."
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            rows={2}
                          />
                          <button
                            className="btn btn-sm btn-success me-2"
                            onClick={() => handleReviewSubmit(review.reservation_id)}
                          >
                            Uložiť zmeny
                          </button>
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => setActiveReviewId(null)}
                          >
                            Zrušiť
                          </button>
                        </div>
                      ) : (
                        <>
                          <p>
                            Hodnotenie: {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)} {review.text ? `– "${review.text}"` : ""}
                          </p>
                          <button
                            className="btn btn-outline-primary btn-sm me-2"
                            onClick={() => {
                              setActiveReviewId(review.reservation_id);
                              setReviewRating(review.rating);
                              setReviewText(review.text);
                            }}
                          >
                            Upraviť recenziu
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDeleteReview(review.id)}
                          >
                            Odstrániť recenziu
                          </button>
                        </>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Nemáte žiadne recenzie.</p>
            )}
          </div>

          <div className="mb-5">
            <h4> Narodeninová zľava</h4>
            {props.hasBirthdayDiscount && new Date(props.hasBirthdayDiscount.validity) > new Date() ? (
              <p>
                Získavate <strong>{props.hasBirthdayDiscount.discount}% zľavu!</strong> Platná do{" "}
                <strong>{formatDate(props.hasBirthdayDiscount.validity)}</strong>.
              </p>
            ) : (
              <p>
                Aktuálne nemáte dostupnú narodeninovú zľavu alebo ste ju už využili.
              </p>
            )}
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