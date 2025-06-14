const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateUser = require("../middlewares/auth")

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);
router.get('/user-count', userController.getUserCount);
router.post('/update-learning-parameters', authenticateUser, userController.updateSurveyParams);

module.exports = router;