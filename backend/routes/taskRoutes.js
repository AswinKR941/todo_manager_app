const express = require("express");
const Task = require("../models/Task");
const router = express.Router();

/* ========================
   CREATE TASK
======================== */

router.post("/", async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || title.length < 3) {
      return res.status(400).json({
        message: "Title must be minimum 3 characters"
      });
    }

    const task = await Task.create({
      title,
      description
    });

    res.status(201).json(task);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* ========================
   UPDATE STATUS
======================== */

router.patch("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const allowed = {
      todo: ["in_progress", "done"],
      in_progress: ["done"],
      done: []
    };

    if (!allowed[task.status].includes(status)) {
      return res.status(400).json({
        message: "Invalid status transition"
      });
    }

    task.status = status;

    if (status === "done") {
      task.completedAt = new Date();
    }

    await task.save();

    res.json(task);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* ========================
   LIST TASKS
======================== */

router.get("/", async (req, res) => {
  try {
    const { status, sort } = req.query;

    let query = {};

    if (status) {
      query.status = status;
    }

    let tasks = Task.find(query);

    if (sort === "asc") {
      tasks = tasks.sort({ createdAt: 1 });
    }

    if (sort === "desc") {
      tasks = tasks.sort({ createdAt: -1 });
    }

    const result = await tasks;

    res.json(result);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ========================
   DELETE TASK
======================== */

router.delete("/:id", async (req, res) => {
  try {

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    await task.deleteOne();

    res.json({
      message: "Task deleted successfully"
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



/* ========================
   METRICS
======================== */

router.get("/metrics/stats", async (req, res) => {
  try {
    const total = await Task.countDocuments();

    const todo = await Task.countDocuments({ status: "todo" });
    const progress = await Task.countDocuments({ status: "in_progress" });
    const done = await Task.countDocuments({ status: "done" });

    const completedTasks = await Task.find({
      status: "done",
      completedAt: { $exists: true }
    });

    let avgTime = 0;

    if (completedTasks.length > 0) {
      let totalTime = 0;

      completedTasks.forEach(t => {
        totalTime += t.completedAt - t.createdAt;
      });

      avgTime = totalTime / completedTasks.length / 1000;
    }

    res.json({
      totalTasks: total,
      statusCount: {
        todo,
        in_progress: progress,
        done
      },
      averageCompletionTime_seconds: avgTime
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
