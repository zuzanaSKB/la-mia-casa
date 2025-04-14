import pool from '../config/db.js';

export async function getAllRooms() {
    try {
        const result = await pool.query("SELECT * FROM rooms ORDER BY id");
        return result.rows;
      } catch (error) {
        console.error("Error fetching rooms:", error);
        throw new Error("Could not retrieve rooms from DB");
      }
};

export async function getAvailableRooms(from, to) {
    try {
      const result = await pool.query(
        `SELECT *
         FROM rooms
         WHERE is_available = true
           AND id NOT IN (
             SELECT room_id
             FROM reservations
             WHERE status IN ('confirmed', 'pending')
               AND NOT (
                 end_date <= $1 OR start_date >= $2
               )
           )
         ORDER BY id`,
        [from, to]
      );
      return result.rows;
    } catch (err) {
      console.error("Error checking room availability:", err);
      throw new Error("Database error: could not fetch available rooms");
    }
  };

export async function addReservation(user_id, room_id, start_date, end_date) {
    try {
        await pool.query(
            `INSERT INTO reservations(user_id, room_id, start_date, end_date, status) 
             VALUES($1, $2, $3, $4, 'pending')`,
            [user_id, room_id, start_date, end_date]
        );
        return { success: true, message: "Reservation added successfully" };
    } catch (error) {
        console.error("Error adding reservation:", error);
        return { success: false, error: error.message };
    }
};

export async function getUserReservations(userId) {
  try {
    const currentDate = new Date();

    const result = await pool.query(
      `SELECT 
         r.id, 
         r.room_id, 
         rooms.name AS room_name, 
         r.start_date AS start_date, 
         r.end_date AS end_date, 
         r.status
       FROM reservations r
       JOIN rooms ON r.room_id = rooms.id
       WHERE r.user_id = $1
         AND r.status IN ('pending', 'confirmed')
         AND r.end_date >= $2
       ORDER BY r.start_date DESC`, 
      [userId, currentDate]
    );

    return result.rows;
  } catch (error) {
    console.error("Error fetching active reservations for user:", error);
    throw new Error("Could not fetch active reservations for user");
  }
};

export async function getUserPastReservations(userId) {
  try {
    const currentDate = new Date();

    const result = await pool.query(
      `SELECT 
         r.id, 
         r.room_id,
         rooms.name AS room_name,
         r.start_date, 
         r.end_date, 
         r.status
       FROM reservations r
       JOIN rooms ON r.room_id = rooms.id
       WHERE r.user_id = $1
         AND r.status IN ('confirmed')
         AND r.end_date < $2
       ORDER BY r.end_date DESC`,
      [userId, currentDate]
    );

    return result.rows;
  } catch (error) {
    console.error("Error fetching past reservations for user:", error);
    throw new Error("Could not fetch past reservations for user");
  }
}

export async function cancelReservation(reservationId) {
  try {
    const result = await pool.query(
      `UPDATE reservations SET status = 'canceled' WHERE id = $1 RETURNING *`,
      [reservationId]
    );

    if (result.rows.length === 0) {
      throw new Error("Reservation not found");
    }

    return { success: true, message: "Reservation canceled successfully" };
  } catch (error) {
    console.error("Error cancelling reservation:", error);
    throw new Error("Could not cancel reservation");
  }
}
