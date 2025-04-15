import pool from '../config/db.js';


export const getUser = (email) => {
    return pool.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
    );
};

export const getUserRole = (email) => {
    return pool.query(
        "SELECT role FROM users WHERE email = $1",
        [email]
    );
};


export async function addUser(name, email, phone_number, birth_date, password) {
    try {
        //insert user data into DB
        await pool.query(
            `INSERT INTO users (name, email, phone_number, birth_date, password, role)
             VALUES($1, $2, $3, $4, $5, 'guest')`,
            [name, email, phone_number, birth_date, password]
        );
        return { success: true, message: "Používateľ bol úspešne pridaný." };
    } catch (error) {
        console.error("Chyba pri pridávaní používateľa:", error);
        return { success: false, error: "Nepodarilo sa pridať používateľa: " + error.message };
    }
}