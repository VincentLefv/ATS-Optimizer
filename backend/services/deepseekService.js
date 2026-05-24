import dotenv from "dotenv";

dotenv.config();

/*
  FUNCTION: extractATSAnalysis

  This simulates / handles AI analysis using DeepSeek.

  INPUT:
  - resumeText
  - jobDescription

  OUTPUT:
  - ATS score
  - missing keywords
  - strengths / weaknesses
*/
export const extractATSAnalysis = async (resumeText, jobDescription) => {
  try {
    /*
      STEP 1: Build AI prompt

      This is where your "AI intelligence" comes from.
    */
    const prompt = `
You are an ATS (Applicant Tracking System) expert.

Analyze the resume below against the job description.

Return ONLY valid JSON with this format:

{
  "ats_score": number (0-100),
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

    /*
      STEP 2: Call DeepSeek API
      (This is OpenAI-style format)
    */
    const response = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.3,
      }),
    });

    const data = await response.json();

    /*
      STEP 3: Extract AI response text
    */
    const aiText = data.choices[0].message.content;

    /*
      STEP 4: Convert AI string → JSON
      (IMPORTANT: AI sometimes returns text, so we parse it)
    */
    const parsed = JSON.parse(aiText);

    return parsed;

  } catch (error) {
    console.error("DeepSeek Error:", error);

    /*
      Fallback response if AI fails
      (VERY IMPORTANT for debugging)
    */
    return {
      ats_score: 0,
      missing_keywords: [],
      strengths: [],
      weaknesses: ["AI service failed"],
      summary: "Could not analyze resume due to API error",
    };
  }
};