const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize } = require('./models');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const storeRoutes = require('./routes/stores');
const ownerRoutes = require('./routes/owner');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/owner', ownerRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');
    await sequelize.sync({ alter: true });
    console.log('Models synced.');

    // Seed admin user if none exists
    const { User } = require('./models');
    const adminExists = await User.findOne({ where: { role: 'admin' } });
    if (!adminExists) {
      await User.create({
        name: 'System Administrator Account',
        email: 'admin@storerating.com',
        password: 'Admin@123',
        address: 'System Generated Admin Address Here',
        role: 'admin',
      });
      console.log('Default admin created: admin@storerating.com / Admin@123');
    }

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Startup error:', err);
    process.exit(1);
  }
};

startServer();
