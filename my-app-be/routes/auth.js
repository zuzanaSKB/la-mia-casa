import express from 'express';
import { getUser } from '../models/users.js';
import { comparePassword } from '../utils/authHelpers.js';
import { config } from '../config/config.js';

const router = express.Router();

// Login route
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await getUser(email); //get user from DB
        
        if (result.rows && result.rows.length === 1) {
            const user = result.rows[0];            
            const isValid = await comparePassword(password, user.password); //compare password

            if (isValid) {
                req.session.userId = user.id;  //create session
                console.log("Session created:", req.session);

                return res.status(200).send({
                    message: 'Logged in successfully',
                    id: user.id,
                    role: user.role,
                    name: user.name,
                    email: user.email
                });
            } else {
                return res.status(401).send({ error: 'Invalid credentials' });
            }
        } else {
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
