import express from "express";
import { getAvailableRooms, addReservation, getUserReservations, getUserPastReservations, cancelReservation } from "../models/reservations.js";

const router = express.Router();

//get all available rooms
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

  router.get("/user/:id", async (req, res) => {
    const userId = req.params.id;
  
    try {
      const reservations = await getUserReservations(userId);
  
      if (reservations.length === 0) {
        return res.status(200).json([]);
      }
  
      res.status(200).json(reservations);
    } catch (err) {
      console.error("Failed to fetch reservations:", err.message);
      res.status(500).json({ error: "Failed to load reservations" });
    }
  });

  router.get("/user/:id/past", async (req, res) => {
    const userId = req.params.id;
  
    try {
      const pastReservations = await getUserPastReservations(userId);
      res.status(200).json(pastReservations);
    } catch (err) {
      console.error("Failed to fetch past reservations:", err.message);
      res.status(500).json({ error: "Failed to load past reservations" });
    }
  });
  

  router.patch("/cancel/:id", async (req, res) => {
    const reservationId = req.params.id;
  
    try {
      const response = await cancelReservation(reservationId);
      res.status(200).json(response);
    } catch (err) {
      console.error("Error cancelling reservation:", err);
      res.status(500).json({ error: "Failed to cancel reservation" });
    }
  });


export default router;