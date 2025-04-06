import express from 'express';
import { getUsers } from '../models/users.js';
import { comparePassword } from '../utils/authHelpers.js';
import { config } from '../config/config.js';

const router = express.Router();

// Login route
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await getUsers(email); //get user from DB
        
        if (result.rows && result.rows.length === 1) {
            const userId = result.rows[0].user_id;
            const hashedPassword = result.rows[0].password;
            
            const isValid = await comparePassword(password, hashedPassword); //compare password

            if (isValid) {
                req.session.userId = userId;  //create session
                return res.status(200).send({ message: 'Logged in successfully' });
            } else {
                console.log("Invalid password");
                return res.status(401).send({ error: 'Invalid credentials' });
            }
        } else {
            console.log("User does not exist");
            return res.status(401).send({ error: 'User does not exist' });
        }
    } catch (e) {
        console.error("Error during login:", e);
        return res.status(500).send({ error: 'Internal server error' });
    }
});

// Logout route
router.delete("/logout", async (req, res) => {
    try {
        if (req.session && req.session.userId) {
            await new Promise((resolve, reject) => {
                req.session.destroy((err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
            res.clearCookie(config.session.cookieName);  //clear cookie in browser
            return res.status(200).send({ message: 'Logged out successfully' });
        } else {
            return res.status(400).send({ error: 'Session does not exist' });
        }
    } catch (e) {
        console.error("Error during logout:", e);
        return res.status(500).send({ error: 'Internal server error' });
    }
});

export default router;
