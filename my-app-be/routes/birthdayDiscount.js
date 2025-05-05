import express from 'express';
import { createOrUpdateBirthdayDiscount, getBirthdayDiscount, applyBirthdayDiscount, expireBirthdayDiscount } from '../models/birthdayDiscounts.js';

const router = express.Router();

//create or update birthday discount for a user
router.post('/createOrUpdateBirthdayDiscount', async (req, res) => {
    const { date } = req.body;
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Neautorizovaný prístup.' });
      }
    if (!date) {
        return res.status(400).json({ error: 'Dátum je povinný.' });
    }

    const result = await createOrUpdateBirthdayDiscount(req.session.userId, date);
    if (result.success) {
        return res.json({ message: result.message });
    } else {
        return res.status(500).json({ error: result.error });
    }
});

//get birthday discount for a user
router.get('/getBirthdayDiscount', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Neautorizovaný prístup.' });
    }

    const result = await getBirthdayDiscount(req.session.userId);
    if (result.success) {
        return res.json({ discount: result.discount });
    } else {
        return res.status(200).json({ discount: null, message: result.message });
    }
});

//apply birthday discount to a reservation
router.post('/applyBirthdayDiscount', async (req, res) => {
    const { roomPrice } = req.body;
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Neautorizovaný prístup.' });
      }
    if (!roomPrice) {
        return res.status(400).json({ error: 'Cena izby je povinná.' });
    }

    const result = await applyBirthdayDiscount(req.session.userId, roomPrice);
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
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Neautorizovaný prístup.' });
    }
  
    const result = await expireBirthdayDiscount(req.session.userId);
  
    if (result.success) {
      return res.json({ message: result.message });
    } else {
      return res.status(500).json({ error: result.error });
    }
});

export default router;