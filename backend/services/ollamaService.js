import fetch from "node-fetch";

/*
  This service connects your backend to Ollama local AI.
  Ollama runs on: http://localhost:11434
*/
export const analyzeResumeWithOllama = async (resumeText, jobDescription) => {
  try {
    // We build a strong prompt (this is where "AI quality" comes from)
    const prompt = `
You are an ATS analyzer.

IMPORTANT RULES:
- Return ONLY valid JSON
- No text before or after
- No explanations
- No markdown

Return format:
{
  "ats_score": 0,
  "missing_keywords": [],
  "strengths": [],
  "weaknesses": [],
  "summary": ""
}

Resume:
${resumeText}

Job Description:
${jobDescription}
`;

    // Call local Ollama API
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3", // or deepseek-r1
        prompt: prompt,
        stream: false
      }),
    });

    const data = await response.json();

    /*
      Ollama returns:
      { response: "text output from AI" }
    */
    const aiText = data.response;

    // Convert AI text → JSON
    const parsed = JSON.parse(aiText);

    return parsed;

  } catch (error) {
    console.error("Ollama error:", error);

    return {
      ats_score: 0,
      missing_keywords: [],
      strengths: [],
      weaknesses: ["AI failed"],
      summary: "Could not analyze resume"
    };
  }
};