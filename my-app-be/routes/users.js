import express from "express";
import { addUser, getUser, getUserById, updateUserName, updateUserPhone, updateUserPassword } from "../models/users.js";
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

router.get("/me", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Neautorizovaný prístup." });
  }

  try {
    const user = await getUserById(req.session.userId);
    console.log(user)

    if (!user) {
      return res.status(404).json({ error: "Používateľ nenájdený." });
    }

    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: "Interná chyba servera." });
  }
});

router.patch("/me/name", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Neautorizovaný prístup." });
  }

  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Meno je povinné." });

  try {
    const updatedUser = await updateUserName(req.session.userId, name);
    res.json({ message: "Meno bolo aktualizované.", user: updatedUser });
  } catch (err) {
    console.error("Chyba pri aktualizácii mena:", err);
    res.status(500).json({ error: "Nepodarilo sa aktualizovať meno." });
  }
});

router.patch("/me/phone", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Neautorizovaný prístup." });
  }

  const { phone_number } = req.body;
  if (!phone_number) return res.status(400).json({ error: "Telefónne číslo je povinné." });

  try {
    const updatedUser = await updateUserPhone(req.session.userId, phone_number);
    res.json({ message: "Telefón bol aktualizovaný.", user: updatedUser });
  } catch (err) {
    console.error("Chyba pri aktualizácii telefónneho čísla:", err);
    res.status(500).json({ error: "Nepodarilo sa aktualizovať telefón." });
  }
});

router.patch("/me/password", async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: "Neautorizovaný prístup." });
  }

  const { password } = req.body;
  if (!password) return res.status(400).json({ error: "Heslo je povinné." });

  try {
    const hashedPassword = await hashPassword(password);
    const updatedUser = await updateUserPassword(req.session.userId, hashedPassword);
    res.json({ message: "Heslo bolo aktualizované.", user: updatedUser });
  } catch (err) {
    console.error("Chyba pri aktualizácii hesla:", err);
    res.status(500).json({ error: "Nepodarilo sa aktualizovať heslo." });
  }
});

export default router;