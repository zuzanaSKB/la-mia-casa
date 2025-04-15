import express from "express";
import { getAvailableRooms, addReservation, getUserReservations, getUserPastReservations, cancelReservation } from "../models/reservations.js";

const router = express.Router();

//get all available rooms
router.get("/available-rooms", async (req, res) => {
    const { from, to } = req.query;

    if (!from || !to) {
      return res.status(400).json({ error: "Chýba dátum 'od' alebo 'do'." });
    }

    try {
        const rooms = await getAvailableRooms(from, to);
        res.status(200).json(rooms);
    } catch (err) {
      res.status(500).json({ error: "Chyba pri načítavaní dostupných izieb." });
    }
});

//add room reservation
router.post("/add", async (req, res) => {
    const { roomId, from, to, userId } = req.body;
  
    if (!roomId || !from || !to || !userId) {
      return res.status(400).json({
        error: "Chýbajú povinné údaje: roomId, from, to, userId."
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(from);
    const endDate = new Date(to);
  
    if (startDate < today || endDate < today) {
      return res.status(400).json({ error: "Nemôžete vytvoriť rezerváciu v minulosti." });
    }
  
    if (startDate > endDate) {
      return res.status(400).json({ error: "Dátum odchodu musí byť po dátume príchodu." });
    }
  
    try {
      const reservation = await addReservation(userId, roomId, from, to);
      res.status(201).json(reservation);
    } catch (err) {
      res.status(500).json({ error: "Nepodarilo sa vytvoriť rezerváciu." });
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
      console.error("Chyba pri načítavaní rezervácií:", err.message);
      res.status(500).json({ error: "Nepodarilo sa načítať rezervácie." });
    }
  });

  router.get("/user/:id/past", async (req, res) => {
    const userId = req.params.id;
  
    try {
      const pastReservations = await getUserPastReservations(userId);
      res.status(200).json(pastReservations);
    } catch (err) {
      console.error("Chyba pri načítavaní minulých rezervácií:", err.message);
      res.status(500).json({ error: "Nepodarilo sa načítať minulé rezervácie." });
    }
  });
  

  router.patch("/cancel/:id", async (req, res) => {
    const reservationId = req.params.id;
  
    try {
      const response = await cancelReservation(reservationId);
      res.status(200).json(response);
    } catch (err) {
      console.error("Chyba pri rušení rezervácie:", err);
      res.status(500).json({ error: "Nepodarilo sa zrušiť rezerváciu." });
    }
  });


export default router;