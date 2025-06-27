const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/connectDB');

const userRoutes = require('./routes/userRoutes');
const quizRoutes = require('./routes/quizRoutes');
const roadmapRoutes = require('./routes/roadmapRoutes');
const eventRoutes = require('./routes/eventRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes'); // ✅ NEW

dotenv.config(); // Load .env

const app = express();

app.use(cors());
app.use(express.json());

// All Routes
app.use('/api/users', userRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/roadmaps', roadmapRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/generate', chatbotRoutes); // ✅ Route for Gemini

// Connect to DB and start server
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});