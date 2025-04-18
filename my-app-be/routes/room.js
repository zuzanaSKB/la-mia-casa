import express from "express";
import { getAllRooms, getAvailableRooms, updateRoomPrice, updateRoomAvailability } from "../models/rooms.js";

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

// admin
router.get("/", async (req, res) => {
    try {
      const rooms = await getAllRooms();
      res.status(200).json(rooms);
    } catch (err) {
      console.error("Chyba pri načítavaní všetkých izieb:", err);
      res.status(500).json({ error: "Nepodarilo sa načítať izby." });
    }
});  

router.patch("/:id/price", async (req, res) => {
    const { id } = req.params;
    const { price_per_night } = req.body;
  
    if (typeof price_per_night !== "number") {
      return res.status(400).json({ error: "Neplatná cena." });
    }
  
    try {
      await updateRoomPrice(id, price_per_night);
      res.json({ message: "Cena bola aktualizovaná." });
    } catch (err) {
      console.error("Chyba pri aktualizácii ceny:", err);
      res.status(500).json({ error: "Nepodarilo sa aktualizovať cenu." });
    }
});
  
router.patch("/:id/availability", async (req, res) => {
    const { id } = req.params;
    const { is_available } = req.body;
  
    if (typeof is_available !== "boolean") {
      return res.status(400).json({ error: "Neplatná dostupnosť." });
    }
  
    try {
      await updateRoomAvailability(id, is_available);
      res.json({ message: "Dostupnosť bola aktualizovaná." });
    } catch (err) {
      console.error("Chyba pri aktualizácii dostupnosti:", err);
      res.status(500).json({ error: "Nepodarilo sa aktualizovať dostupnosť." });
    }
});

export default router;