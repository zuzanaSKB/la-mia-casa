export async function fetchAvailableRooms(from, to) {
    try {
      const response = await fetch(`/api/room/available-rooms?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Nepodarilo sa načítať dostupné izby.");
      }
  
      const data = await response.json();
      return data;
    } catch (err) {
      console.error("Chyba pri načítavaní dostupných izieb:", err);
      throw new Error(err.message || "Nastala neočakávaná chyba pri načítavaní izieb.");
    }
}

//admin

export const fetchAllRooms = async () => {
    const res = await fetch("/api/room");
    if (!res.ok) throw new Error("Nepodarilo sa načítať izby.");
    return res.json();
};
  
export const updateRoomPrice = async (roomId, price) => {
    const res = await fetch(`/api/room/${roomId}/price`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price_per_night: parseFloat(price) }),
    });
    if (!res.ok) throw new Error("Nepodarilo sa aktualizovať cenu.");
    return res.json();
};
  
export const updateRoomAvailability = async (roomId, available) => {
    const res = await fetch(`/api/room/${roomId}/availability`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_available: available }),
    });
    if (!res.ok) throw new Error("Nepodarilo sa aktualizovať dostupnosť.");
    return res.json();
};
  
  