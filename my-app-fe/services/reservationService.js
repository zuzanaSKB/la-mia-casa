export async function fetchAddReservation(userId, roomId, from, to, finalRoomPrice) {
  try {
    const response = await fetch("/api/reservation/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, roomId, from, to, price: finalRoomPrice }),
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
    const response = await fetch(`/api/reservation/user/${userId}`);
    
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
    const response = await fetch(`/api/reservation/user/${userId}/past`);

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
    const response = await fetch(`/api/reservation/cancel/${reservationId}`, {
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

// admin

export async function fetchAllReservations() {
  try {
    const response = await fetch("/api/reservation/all", {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Nepodarilo sa načítať všetky rezervácie.");
    }

    return await response.json();
  } catch (err) {
    throw new Error(err.message || "Chyba pri načítaní rezervácií.");
  }
}

export async function updateReservationStatus(reservationId, newStatus) {
  try {
    const response = await fetch(`/api/reservation/status/${reservationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Nepodarilo sa aktualizovať stav rezervácie.");
    }

    return await response.json();
  } catch (err) {
    console.error("Chyba pri aktualizácii stavu rezervácie:", err);
    throw new Error(err.message || "Nastala chyba pri zmene stavu rezervácie.");
  }
}
