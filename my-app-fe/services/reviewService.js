const BASE_URL = "http://localhost:3000/review";

//create / update review
export async function submitReview(userId, roomId, text, rating, reservationId, reviewId = null) {
  try {
    const method = reviewId ? "PUT" : "POST";
    const url = reviewId ? `${BASE_URL}/${reviewId}` : `${BASE_URL}/`;

    console.log("Review payload:", {
      userId,
      roomId,
      text,
      rating,
      reservationId
    });
    
    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        userId,
        roomId,
        text,
        rating,
        reservationId
      })      
    });

    if (!response.ok) {
      console.log(response);
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

//admin

//fetch all reviews
export async function fetchAllReviews() {
  try {
    const response = await fetch(`${BASE_URL}/reviews`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Nepodarilo sa načítať všetky recenzie.");
    }

    return await response.json();
  } catch (err) {
    console.error("Chyba pri načítavaní všetkých recenzií:", err);
    throw err;
  }
}

//fetch all published reviews
export async function fetchAllPublishedReviews() {
  try {
    const response = await fetch(`${BASE_URL}/published`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Nepodarilo sa načítať publikované recenzie.");
    }

    return await response.json();
  } catch (err) {
    console.error("Chyba pri načítavaní publikovaných recenzií:", err);
    throw err;
  }
}

//publish review
export async function setReviewPublished(reviewId, published) {
  try {
    const response = await fetch(`${BASE_URL}/publish/${reviewId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ published }),
    });

    if (!response.ok) {
      throw new Error("Nepodarilo sa zmeniť publikáciu recenzie.");
    }

    return await response.json();
  } catch (err) {
    console.error("Chyba pri zmene publikácie:", err);
    throw err;
  }
}