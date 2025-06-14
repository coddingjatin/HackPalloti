const express = require('express');
const router = express.Router();
const roadmapController = require('../controllers/roadmapController');
const authenticateUser = require('../middlewares/auth');

router.get('/', authenticateUser, roadmapController.getAllRoadmaps);
router.post('/create', authenticateUser, roadmapController.createRoadmap);
router.post('/update-checkpoint-status', authenticateUser, roadmapController.updateCheckpointStatus);

module.exports = router;