const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');
const quizRoutes = require('./routes/quizRoutes');
const connectDB = require('./config/connectDB');
const roadmapRoutes = require('./routes/roadmapRoutes');
const eventRoutes = require('./routes/eventRoutes');
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/roadmaps', roadmapRoutes);
app.use('/api/events', eventRoutes);

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});



