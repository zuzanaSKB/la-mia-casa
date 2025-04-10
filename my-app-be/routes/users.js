import express from "express";
import { addUser, getUser } from "../models/users.js";
import { hashPassword } from '../utils/authHelpers.js';

const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, email, phone_number, birth_date, password } = req.body;
  const result = await getUser(email);  //check if user already exists

  if (result.rows.length > 0) {
      return res.status(400).json({ error: "Email is already in use" });
  }

  const hashedPassword = await hashPassword(password);  //hash password

  const userResult = await addUser(name, email, phone_number, birth_date, hashedPassword); //add user to DB

  if (userResult.success) {
      res.status(201).json({ message: "User registered successfully" });
  } else {
      res.status(400).json({ error: userResult.error || "Error registering user" });
  }
});

export default router;
