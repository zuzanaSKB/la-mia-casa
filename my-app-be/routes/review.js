import express from 'express';
import { addReview,  getReviewsByRoom,  getReviewsByUser, deleteReview, updateReview, getAllReviews, getAllPublishedReviews, togglePublishReview } from '../models/reviews.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { userId, roomId, text, rating, reservationId } = req.body;

  if (!userId || !roomId || rating === undefined || rating === null) {
    return res.status(400).json({ error: "Chýbajú požadované údaje." });
  }

  try {
    const newReview = await addReview({ userId, roomId, text, rating, reservationId });
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
  
  router.put('/:reviewId', async (req, res) => {
    const { reviewId } = req.params;
    const { text, rating } = req.body;
  
    if (!rating) {
      return res.status(400).json({ error: "Chýba hodnotenie." });
    }
  
    try {
      const updated = await updateReview(reviewId, { text, rating });
      res.status(200).json(updated);
    } catch (error) {
      console.error("Chyba pri úprave recenzie:", error);
      res.status(500).json({ error: "Nepodarilo sa upraviť recenziu." });
    }
  });

  //admin
  //get all reviews
  router.get('/reviews', async (req, res) => {
    try {
      const reviews = await getAllReviews();
      res.json(reviews);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: "Nepodarilo sa načítať všetky recenzie." });
    }
  });

export default router;

//get all published reviews
router.get('/published', async (req, res) => {
  try {
    const reviews = await getAllPublishedReviews();
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Chyba pri načítaní publikovaných recenzií:", error);
    res.status(500).json({ error: "Nepodarilo sa načítať publikované recenzie." });
  }
});

//publish review
router.put('/publish/:reviewId', async (req, res) => {
  const { reviewId } = req.params;
  const { published } = req.body;

  try {
    const updated = await togglePublishReview(reviewId, published);
    res.status(200).json(updated);
  } catch (error) {
    console.error("Chyba pri zmene publikácie recenzie:", error);
    res.status(500).json({ error: "Nepodarilo sa zmeniť stav publikácie recenzie." });
  }
});
