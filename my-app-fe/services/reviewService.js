const BASE_URL = "http://localhost:3000/review";

//create / update review
export async function submitReview(userId, roomId, text, rating, reservationId, reviewId = null) {
  try {
    const method = reviewId ? "PUT" : "POST";
    const url = reviewId ? `${BASE_URL}/${reviewId}` : `${BASE_URL}/`;

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ userId, roomId, reservationId, text, rating, reservationId }),
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

//fetch reviews by user
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

//fetch reviews by room
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

//delete review by ID
export async function deleteReview(reviewId) {
  try {
    const response = await fetch(`${BASE_URL}/${reviewId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Nepodarilo sa vymazať recenziu.");
    }

    return await response.json();
  } catch (err) {
    console.error("Chyba pri mazaní recenzie:", err);
    throw err;
  }
}