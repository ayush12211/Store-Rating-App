const express = require('express');
const router = express.Router();
const { Store, Rating, User } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');

// GET /api/owner/dashboard
router.get('/dashboard', authenticate, authorize('store_owner'), async (req, res) => {
  try {
    const store = await Store.findOne({
      where: { ownerId: req.user.id },
      include: [
        {
          model: Rating,
          as: 'ratings',
          include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
        },
      ],
    });

    if (!store) return res.status(404).json({ message: 'No store found for this owner' });

    const ratings = store.ratings;
    const avgRating =
      ratings.length
        ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
        : null;

    res.json({
      store: {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        avgRating,
      },
      ratingUsers: ratings.map((r) => ({
        userId: r.userId,
        name: r.user ? r.user.name : 'Unknown',
        email: r.user ? r.user.email : '',
        rating: r.rating,
        submittedAt: r.updatedAt,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
