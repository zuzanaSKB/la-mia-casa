import pool from '../config/db.js';

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