import express from "express";
import { addUser } from "../models/users.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, email, phone_number, password, birth_date } = req.body;
  
  const result = await addUser(name, email, phone_number, password, birth_date);

  if (result.success) {
    res.status(201).json({ message: result.message });
  } else {
    res.status(400).json({ error: result.error });
  }
});

export default router;
