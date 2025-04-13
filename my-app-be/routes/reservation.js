import express from "express";
import { getAvailableRooms } from "../models/reservations.js";
import { addReservation } from "../models/reservations.js";

const router = express.Router();

//get all avai;able rooms
router.get("/available-rooms", async (req, res) => {
    const { from, to } = req.query;

    if (!from || !to) {
        return res.status(400).json({ error: "Missing 'from' or 'to' date" });
    }

    try {
        const rooms = await getAvailableRooms(from, to);
        res.status(200).json(rooms);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//add room reservation
router.post("/add", async (req, res) => {
    const { roomId, from, to, userId } = req.body;
  
    if (!roomId || !from || !to || !userId) {
      return res.status(400).json({ error: "Missing required fields: roomId, from, to, userId" });
    }
  
    try {
      const reservation = await addReservation(userId, roomId, from, to);
      res.status(201).json(reservation);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

export default router;