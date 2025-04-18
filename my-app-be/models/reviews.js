import pool from '../config/db.js';

// insert a new review
export async function addReview({ userId, roomId, text, rating, reservationId }) {
  //check for existing review for this reservation
  const existing = await pool.query(
    `SELECT id FROM reviews WHERE reservation_id = $1 AND deleted = FALSE`,
    [reservationId]
  );
  if (existing.rows.length > 0) {
    throw new Error("Recenzia pre túto rezerváciu už existuje.");
  }
  const result = await pool.query(
    `INSERT INTO reviews (user_id, room_id, text, rating, reservation_id)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [userId, roomId, text, rating, reservationId]
  );
  return result.rows[0];
}

// get all not deleted reviews for a specific room
export async function getReviewsByRoom(roomId) {
  const result = await pool.query(
    `SELECT r.*, u.name AS user_name 
     FROM reviews r
     JOIN users u ON r.user_id = u.id
     WHERE r.room_id = $1 AND r.deleted = FALSE
     ORDER BY r.date DESC`,
    [roomId]
  );
  return result.rows;
}

// get all not deleted reviews by a user with reservation dates
export async function getReviewsByUser(userId) {
  const result = await pool.query(
    `SELECT r.*, 
            rooms.name AS room_name, 
            reservations.start_date AS reservation_start, 
            reservations.end_date AS reservation_end
     FROM reviews r
     JOIN rooms ON r.room_id = rooms.id
     JOIN reservations ON r.reservation_id = reservations.id
     WHERE r.user_id = $1 AND r.deleted = FALSE
     ORDER BY r.date DESC`,
    [userId]
  );
  return result.rows;
}

// soft delete review (set deleted to true)
export async function deleteReview(reviewId) {
  await pool.query(
    `UPDATE reviews SET deleted = TRUE WHERE id = $1`,
    [reviewId]
  );
}

export async function updateReview(reviewId, { text, rating }) {
  const result = await pool.query(
    `UPDATE reviews SET text = $1, rating = $2, date = NOW()
     WHERE id = $3 RETURNING *`,
    [text, rating, reviewId]
  );
  return result.rows[0];
}

//admin

export async function getAllReviews() {
  const result = await pool.query(
    `SELECT 
        r.id,
        r.text,
        r.rating,
        r.date,
        r.deleted,
        r.published,
        u.name AS user_name,
        rm.name AS room_name,
        r.reservation_id
     FROM reviews r
     JOIN users u ON r.user_id = u.id
     JOIN rooms rm ON r.room_id = rm.id
     WHERE r.deleted = FALSE
     ORDER BY r.date DESC`
  );
  return result.rows;
}

//returns reviews to publish with room name
export async function getAllPublishedReviews() {
  const result = await pool.query(
    `SELECT r.*, u.name AS user_name, ro.name AS room_name
     FROM reviews r
     JOIN users u ON r.user_id = u.id
     JOIN rooms ro ON r.room_id = ro.id
     WHERE r.deleted = FALSE AND r.published = TRUE
     ORDER BY r.date DESC`
  );
  return result.rows;
}

//toggle published status
export async function togglePublishReview(reviewId, published) {
  const result = await pool.query(
    `UPDATE reviews SET published = $1 WHERE id = $2 RETURNING *`,
    [published, reviewId]
  );
  return result.rows[0];
}