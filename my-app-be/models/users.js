import pool from '../config/db.js';
import { createOrUpdateBirthdayDiscount } from './birthdayDiscounts.js';

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

export async function getUserById(id) {
    const result = await pool.query(
      `
      SELECT id, name, email, phone_number, birth_date, role
      FROM users
      WHERE id = $1`,
      [id]
    );
  
    return result.rows[0];
  }  

  export async function addUser(name, email, phone_number, birth_date, password) {
    try {
        // insert user into DB and get the user ID
        const result = await pool.query(
            `INSERT INTO users (name, email, phone_number, birth_date, password, role)
             VALUES($1, $2, $3, $4, $5, 'guest') RETURNING id`,
            [name, email, phone_number, birth_date, password]
        );
        
        const userId = result.rows[0].id;

        //create the birthday discount for this user
        const discountResult = await createOrUpdateBirthdayDiscount(userId, birth_date);

        if (discountResult.success) {
            return { success: true, message: "User added successfully, and birthday discount has been created/updated." };
        } else {
            throw new Error(discountResult.error);
        }
    } catch (error) {
        console.error("Error while adding user:", error);
        return { success: false, error: "Failed to add user: " + error.message };
    }
}