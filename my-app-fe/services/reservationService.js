export async function fetchAvailableRooms(from, to) {
  try {
    const response = await fetch(`http://localhost:3000/reservation/available-rooms?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
    
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

export async function fetchAddReservation(userId, roomId, from, to) {
  try {
    const response = await fetch("http://localhost:3000/reservation/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, roomId, from, to }),
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Nepodarilo sa vytvoriť rezerváciu.");
    }

    return await response.json();
  } catch (err) {
    console.error("Chyba pri vytváraní rezervácie:", err);
    throw new Error(err.message || "Nastala chyba pri odosielaní rezervácie.");
  }
}

export async function fetchUserReservations(userId) {
  try {
    const response = await fetch(`http://localhost:3000/reservation/user/${userId}`);
    
    if (!response.ok) {
      throw new Error("Chyba pri načítavaní rezervácií používateľa.");
    }

    return await response.json();
  } catch (err) {
    console.error("Chyba:", err);
    throw new Error(err.message || "Nepodarilo sa načítať rezervácie.");
  }
}

export async function fetchPastReservations(userId) {
  try {
    const response = await fetch(`http://localhost:3000/reservation/user/${userId}/past`);

    if (!response.ok) {
      throw new Error("Chyba pri načítavaní minulých rezervácií.");
    }

    return await response.json();
  } catch (err) {
    console.error("Chyba:", err);
    throw new Error(err.message || "Nepodarilo sa načítať minulé rezervácie.");
  }
}

export async function cancelReservation(reservationId) {
  try {
    const response = await fetch(`http://localhost:3000/reservation/cancel/${reservationId}`, {
      method: "PATCH",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Nepodarilo sa zrušiť rezerváciu.");
    }

    return await response.json();
  } catch (err) {
    console.error("Chyba pri rušení rezervácie:", err);
    throw new Error(err.message || "Nastala chyba pri zrušení rezervácie.");
  }
}