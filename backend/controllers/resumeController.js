import { extractATSAnalysis } from "../services/deepseekService.js";

/*
  CONTROLLER: analyzeResume

  This function:
  1. Receives resume text from frontend
  2. Sends it to AI service (DeepSeek)
  3. Returns ATS score + feedback
*/
export const analyzeResume = async (req, res) => {
  try {
    // Step 1: Get resume text from request body
    const { resumeText, jobDescription } = req.body;

    // Safety check (very important)
    if (!resumeText) {
      return res.status(400).json({
        error: "Resume text is required",
      });
    }

    /*
      Step 2: Send data to AI service
      This is where DeepSeek is used
    */
    const result = await extractATSAnalysis(resumeText, jobDescription);

    // Step 3: Send result back to frontend
    return res.json(result);

  } catch (error) {
    console.error("Error analyzing resume:", error);

    return res.status(500).json({
      error: "Something went wrong while analyzing resume",
    });
  }
};