export const analyzeResumeWithGemini = async (resumeText, jobDescription) => {
    try {
      const prompt = `
  You are an ATS expert.
  
  Return ONLY valid JSON (no markdown, no explanations):
  
  {
    "ats_score": number,
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
  
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  { text: prompt }
                ]
              }
            ]
          })
        }
      );
  
      const data = await response.json();
  
      // -----------------------------
      // DEBUG (keep for now)
      // -----------------------------
      console.log("GEMINI RAW RESPONSE:", JSON.stringify(data, null, 2));
  
      // -----------------------------
      // ERROR HANDLING (IMPORTANT)
      // -----------------------------
      if (data.error) {
        throw new Error(data.error.message || "Gemini API error");
      }
  
      if (!data.candidates || !data.candidates.length) {
        throw new Error("No candidates returned from Gemini");
      }
  
      const parts = data.candidates?.[0]?.content?.parts;
  
      if (!parts || !parts.length) {
        throw new Error("Gemini response missing content parts");
      }
  
      const text = parts[0].text;
  
      if (!text) {
        throw new Error("Gemini returned empty text");
      }
  
      // -----------------------------
      // SAFE JSON PARSING
      // -----------------------------
      let json;
  
      try {
        json = JSON.parse(text);
      } catch (err) {
        // fallback: extract JSON from text
        const match = text.match(/\{[\s\S]*\}/);
  
        if (!match) {
          throw new Error("Failed to extract JSON from Gemini response");
        }
  
        json = JSON.parse(match[0]);
      }
  
      return json;
  
    } catch (err) {
      console.error("Gemini error:", err.message);
  
      return {
        ats_score: 0,
        missing_keywords: [],
        strengths: [],
        weaknesses: [],
        summary: "Error analyzing resume. Check API key or response format."
      };
    }
  };