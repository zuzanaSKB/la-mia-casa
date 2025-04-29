import express from "express";
import { addUser, getUserById, updateUserName, updateUserPhone, updateUserPassword } from "../models/users.js";
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

router.get("/:id", async (req, res) => {
  try {
    const user = await getUserById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "Používateľ nenájdený." });
    }

    res.json({ user });
  } catch (err) {
    console.error("Chyba pri načítavaní používateľa:", err);
    res.status(500).json({ error: "Interná chyba servera." });
  }
});

router.patch("/:id/name", async (req, res) => {
  const { name } = req.body;
  const { id } = req.params;

  if (!name) return res.status(400).json({ error: "Meno je povinné." });

  try {
    const updatedUser = await updateUserName(id, name);
    res.json({ message: "Meno bolo aktualizované.", user: updatedUser });
  } catch (err) {
    console.error("Chyba pri aktualizácii mena:", err);
    res.status(500).json({ error: "Nepodarilo sa aktualizovať meno." });
  }
});

router.patch("/:id/phone", async (req, res) => {
  const { phone_number } = req.body;
  const { id } = req.params;

  if (!phone_number) return res.status(400).json({ error: "Telefónne číslo je povinné." });

  try {
    const updatedUser = await updateUserPhone(id, phone_number);
    res.json({ message: "Telefón bol aktualizovaný.", user: updatedUser });
  } catch (err) {
    console.error("Chyba pri aktualizácii telefónneho čísla:", err);
    res.status(500).json({ error: "Nepodarilo sa aktualizovať telefón." });
  }
});

router.patch("/:id/password", async (req, res) => {
  const { password } = req.body;
  const { id } = req.params;

  if (!password) return res.status(400).json({ error: "Heslo je povinné." });

  try {
    await updateUserPassword(id, password);
    res.json({ message: "Heslo bolo aktualizované." });
  } catch (err) {
    console.error("Chyba pri aktualizácii hesla:", err);
    res.status(500).json({ error: "Nepodarilo sa aktualizovať heslo." });
  }
});

export default router;