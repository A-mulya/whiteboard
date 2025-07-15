const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authroute');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ✅ Add this root route so Render doesn't show "Cannot GET /"
app.get('/', (req, res) => {
  res.send('Auth server is running');
});

app.use('/api/auth', authRoutes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected');
  app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
});
