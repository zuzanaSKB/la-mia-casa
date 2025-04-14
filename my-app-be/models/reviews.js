import pool from '../config/db.js';

// insert a new review
export async function addReview({ userId, roomId, text, rating }) {
  const result = await pool.query(
    `INSERT INTO reviews (user_id, room_id, text, rating)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [userId, roomId, text, rating]
  );
  return result.rows[0];
}

// get all reviews for a specific room
export async function getReviewsByRoom(roomId) {
  const result = await pool.query(
    `SELECT r.*, u.name AS user_name 
     FROM reviews r
     JOIN users u ON r.user_id = u.id
     WHERE r.room_id = $1
     ORDER BY r.date DESC`,
    [roomId]
  );
  return result.rows;
}

// get all reviews by a user
export async function getReviewsByUser(userId) {
  const result = await pool.query(
    `SELECT r.*, rooms.name AS room_name
     FROM reviews r
     JOIN rooms ON r.room_id = rooms.id
     WHERE r.user_id = $1
     ORDER BY r.date DESC`,
    [userId]
  );
  return result.rows;
}

export async function deleteReview(reviewId) {
  await pool.query(`DELETE FROM reviews WHERE id = $1`, [reviewId]);
}