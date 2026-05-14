const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },

        description: {
            type: String,
        },

        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
        },

        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        status: {
            type: String,
            enum: ["todo", "in-progress", "done"],
            default: "todo",
        },

        priority: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium",
        },
        attachment: {
            type: String,
            default: "",
        },

        dueDate: {
            type: Date,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Task", taskSchema);