import express from "express";
import { addUser, getUser } from "../models/users.js";
import { hashPassword } from '../utils/authHelpers.js';

const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, email, phone_number, birth_date, password } = req.body;

  try {
    const result = await getUser(email);

    if (result.rows.length > 0) {
        return res.status(400).json({ error: "Email je už použitý." });
    }

    const hashedPassword = await hashPassword(password);

    const userResult = await addUser(name, email, phone_number, birth_date, hashedPassword);

    if (userResult.success) {
        res.status(201).json({ message: "Registrácia prebehla úspešne." });
    } else {
        res.status(400).json({ error: userResult.error || "Chyba pri registrácii." });
    }
  } catch (err) {
    console.error("Chyba pri registrácii:", err);
    res.status(500).json({ error: "Interná chyba servera." });
  }
});

export default router;