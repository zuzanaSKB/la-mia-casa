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