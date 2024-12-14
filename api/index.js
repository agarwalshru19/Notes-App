import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./db.js";
import authRoutes from "./routes/auth.js";
import noteRoutes from "./routes/notes.js";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err.stack);
  } else {
    console.log("Connected to the database");
  }
});

// Middleware
app.use(cors({ origin: "https://notes-app-frontend-wmg5.onrender.com", credentials: true }));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/note", noteRoutes);

// Example route to test the connection
app.get("/", (req, res) => {
  res.send("Hello, world!");
});

// Start the server
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
