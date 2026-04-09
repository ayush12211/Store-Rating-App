const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { Op } = require('sequelize');
const { Store, Rating, User } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');

// GET /api/stores - all users
router.get('/', authenticate, async (req, res) => {
  try {
    const { name, address, sortBy = 'name', sortOrder = 'ASC' } = req.query;
    const where = {};
    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (address) where.address = { [Op.iLike]: `%${address}%` };

    const validSortFields = ['name', 'address', 'email', 'createdAt'];
    const order = [[validSortFields.includes(sortBy) ? sortBy : 'name', sortOrder === 'DESC' ? 'DESC' : 'ASC']];

    const stores = await Store.findAll({
      where,
      order,
      include: [{ model: Rating, as: 'ratings', attributes: ['rating', 'userId'] }],
    });

    const result = stores.map((s) => {
      const data = s.toJSON();
      const avgRating = data.ratings.length
        ? (data.ratings.reduce((sum, r) => sum + r.rating, 0) / data.ratings.length).toFixed(1)
        : null;
      const userRating = data.ratings.find((r) => r.userId === req.user.id);
      return {
        id: data.id,
        name: data.name,
        email: data.email,
        address: data.address,
        avgRating,
        userRating: userRating ? userRating.rating : null,
      };
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/stores/:id/ratings
router.post('/:id/ratings', authenticate, authorize('user'), [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const storeId = req.params.id;
    const store = await Store.findByPk(storeId);
    if (!store) return res.status(404).json({ message: 'Store not found' });

    const existing = await Rating.findOne({ where: { userId: req.user.id, storeId } });
    if (existing) return res.status(400).json({ message: 'Rating already submitted. Use PUT to update.' });

    const rating = await Rating.create({ userId: req.user.id, storeId, rating: req.body.rating });
    res.status(201).json(rating);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/stores/:id/ratings
router.put('/:id/ratings', authenticate, authorize('user'), [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const storeId = req.params.id;
    const existing = await Rating.findOne({ where: { userId: req.user.id, storeId } });
    if (!existing) return res.status(404).json({ message: 'No rating found. Use POST to submit.' });

    existing.rating = req.body.rating;
    await existing.save();
    res.json(existing);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
