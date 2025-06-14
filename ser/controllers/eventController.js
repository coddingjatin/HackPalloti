const eventsModel = require("../models/eventsModel");

const eventController = {
    getAllEvents: async (req, res) => {
        try {
        const id = req.userId;
        const events = await eventsModel.find({ userId: id });
        res.json(events);
        } catch (error) {
        res.status(500).json({ message: error.message });
        }
    },
    getEventsToday: async (req, res) => {
        try {
        const id = req.userId;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        
        const events = await eventsModel.find({
            start: { $gte: today, $lt: tomorrow },
        });

        res.json(events);
        } catch (error) {
        res.status(500).json({ message: error.message });
        }
    },
    createEvent: async (req, res) => {
        try {
        const newEvent = new eventsModel({
            ...req.body,
            userId: req.userId,
        });
        await newEvent.save();
        res.json(newEvent);
        } catch (error) {
        res.status(500).json({ message: error.message });
        }
    },
    deleteEvent: async (req, res) => {
        try {
        const id = req.params.id;
        await eventsModel.findByIdAndDelete(id);
        res.json({ message: "Event deleted" });
        } catch (error) {
        res.status(500).json({ message: error.message });
        }
    },
    updateEvent: async (req, res) => {
        try {
        const id = req.params.id;
        const updatedEvent = await eventsModel.findByIdAndUpdate(id, req.body, {
            new: true,
        });

        res.json(updatedEvent);
        } catch (error) {
        res.status(500).json({ message: error.message });
        }
    }
};

module.exports = eventController;