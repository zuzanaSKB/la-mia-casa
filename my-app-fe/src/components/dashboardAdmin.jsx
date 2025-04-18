import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "bootstrap";
import { logout } from "../../services/authService";
import { fetchAllReservations, updateReservationStatus } from "../../services/reservationService";
import { fetchAllRooms, updateRoomPrice, updateRoomAvailability } from "../../services/roomService";
import { fetchAllReviews } from "../../services/reviewService";

function DashboardAdmin(props) {
  const navigate = useNavigate();
  const [allReservations, setAllReservations] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [roomLoadingId, setRoomLoadingId] = useState(null);
  const [reviews, setReviews] = useState([]);

  const formatDate = (dateStr) => new Date(dateStr).toISOString().slice(0, 10);

  const statusLabels = {
    pending: "Čaká na potvrdenie",
    confirmed: "Potvrdené",
    canceled: "Zrušené",
  };

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

  useEffect(() => {
    const loadData = async () => {
      try {
        const [reservations, roomList, reviewList] = await Promise.all([
          fetchAllReservations(),
          fetchAllRooms(),
          fetchAllReviews(),
        ]);
        setAllReservations(reservations);
        setRooms(roomList);
        setReviews(reviewList);
      } catch (err) {
        props.setError(err.message);
      }
    };
  
    loadData();
  }, []);

  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      new Tooltip(tooltipTriggerEl);
    });
  }, [rooms]); 

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

      <div className="d-flex flex-column justify-content-center align-items-center py-5" style={{ minHeight: "100vh" }}>
        <div
          className="dashboard-box p-4 text-white"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            borderRadius: "15px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
            backdropFilter: "blur(10px)",
            width: "95%",
            maxWidth: "1000px",
          }}
        >
          {props.error && (
            <div className="alert alert-danger mt-2">
              {props.error}
            </div>
          )}
          <h1 className="mb-4 text-center">Admin {props.username}</h1>

          <section className="mb-5">
            <h4>Všetky rezervácie</h4>
            {allReservations.length === 0 ? (
              <p>Žiadne rezervácie.</p>
            ) : (
              <div className="table-responsive" style={{ maxHeight: "400px", overflowY: "auto" }}>
                <table className="table table-sm table-hover mb-0 soft-table">
                  <thead>
                    <tr>
                      <th>Izba</th>
                      <th>Hosť</th>
                      <th>Od</th>
                      <th>Do</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allReservations.map((res) => {
                      return (
                        <tr key={res.id} className="align-middle">
                          <td className="py-2">{res.room_name}</td>
                          <td className="py-2">{res.user_name}</td>
                          <td className="py-2">{formatDate(res.start_date)}</td>
                          <td className="py-2">{formatDate(res.end_date)}</td>
                          <td className="py-2">
                            {res.status === "pending" ? (
                              <select
                                className={`form-select form-select-sm px-2 py-0 fw-semibold
                                  ${loadingId === res.id ? "opacity-50" : ""}
                                  ${
                                    res.status === "pending" ? "bg-warning text-dark border-warning" :
                                    res.status === "confirmed" ? "bg-success text-white border-success" :
                                    "bg-danger text-white border-danger"
                                  }`}
                                style={{
                                  minWidth: "5.5rem",
                                  fontSize: "0.75rem",
                                  height: "1.5rem",
                                  borderRadius: "0.375rem",
                                  paddingRight: "1.2rem",
                                }}
                                value={res.status}
                                disabled={loadingId === res.id}
                                onChange={async (e) => {
                                  const newStatus = e.target.value;
                                
                                  if (newStatus === "confirmed" || newStatus === "canceled") {
                                    const confirmMsg = `Ste si istý, že chcete zmeniť stav na "${statusLabels[newStatus]}"?`;
                                    const confirmed = window.confirm(confirmMsg);
                                
                                    if (!confirmed) return;
                                  }
                                
                                  try {
                                    setLoadingId(res.id);
                                    await updateReservationStatus(res.id, newStatus);
                                    setAllReservations((prev) =>
                                      prev.map((r) =>
                                        r.id === res.id ? { ...r, status: newStatus } : r
                                      )
                                    );
                                  } catch (err) {
                                    props.setError(err.message);
                                  } finally {
                                    setLoadingId(null);
                                  }
                                }}                                
                              >
                                <option value="pending">{statusLabels.pending}</option>
                                <option value="confirmed">{statusLabels.confirmed}</option>
                                <option value="canceled">{statusLabels.canceled}</option>
                              </select>
                            ) : (
                              <span className={`badge ${
                                res.status === "confirmed" ? "bg-success" :
                                res.status === "canceled" ? "bg-danger" :
                                "bg-secondary"
                              }`}>
                                {statusLabels[res.status]}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="mb-5">
            <h4>Správa izieb</h4>
            <div className="table-responsive" style={{ maxHeight: "300px", overflowY: "auto" }}>
              <table className="table table-sm table-hover soft-table">
                <thead>
                  <tr>
                    <th>Názov</th>
                    <th>Cena (€)</th>
                    <th>Dostupná</th>
                    <th>Uložiť</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map((room) => (
                    <tr key={room.id}>
                      <td>
                        <span
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          title={room.description}
                          style={{ cursor: "help", textDecoration: "underline dotted" }}
                        >
                          {room.name}
                        </span>
                      </td>
                      <td>
                        <input
                          type="number"
                          min="1"
                          step="1"
                          className="form-control form-control-sm"
                          value={room.price_per_night}
                          onChange={(e) =>
                            setRooms((prev) =>
                              prev.map((r) =>
                                r.id === room.id ? { ...r, price_per_night: e.target.value } : r
                              )
                            )
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          checked={room.is_available}
                          onChange={(e) =>
                            setRooms((prev) =>
                              prev.map((r) =>
                                r.id === room.id ? { ...r, is_available: e.target.checked } : r
                              )
                            )
                          }
                        />
                      </td>
                      <td>
                        <button
                          className="btn btn-success btn-sm"
                          disabled={roomLoadingId === room.id}
                          onClick={async () => {
                            try {
                              setRoomLoadingId(room.id);
                              await updateRoomPrice(room.id, room.price_per_night);
                              await updateRoomAvailability(room.id, room.is_available);
                              alert("Izba bola úspešne aktualizovaná.");
                            } catch (err) {
                              props.setError(err.message);
                            } finally {
                              setRoomLoadingId(null);
                            }
                          }}
                        >
                          Uložiť
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-5">
            <h4>Recenzie</h4>
            {reviews.length === 0 ? (
              <p>Žiadne recenzie.</p>
            ) : (
              <div className="table-responsive" style={{ maxHeight: "300px", overflowY: "auto" }}>
                <table className="table table-sm table-striped soft-table">
                  <thead>
                    <tr>
                      <th>Dátum</th>
                      <th>Používateľ</th>
                      <th>Izba</th>
                      <th>Hodnotenie</th>
                      <th>Text</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviews.map((review) => (
                      <tr key={review.id}>
                        <td>{new Date(review.date).toLocaleDateString()}</td>
                        <td>{review.user_name || review.user_id}</td>
                        <td>{review.room_name || "Neznáma izba"}</td>
                        <td>
                          {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                        </td>
                        <td>{review.text}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default DashboardAdmin;