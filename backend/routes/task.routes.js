
const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const { sendEmail } = require("../utils/sendMail");
// Create task
router.post("/", async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;
    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Title is required" });
    }
    const task = await Task.create({
      title: title.trim(),
      description,
      status: status || "To Do",
      priority: priority || "Medium",
      dueDate: dueDate ? new Date(dueDate) : undefined,
    });

await sendEmail(
  process.env.NOTIFY_EMAIL,
  "New Task Created",
  `
    <h2>New Task Created</h2>
    <p><strong>Title:</strong> ${task.title}</p>
    <p><strong>Description:</strong> ${task.description || "None"}</p>
    <p><strong>Status:</strong> ${task.status}</p>
    <p><strong>Priority:</strong> ${task.priority}</p>
    <p><strong>Due Date:</strong> ${
      task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "None"
    }</p>
  `
);


    res.status(201).json(task);
  } catch (err) {
    console.error("Create task error:", err);
    res.status(500).json({ error: "Failed to create task" });
  }
});

// Get tasks with filters + search
router.post("/filter", async (req, res) => {
  try {
    const filters = {};

    if (req.body.status) filters.status = req.body.status;
    if (req.body.priority) filters.priority = req.body.priority;

    if (req.body.q) {
      const regex = new RegExp(req.body.q, "i");
      filters.$or = [{ title: regex }, { description: regex }];
    }

    const tasks = await Task.find(filters).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error("Filter error:", err);
    res.status(500).json({ error: "Failed to filter tasks" });
  }
});


// Update task
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    if (updates.dueDate) {
      updates.dueDate = new Date(updates.dueDate);
    }
    const task = await Task.findByIdAndUpdate(id, updates, { new: true });
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
   
    res.json(task);
      await sendEmail(
      process.env.NOTIFY_EMAIL,
      "Task Updated",
      `
        <h2>Task Updated</h2>
        <p><strong>Title:</strong> ${task.title}</p>
        <p><strong>Status:</strong> ${task.status}</p>
        <p><strong>Priority:</strong> ${task.priority}</p>
        <p><strong>Due Date:</strong> ${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "None"}</p>
      `
    );
  } catch (err) {
    console.error("Update task error:", err);
    res.status(500).json({ error: "Failed to update task" });
  }
});

// Delete task
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    
    res.json({ message: "Task deleted" });
     await sendEmail(
      process.env.NOTIFY_EMAIL,
      "Task Deleted",
      `
        <h2>Task Deleted</h2>
        <p><strong>Title:</strong> ${task.title}</p>
        <p><strong>Description:</strong> ${task.description || "None"}</p>
        <p><strong>Status:</strong> ${task.status}</p>
        <p><strong>Priority:</strong> ${task.priority}</p>
      `
    );
  } catch (err) {
    console.error("Delete task error:", err);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

module.exports = router;
