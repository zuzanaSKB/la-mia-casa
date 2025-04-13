import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAvailableRooms, fetchAddReservation } from "../../services/reservationService";

function BookRoomForm({ userId, error, setError }) {
  const navigate = useNavigate();
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [people, setPeople] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState("");
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noRooms, setNoRooms] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      if (!fromDate || !toDate) return;

      try {
        setLoading(true);
        const availableRooms = await fetchAvailableRooms(fromDate, toDate);
        setRooms(availableRooms);
        setError("");
        
        //check if no rooms available
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
      await fetchAddReservation(userId, selectedRoom, fromDate, toDate);
  
      alert("Rezervácia bola úspešne odoslaná!");
      navigate("/dashboardGuest");
    } catch (err) {
      setError(err.message || "Chyba pri odosielaní rezervácie.");
    }
  };  

  const filteredRooms = rooms.filter((room) => room.capacity >= people);

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{
        minHeight: "100vh",
        backgroundImage: "url('/watercolour painting-1.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
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
            required
          />

          <label className="text-white">Dátum odchodu</label>
          <input
            type="date"
            className="form-control"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
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
          {error && <p className="text-danger">{error}</p>}

          {people > 0 && !loading && noRooms && (
            <p className="text-white text-center">Žiadne dostupné izby pre vybraný dátum a počet osôb.</p>
          )}

          {people > 0 && !loading && !noRooms && (
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