require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const limiter = require("./middleware/rateLimiter");

const app = express();

connectDB();

app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://todobyaswin.netlify.app"
    ],
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true
}));
app.use(express.json());

app.use(limiter);

app.use("/api/tasks", require("./routes/taskRoutes"));

app.get("/", (req, res) => {
    res.send("Task Manager API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
