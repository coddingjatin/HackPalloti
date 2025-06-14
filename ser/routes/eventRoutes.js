const express = require('express');

const router = express.Router();

const eventController = require('../controllers/eventController');
const authenticateUser = require('../middlewares/auth');

router.get('/', authenticateUser, eventController.getAllEvents);
router.get('/today', authenticateUser, eventController.getEventsToday);
router.post('/', authenticateUser, eventController.createEvent);
router.delete('/:id', authenticateUser, eventController.deleteEvent);
router.put('/:id', authenticateUser, eventController.updateEvent);

module.exports = router;