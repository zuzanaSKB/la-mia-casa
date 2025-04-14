export async function fetchAvailableRooms(from, to) {
  try {
    const response = await fetch(`http://localhost:3000/reservation/available-rooms?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch available rooms");
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching available rooms:", err);
    throw err;
  }
}

export async function fetchAddReservation( userId, roomId, from, to) {
  try {
    const response = await fetch("http://localhost:3000/reservation/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, roomId, from, to }),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to create reservation.");
    }
    return await response.json();
  } catch (err) {
    console.error(err);
    throw new Error("Chyba pri odosielaní rezervácie.");
  }
};

export async function fetchUserReservations(userId) {
  const response = await fetch(`http://localhost:3000/reservation/user/${userId}`);
  if (!response.ok) {
    throw new Error("Chyba pri načítavaní rezervácií.");
  }
  return response.json();
};

export async function fetchPastReservations(userId) {
  const response = await fetch(`http://localhost:3000/reservation/user/${userId}/past`);
  if (!response.ok) {
    throw new Error("Chyba pri načítavaní minulých rezervácií.");
  }
  return response.json();
}

export async function cancelReservation(reservationId) {
  const response = await fetch(`http://localhost:3000/reservation/cancel/${reservationId}`, {
    method: "PATCH",
  });

  if (!response.ok) {
    throw new Error("Nepodarilo sa zrušiť rezerváciu.");
  }

  return response.json();
};