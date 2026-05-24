import { analyzeResumeWithOllama } from "../services/ollamaService.js";

/*
  Controller = receives request from frontend
*/
export const analyzeResume = async (req, res) => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText || !jobDescription) {
      return res.status(400).json({
        error: "Missing resumeText or jobDescription"
      });
    }

    // Send to AI (Ollama)
    const result = await analyzeResumeWithOllama(
      resumeText,
      jobDescription
    );

    return res.json(result);

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Server error during analysis"
    });
  }
};