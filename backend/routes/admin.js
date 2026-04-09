const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { Op } = require('sequelize');
const { User, Store, Rating, sequelize } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');

const adminOnly = [authenticate, authorize('admin')];

// GET /api/admin/dashboard
router.get('/dashboard', ...adminOnly, async (req, res) => {
  try {
    const [totalUsers, totalStores, totalRatings] = await Promise.all([
      User.count({ where: { role: { [Op.ne]: 'admin' } } }),
      Store.count(),
      Rating.count(),
    ]);
    res.json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/users
router.get('/users', ...adminOnly, async (req, res) => {
  try {
    const { name, email, address, role, sortBy = 'name', sortOrder = 'ASC' } = req.query;
    const where = {};
    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (email) where.email = { [Op.iLike]: `%${email}%` };
    if (address) where.address = { [Op.iLike]: `%${address}%` };
    if (role) where.role = role;

    const validSortFields = ['name', 'email', 'address', 'role', 'createdAt'];
    const order = [[validSortFields.includes(sortBy) ? sortBy : 'name', sortOrder === 'DESC' ? 'DESC' : 'ASC']];

    const users = await User.findAll({
      where,
      attributes: { exclude: ['password'] },
      order,
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/users/:id
router.get('/users/:id', ...adminOnly, async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Store, as: 'store', include: [{ model: Rating, as: 'ratings' }] }],
    });
    if (!user) return res.status(404).json({ message: 'User not found' });

    let avgRating = null;
    if (user.role === 'store_owner' && user.store) {
      const ratings = user.store.ratings;
      if (ratings.length > 0) {
        avgRating = (ratings.reduce((s, r) => s + r.rating, 0) / ratings.length).toFixed(1);
      }
    }
    res.json({ ...user.toJSON(), avgRating });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/admin/users
router.post('/users', ...adminOnly, [
  body('name').isLength({ min: 20, max: 60 }).withMessage('Name must be 20-60 characters'),
  body('email').isEmail().withMessage('Invalid email'),
  body('address').isLength({ max: 400 }).withMessage('Address max 400 characters'),
  body('password')
    .isLength({ min: 8, max: 16 })
    .matches(/[A-Z]/)
    .matches(/[^A-Za-z0-9]/),
  body('role').isIn(['admin', 'user', 'store_owner']).withMessage('Invalid role'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { name, email, address, password, role } = req.body;
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    const user = await User.create({ name, email, address, password, role });
    res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/stores
router.get('/stores', ...adminOnly, async (req, res) => {
  try {
    const { name, email, address, sortBy = 'name', sortOrder = 'ASC' } = req.query;
    const where = {};
    if (name) where.name = { [Op.iLike]: `%${name}%` };
    if (email) where.email = { [Op.iLike]: `%${email}%` };
    if (address) where.address = { [Op.iLike]: `%${address}%` };

    const validSortFields = ['name', 'email', 'address', 'createdAt'];
    const order = [[validSortFields.includes(sortBy) ? sortBy : 'name', sortOrder === 'DESC' ? 'DESC' : 'ASC']];

    const stores = await Store.findAll({
      where,
      order,
      include: [{ model: Rating, as: 'ratings', attributes: ['rating'] }],
    });

    const result = stores.map((s) => {
      const data = s.toJSON();
      const avgRating = data.ratings.length
        ? (data.ratings.reduce((sum, r) => sum + r.rating, 0) / data.ratings.length).toFixed(1)
        : null;
      return { ...data, avgRating };
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/admin/stores
router.post('/stores', ...adminOnly, [
  body('name').isLength({ min: 20, max: 60 }).withMessage('Name must be 20-60 characters'),
  body('email').isEmail().withMessage('Invalid email'),
  body('address').isLength({ max: 400 }).withMessage('Address max 400 characters'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { name, email, address, ownerId } = req.body;
    const store = await Store.create({ name, email, address, ownerId: ownerId || null });
    res.status(201).json(store);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
