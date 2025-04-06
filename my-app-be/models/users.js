import pool from '../config/db.js';


export const getUsers = (email) => {
    return pool.query(
        "SELECT * FROM users WHERE email = $1",
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
        return { success: true, message: "User added successfully" };
    } catch (error) {
        console.error("Error adding user:", error);
        return { success: false, error: error.message };
    }
};