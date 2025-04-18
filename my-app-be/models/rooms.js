import pool from '../config/db.js';

export async function getAllRooms() {
    try {
      const result = await pool.query("SELECT * FROM rooms ORDER BY id");
      return result.rows;
    } catch (error) {
      console.error("Chyba pri načítavaní izieb:", error);
      throw new Error("Nepodarilo sa získať izby z databázy");
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
        console.error("Chyba pri kontrole dostupnosti izieb:", err);
        throw new Error("Chyba databázy: Nepodarilo sa načítať dostupné izby");
    }
};
  
export async function updateRoomPrice(roomId, price_per_night) {
    return pool.query(
      `UPDATE rooms SET price_per_night = $1 WHERE id = $2`,
      [price_per_night, roomId]
    );
  }
  
export async function updateRoomAvailability(roomId, is_available) {
    return pool.query(
      `UPDATE rooms SET is_available = $1 WHERE id = $2`,
      [is_available, roomId]
    );
}