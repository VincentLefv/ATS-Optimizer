import fetch from "node-fetch";

export const analyzeResumeWithOllama = async (resumeText, jobDescription) => {
  try {

    // -----------------------------
    // 1. SPEED OPTIMIZATION (TRIM)
    // -----------------------------
    const cleanText = (text, limit = 4000) =>
      text
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, limit);

    const trimmedResume = cleanText(resumeText, 4000);
    const trimmedJD = cleanText(jobDescription, 3000);

    // -----------------------------
    // 2. PROMPT
    // -----------------------------
    const prompt = `
You are a professional career coach and ATS resume reviewer.

IMPORTANT RULES:
- Return ONLY valid JSON
- No markdown
- No explanations outside JSON
- Be practical and realistic
- Focus on job relevance

Return format:
{
  "strengths": [],
  "weaknesses": [],
  "what_to_add": [],
  "explanation": ""
}

TASK:
Compare the resume with the job description and evaluate fit.

GUIDELINES:
- strengths = what matches the job requirements
- weaknesses = missing important skills for this job
- what_to_add = skills, tools, or experience the candidate should add to improve chances
- explanation = short human summary (3–5 lines max)

Resume:
${trimmedResume}

Job Description:
${trimmedJD}
`;

    // -----------------------------
    // 3. CALL OLLAMA
    // -----------------------------
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3",
        prompt: prompt,
        stream: false,
        format: "json",
        options: {
          temperature: 0,
          top_p: 0.9,
          top_k: 40,
          max_tokens: 1000,
          frequency_penalty: 0,
          presence_penalty: 0,
          stop: ["\n\n"],
          stream: false,
          format: "json"
  }
}),
    });

    const data = await response.json();

    console.log("RAW OLLAMA RESPONSE:", data);

    // -----------------------------
    // 4. SAFETY CHECK (FIX YOUR ERROR)
    // -----------------------------
    if (!data) {
      throw new Error("Empty response from Ollama");
    }

    const aiText = data.response || data.output || data.message;

    if (!aiText) {
      throw new Error("Ollama did not return response text");
    }

    // -----------------------------
    // 5. PARSE JSON SAFELY
    // -----------------------------
    let parsed;

    try {
      parsed = JSON.parse(aiText);
    } catch (err) {
      console.warn("Raw AI text:", aiText);

      // fallback extraction
      const match = aiText.match(/\{[\s\S]*\}/);

      if (!match) {
        throw new Error("Could not extract JSON from AI output");
      }

      parsed = JSON.parse(match[0]);
    }

    return parsed;

  } catch (error) {
    console.error("Ollama error:", error.message);

    return {
      ats_score: 0,
      missing_keywords: [],
      strengths: [],
      weaknesses: ["AI failed"],
      summary: "Could not analyze resume"
    };
  }
};