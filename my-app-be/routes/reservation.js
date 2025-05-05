import express from "express";
import { addReservation, getUserReservations, getUserPastReservations, cancelReservation, getAllReservations, updateReservationStatus } from "../models/reservations.js";

const router = express.Router();

//add room reservation
router.post("/add", async (req, res) => {
    const { roomId, from, to, price } = req.body;
    const userId = req.session.userId;

    if (!req.session.userId) {
      return res.status(401).json({ error: "Neautorizovaný prístup." });
    }
  
    if (!roomId || !from || !to || price === undefined) {
      return res.status(400).json({
        error: "Chýbajú povinné údaje: roomId, from, to, price."
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
      const reservation = await addReservation(req.session.userId, roomId, from, to, price);
      res.status(201).json(reservation);
    } catch (err) {
      res.status(500).json({ error: "Nepodarilo sa vytvoriť rezerváciu." });
    }
  });

  router.get("/user/reservations", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Neautorizovaný prístup." });
    }
  
    try {
      const reservations = await getUserReservations(req.session.userId);
  
      if (reservations.length === 0) {
        return res.status(200).json([]);
      }
  
      res.status(200).json(reservations);
    } catch (err) {
      console.error("Chyba pri načítavaní rezervácií:", err.message);
      res.status(500).json({ error: "Nepodarilo sa načítať rezervácie." });
    }
  });

  router.get("/user/past", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Neautorizovaný prístup." });
    }
  
    try {
      const pastReservations = await getUserPastReservations(req.session.userId);
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

  //admin

  router.get("/all", async (req, res) => {
    if (!req.session.userId || req.session.role !== "admin") {
      return res.status(403).json({ error: "Prístup zamietnutý." });
    }

    try {
      const reservations = await getAllReservations();
      if (reservations.length === 0) {
        return res.status(200).json([]);
      }

      res.status(200).json(reservations);
    } catch (err) {
      console.error("Chyba pri načítavaní všetkých rezervácií:", err.message);
      res.status(500).json({ error: "Nepodarilo sa načítať rezervácie." });
    }
  });

  router.patch("/status/:id", async (req, res) => {
    const reservationId = parseInt(req.params.id, 10);
    const { status } = req.body;
  
    if (isNaN(reservationId)) {
      return res.status(400).json({ error: "Neplatné ID rezervácie." });
    }
  
    if (!status) {
      return res.status(400).json({ error: "Status je povinný." });
    }
  
    try {
      const updated = await updateReservationStatus(reservationId, status);
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: err.message || "Chyba pri aktualizácii stavu." });
    }
  });
  

export default router;