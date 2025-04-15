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

export async function addReservation(user_id, room_id, start_date, end_date) {
  try {
    await pool.query(
      `INSERT INTO reservations(user_id, room_id, start_date, end_date, status) 
       VALUES($1, $2, $3, $4, 'pending')`,
      [user_id, room_id, start_date, end_date]
    );
    return { success: true, message: "Rezervácia bola úspešne pridaná" };
  } catch (error) {
    console.error("Chyba pri pridávaní rezervácie:", error);
    return { success: false, error: "Nepodarilo sa vytvoriť rezerváciu" };
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
    console.error("Chyba pri načítavaní aktívnych rezervácií používateľa:", error);
    throw new Error("Nepodarilo sa načítať aktívne rezervácie používateľa");
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
    console.error("Chyba pri načítavaní minulých rezervácií používateľa:", error);
    throw new Error("Nepodarilo sa načítať minulé rezervácie používateľa");
  }
};

export async function cancelReservation(reservationId) {
  try {
    const result = await pool.query(
      `UPDATE reservations SET status = 'canceled' WHERE id = $1 RETURNING *`,
      [reservationId]
    );

    if (result.rows.length === 0) {
      throw new Error("Rezervácia nebola nájdená");
    }

    return { success: true, message: "Rezervácia bola úspešne zrušená" };
  } catch (error) {
    console.error("Chyba pri rušení rezervácie:", error);
    throw new Error("Nepodarilo sa zrušiť rezerváciu");
  }
};