const express = require("express");

const Task = require("../models/Task");

const authMiddleware = require("../middleware/authMiddleware");

const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// Create Task - Admin Only
router.post(
    "/",
    authMiddleware,
    roleMiddleware("admin"),
    async (req, res) => {
        try {
            const {
                title,
                description,
                project,
                priority,
                dueDate,
                assignedTo,
            } = req.body;

            if (title.length < 3) {
                return res.status(400).json({
                    message: "Task title must be at least 3 characters",
                });
            }

            if (!project) {
                return res.status(400).json({
                    message: "Project selection is required",
                });
            }

            const task = await Task.create({
                title,
                description,
                project,
                priority,
                dueDate,
                assignedTo,
                createdBy: req.user.id,
            });
            res.status(201).json({
                message: "Task created successfully",
                task,
            });
        } catch (error) {
            res.status(500).json({
                message: error.message,
            });
        }
    }
);

// Get All Tasks
router.get("/", authMiddleware, async (req, res) => {
    try {
        const tasks = await Task.find()
            .populate("project", "title")
            .populate("assignedTo", "name email role")
            .populate("createdBy", "name");

        res.json(tasks);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});

// Update Task Status
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { status } = req.body;

        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found",
            });
        }

        task.status = status || task.status;

        await task.save();

        res.json({
            message: "Task updated successfully",
            task,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});

// Delete Task - Admin Only
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("admin"),
    async (req, res) => {
        try {
            await Task.findByIdAndDelete(req.params.id);

            res.json({
                message: "Task deleted successfully",
            });
        } catch (error) {
            res.status(500).json({
                message: error.message,
            });
        }
    }
);

module.exports = router;