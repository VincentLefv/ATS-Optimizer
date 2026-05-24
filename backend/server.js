import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Import routes
import resumeRoutes from "./routes/resumeRoutes.js";

// Load environment variables from .env file
dotenv.config();

// Create Express app
const app = express();

/*
  MIDDLEWARE SECTION
  -------------------
  These run BEFORE your routes
*/

// Allow frontend to talk to backend
app.use(cors());

// Allow JSON requests (frontend → backend data)
app.use(express.json());

// ROUTES
// Anything starting with /api goes to resumeRoutes
app.use("/api", resumeRoutes);

/*
  TEST ROUTE
  Used to check if backend is running
*/
app.get("/", (req, res) => {
  res.send("ATS Resume Optimizer Backend is running 🚀");
});

/*
  START SERVER
*/
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});