require('dotenv').config();
// EMAIL_USER and EMAIL_PASSWORD are loaded from .env for mailer
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/userRoutes');
const tourRoutes = require('./routes/tourRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const destinationRoutes = require('./routes/destination');
const bookRoutes = require('./routes/bookRoutes')
const uploadRoutes = require('./routes/uploadRoutes');
const { getStats } = require('./controllers/statsController');
const { isAdmin } = require('./middleware/auth');
const blogsRoutes = require('./routes/blogRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/tour',tourRoutes)
app.use('/api/book',bookRoutes)
app.use('/api/upload', uploadRoutes);
app.get('/api/admin/stats', isAdmin, getStats);
app.use('/api/blogs', blogsRoutes);

// Health check route
app.get("/", (req, res) => {
  res.send("Server is running :)");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});