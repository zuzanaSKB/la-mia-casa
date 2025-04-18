import express from 'express';
import { getUser } from '../models/users.js';
import { comparePassword } from '../utils/authHelpers.js';
import { config } from '../config/config.js';
import { createOrUpdateBirthdayDiscountIfToday } from '../models/birthdayDiscounts.js';

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
                
                //create birthday discount if its user's birthday
                await createOrUpdateBirthdayDiscountIfToday(user.id, user.birth_date);

                return res.status(200).send({
                    message: 'Prihlásenie prebehlo úspešne.',
                    id: user.id,
                    role: user.role,
                    name: user.name,
                    email: user.email,
                    phone_number: user.phone_number,
                    birth_date: user.birth_date
                });
            } else {
                return res.status(401).send({ error: 'Neplatné prihlasovacie údaje.' });
            }
        } else {
            return res.status(401).send({ error: 'Používateľ s daným emailom neexistuje.' });
        }
    } catch (e) {
        console.error("Chyba počas prihlasovania:", e);
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
            return res.status(200).send({ message: 'Úspešné odhlásenie.' });
        } else {
            return res.status(400).send({ error: 'Session does not exist' });
        }
    } catch (e) {
        console.error("Error during logout:", e);
        return res.status(500).send({ error: 'Internal server error' });
    }
});

export default router;