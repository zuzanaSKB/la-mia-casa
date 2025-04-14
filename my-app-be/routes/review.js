import express from 'express';
import { addReview,  getReviewsByRoom,  getReviewsByUser } from '../models/reviews.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { userId, roomId, text, rating } = req.body;

  if (!userId || !roomId || !rating) {
    return res.status(400).json({ error: "Chýbajú požadované údaje." });
  }

  try {
    const newReview = await addReview({ userId, roomId, text, rating });
    res.status(201).json(newReview);
  } catch (error) {
    console.error("Chyba pri vytváraní recenzie:", error);
    res.status(500).json({ error: "Chyba servera pri ukladaní recenzie." });
  }
});

router.get('/room/:roomId', async (req, res) => {
  const { roomId } = req.params;

  try {
    const reviews = await getReviewsByRoom(roomId);
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Chyba pri načítaní recenzií:", error);
    res.status(500).json({ error: "Chyba pri načítaní recenzií." });
  }
});

router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const reviews = await getReviewsByUser(userId);
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Chyba pri načítaní recenzií používateľa:", error);
    res.status(500).json({ error: "Nepodarilo sa načítať recenzie." });
  }
});

router.delete('/:reviewId', async (req, res) => {
    const { reviewId } = req.params;
    try {
      await deleteReview(reviewId);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Chyba pri mazaní recenzie:", error);
      res.status(500).json({ error: "Nepodarilo sa vymazať recenziu." });
    }
  });
  

export default router;
