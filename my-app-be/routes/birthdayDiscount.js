import express from 'express';
import { createOrUpdateBirthdayDiscount, getBirthdayDiscount, applyBirthdayDiscount, expireBirthdayDiscount } from '../models/birthdayDiscounts.js';

const router = express.Router();

//create or update birthday discount for a user
router.post('/createOrUpdateBirthdayDiscount', async (req, res) => {
    const { userId, date } = req.body;
    if (!userId || !date) {
        return res.status(400).json({ error: 'UserId and date are required.' });
    }

    const result = await createOrUpdateBirthdayDiscount(userId, date);
    if (result.success) {
        return res.json({ message: result.message });
    } else {
        return res.status(500).json({ error: result.error });
    }
});

//get birthday discount for a user
router.get('/getBirthdayDiscount', async (req, res) => {
    const { userId } = req.query;
    if (!userId) {
        return res.status(400).json({ error: 'UserId is required.' });
    }

    const result = await getBirthdayDiscount(userId);
    if (result.success) {
        return res.json({ discount: result.discount });
    } else {
        return res.status(200).json({ discount: null, message: result.message });
    }
});

//apply birthday discount to a reservation
router.post('/applyBirthdayDiscount', async (req, res) => {
    const { userId, roomPrice } = req.body;
    if (!userId || !roomPrice) {
        return res.status(400).json({ error: 'UserId and RoomPrice are required.' });
    }

    const result = await applyBirthdayDiscount(userId, roomPrice);
    if (result.success) {
        return res.json({
            discountedPrice: result.discountedPrice,
            message: result.message
        });
    } else {
        return res.status(500).json({ error: result.error });
    }
});

router.post('/expireBirthdayDiscount', async (req, res) => {
    const { userId } = req.body;
  
    if (!userId) {
      return res.status(400).json({ error: 'UserId is required.' });
    }
  
    const result = await expireBirthdayDiscount(userId);
  
    if (result.success) {
      return res.json({ message: result.message });
    } else {
      return res.status(500).json({ error: result.error });
    }
});

export default router;