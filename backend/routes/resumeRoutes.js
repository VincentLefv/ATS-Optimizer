import express from "express";
import { analyzeResume } from "../controllers/resumeController.js";

const router = express.Router();

/*
  ROUTE: POST /api/analyze-resume

  Purpose:
  - Receive resume text from frontend
  - Send it to controller for AI analysis
*/
router.post("/analyze-resume", analyzeResume);

export default router;