const { generateQuiz, submitQuiz, getQuizResults, getUserQuizzes , generatePictoFlow } = require('../controllers/quizController');
const authenticateUser = require('../middlewares/auth');
const router = require('express').Router();

router.post('/generate', generateQuiz);
router.post('/submit', authenticateUser, submitQuiz);
router.get('/quiz-results/:userId', authenticateUser, getQuizResults);
router.get('/user-quiz/:userId', authenticateUser, getUserQuizzes);
router.post('/pictoflow',generatePictoFlow)

module.exports = router;