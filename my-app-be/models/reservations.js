import pkg from 'pg';
import { config } from '../config.secrets.js';

const { Pool } = pkg; 

const pool = new Pool({
    user: config.db.user,
    host: config.db.host,
    database: config.db.database,
    password: config.db.password,
    port: config.db.port,
});

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

export async function addUser(name, email, phone_number, password, birth_date) {
    try {
        await pool.query(
            `INSERT INTO users (name, email, phone_number, password, birth_date, role)
             VALUES($1, $2, $3, $4, $5, 'guest')`,
            [name, email, phone_number, password, birth_date]
        );
        return { success: true, message: "User added successfully" };
    } catch (error) {
        console.error("Error adding user:", error);
        return { success: false, error: error.message };
    }
};
