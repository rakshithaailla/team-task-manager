const express = require("express");
const Project = require("../models/Project");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// Create project - Admin only
router.post("/", authMiddleware, roleMiddleware("admin"), async (req, res) => {
    try {
        const { title, description, members } = req.body;

        if (!title) {
            if (title.length < 3) {
                return res.status(400).json({
                    message: "Project title must be at least 3 characters",
                });
            }
            return res.status(400).json({ message: "Project title is required" });
        }

        const project = await Project.create({
            title,
            description,
            members: members || [],
            createdBy: req.user.id,
        });

        res.status(201).json({
            message: "Project created successfully",
            project,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get projects
router.get("/", authMiddleware, async (req, res) => {
    try {
        const projects = await Project.find()
            .populate("createdBy", "name email role")
            .populate("members", "name email role");

        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete project - Admin only
router.delete("/:id", authMiddleware, roleMiddleware("admin"), async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id);

        res.json({ message: "Project deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;