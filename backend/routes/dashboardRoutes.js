const express = require("express");

const Task = require("../models/Task");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Dashboard Stats
router.get("/", authMiddleware, async (req, res) => {
    try {
        const totalTasks = await Task.countDocuments();

        const completedTasks = await Task.countDocuments({
            status: "done",
        });

        const pendingTasks = await Task.countDocuments({
            status: "todo",
        });

        const inProgressTasks = await Task.countDocuments({
            status: "in-progress",
        });

        const overdueTasks = await Task.countDocuments({
            dueDate: { $lt: new Date() },
            status: { $ne: "done" },
        });

        res.json({
            totalTasks,
            completedTasks,
            pendingTasks,
            inProgressTasks,
            overdueTasks,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});

module.exports = router;