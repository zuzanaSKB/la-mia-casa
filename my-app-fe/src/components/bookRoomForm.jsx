import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAddReservation } from "../../services/reservationService";
import { fetchAvailableRooms } from "../../services/roomService";
import { logout } from "../../services/authService";
import { expireBirthdayDiscount } from "../../services/birthdayDiscountService";


function getNextDate(dateStr) {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + 1);
  return date.toISOString().split("T")[0];
}

function BookRoomForm({ error, setError, setAuthStatus, setUserRole, hasBirthdayDiscount, setHasBirthdayDiscount}) {
  const navigate = useNavigate();
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [people, setPeople] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noRooms, setNoRooms] = useState(false);
  const [applyDiscount, setApplyDiscount] = useState(false);
  const today = new Date().toISOString().split("T")[0];

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
    const fetchRooms = async () => {
      if (!fromDate || !toDate) return;

      try {
        setLoading(true);
        const availableRooms = await fetchAvailableRooms(fromDate, toDate);
        setRooms(availableRooms);
        setError("");

        const suitableRooms = availableRooms.filter((room) => room.capacity >= people);
        setNoRooms(suitableRooms.length === 0);
      } catch (err) {
        setError("Nepodarilo sa načítať dostupné izby.");
        setRooms([]);
        setNoRooms(true);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [fromDate, toDate, people]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fromDate || !toDate || !people || !selectedRoom) {
      setError("Vyplňte všetky povinné polia.");
      return;
    }

    try {
      await fetchAddReservation(selectedRoom, fromDate, toDate, finalPrice);

      if (applyDiscount && hasBirthdayDiscount) {
        try {
          await expireBirthdayDiscount();
          setHasBirthdayDiscount(null);
          //console.log("Birthday discount expired after booking.");
        } catch (expireError) {
          console.error("Failed to expire birthday discount:", expireError);
        }
      }

      alert("Rezervácia bola úspešne odoslaná!");
      navigate("/dashboardGuest");
    } catch (err) {
      setError(err.message || "Chyba pri odosielaní rezervácie.");
    }
  };

  const filteredRooms = rooms.filter((room) => room.capacity >= people);
  const selectedRoomDetails = rooms.find((room) => room.id === Number(selectedRoom));
  const numberOfNights = fromDate && toDate
    ? (new Date(toDate).getTime() - new Date(fromDate).getTime()) / (1000 * 3600 * 24)
    : 0;
  const basePrice = selectedRoomDetails ? selectedRoomDetails.price_per_night * numberOfNights : 0;
  const finalPrice = applyDiscount && hasBirthdayDiscount ? basePrice * 0.8 : basePrice;

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        position: "relative",
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
        className="booking-box p-4"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          borderRadius: "15px",
          padding: "20px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
          backdropFilter: "blur(10px)",
          width: "100%",
          maxWidth: "500px",
        }}
      >
        <h2 className="text-white text-center mb-4">Rezervačný formulár</h2>
        <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          <label className="text-white">Dátum príchodu</label>
          <input
            type="date"
            className="form-control"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            min={today}
            required
          />

          <label className="text-white">Dátum odchodu</label>
          <input
            type="date"
            className="form-control"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            min={fromDate ? getNextDate(fromDate) : ""}
            required
          />

          <select
            className="form-control"
            value={people}
            onChange={(e) => {
              setPeople(Number(e.target.value));
              setSelectedRoom("");
            }}
            required
          >
            <option value="">Počet osôb</option>
            <option value="1">1 osoba</option>
            <option value="2">2 osoby</option>
            <option value="3">3 osoby</option>
            <option value="4">4 osoby</option>
          </select>

          {loading && <p className="text-white">Načítavam dostupné izby...</p>}
          {error && (
            <div className="alert alert-danger mt-2">
              {error}
            </div>
          )}

          {people > 0 && !loading && noRooms && (
            <p className="text-white text-center">Žiadne dostupné izby pre vybraný dátum a počet osôb.</p>
          )}

          {people > 0 && !loading && !noRooms && (
            <>
              <select
                className="form-control"
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                required
              >
                <option value="">Vyberte izbu</option>
                {filteredRooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name} — {room.description} ({room.price_per_night}€ / noc)
                  </option>
                ))}
              </select>

              {hasBirthdayDiscount && (
                <div className="mt-3">
                  <label className="text-white">
                    <input
                      type="checkbox"
                      checked={applyDiscount}
                      onChange={() => setApplyDiscount(!applyDiscount)}
                    />
                    Aplikovať narodeninovú zľavu (20%)
                  </label>
                </div>
              )}

              {selectedRoomDetails && numberOfNights > 0 && (
                <div className="text-white mt-3">
                  <strong>
                    Cena za {numberOfNights}{" "}
                    {numberOfNights === 1
                      ? "noc"
                      : numberOfNights >= 2 && numberOfNights <= 4
                      ? "noci"
                      : "nocí"}
                    : {finalPrice.toFixed(2)} €
                    {applyDiscount && hasBirthdayDiscount ? " (s narodeninovou zľavou)" : ""}
                  </strong>
                </div>
              )}
            </>
          )}

          {!noRooms && (
            <button type="submit" className="btn btn-success w-100">
              Odoslať rezerváciu
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

export default BookRoomForm;