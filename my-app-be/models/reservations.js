import pool from '../config/db.js';

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

//admin

export async function getAllReservations() {
  try {
    const currentDate = new Date();

    const query = `
      SELECT r.*, u.name AS user_name, rm.name AS room_name
      FROM reservations r
      JOIN users u ON u.id = r.user_id
      JOIN rooms rm ON rm.id = r.room_id
      WHERE r.end_date >= $1
      ORDER BY r.start_date DESC
    `;

    const result = await pool.query(query, [currentDate]);

    return result.rows;
  } catch (error) {
    console.error("Chyba pri načítavaní všetkých rezervácií:", error);
    throw new Error("Nepodarilo sa načítať všetky rezervácie");
  }
}

export async function updateReservationStatus(reservationId, newStatus) {
  try {
    const validStatuses = ['pending', 'confirmed', 'canceled'];
    if (!validStatuses.includes(newStatus)) {
      throw new Error("Neplatný stav rezervácie.");
    }

    const result = await pool.query(
      `UPDATE reservations 
       SET status = $1 
       WHERE id = $2 
       RETURNING *`,
      [newStatus, reservationId]
    );

    if (result.rows.length === 0) {
      throw new Error("Rezervácia nebola nájdená");
    }

    return { success: true, message: "Stav rezervácie bol aktualizovaný", reservation: result.rows[0] };
  } catch (error) {
    console.error("Chyba pri aktualizácii stavu rezervácie:", error);
    throw new Error("Nepodarilo sa aktualizovať stav rezervácie");
  }
}
