const BASE_URL = "http://localhost:3000/review";

export async function submitReview(userId, roomId, text, rating) {
  try {
    const response = await fetch(`${BASE_URL}/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ userId, roomId, text, rating }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Nepodarilo sa odoslať recenziu.");
    }

    return await response.json();
  } catch (err) {
    console.error("Chyba pri odosielaní recenzie:", err);
    throw err;
  }
}

export async function fetchReviewsByUser(userId) {
  try {
    const response = await fetch(`${BASE_URL}/user/${userId}`);
    if (!response.ok) {
      throw new Error("Nepodarilo sa načítať recenzie používateľa.");
    }
    return await response.json();
  } catch (err) {
    console.error("Chyba pri načítavaní recenzií používateľa:", err);
    throw err;
  }
}

export async function fetchReviewsByRoom(roomId) {
  try {
    const response = await fetch(`${BASE_URL}/room/${roomId}`);
    if (!response.ok) {
      throw new Error("Nepodarilo sa načítať recenzie pre izbu.");
    }
    return await response.json();
  } catch (err) {
    console.error("Chyba pri načítavaní recenzií pre izbu:", err);
    throw err;
  }
}