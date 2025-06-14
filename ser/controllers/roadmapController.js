const mongoose = require("mongoose");
const roadmapModel = require("../models/roadmapModel");
const userModel = require("../models/userModel");
const generateRoadmap = require("../utils/roadmapGeneration");
const checkpointModel = require("../models/checkpointSchema");

const roadmapController = {
    getAllRoadmaps: async (req, res) => {
        try {
            const userId = req.userId;
            const roadmaps = await userModel.getUsersRoadmaps(userId);
            res.json(roadmaps);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    createRoadmap: async (req, res) => {
        try {
            const topic = req.body.topic;
            const user = await userModel.findById(req.userId);
            if(!user){
                res.status(404).json({ message: "User not found" });
            }

            console.log(user, user.toObject().clusterId);      
            const _res = await fetch(`http://localhost:8000/cluster/summary?id=${user.toObject().clusterId}`);
            const data = await _res.json();

            console.log(data);
            const roadmap = await generateRoadmap(topic, data.summary);
            
            const checkpoints = await Promise.all(roadmap.checkpoints.map(async (checkpoint, index) => {
                checkpoint.order = index + 1;
                const newCheckpoint = await checkpointModel.createCheckpoint(checkpoint);
                return newCheckpoint._id;
            }));

            const newRoadmap = new roadmapModel({
                userId: new mongoose.Types.ObjectId(req.userId),
                mainTopic: roadmap.mainTopic,
                description: roadmap.description,
                checkpoints: checkpoints
            });
            
            const savedRoadmap = await newRoadmap.save();
            await userModel.addRoadmap(req.userId, savedRoadmap._id);
            savedRoadmap.checkpoints = await checkpointModel.getCheckpoints(savedRoadmap.checkpoints);
            res.status(201).json(savedRoadmap);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: error.message });
        }
    },
    updateCheckpointStatus: async (req, res) => {
        try {
            const {roadmapId, checkpointId, status} = req.body;
            const roadmap = await roadmapModel.findById(roadmapId);
            const checkpoint = await checkpointModel.findById(checkpointId);

            if(!roadmap || !checkpoint){
                res.status(404).json({ message: "Roadmap or checkpoint not found" });
            }

            if(status === 'completed'){
                checkpoint.completedAt = new Date();
            }
            checkpoint.status = status;
            await checkpoint.save();

            roadmap.checkpoints = await checkpointModel.getCheckpoints(roadmap.checkpoints);

            const completedCheckpoints = roadmap.checkpoints.filter(checkpoint => checkpoint.status == 'completed');
            roadmap.totalProgress = completedCheckpoints.length / roadmap.checkpoints.length * 100;
            
            await roadmap.save();
            roadmap.checkpoints = await checkpointModel.getCheckpoints(roadmap.checkpoints);
            res.json(roadmap);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
};

module.exports = roadmapController;