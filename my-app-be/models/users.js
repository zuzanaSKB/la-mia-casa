import pool from '../config/db.js';


export const getUsers = (email) => {
    return pool.query(
        "SELECT * FROM users u WHERE u.email = $1",
        [email]
    );
};
