import { Router, type IRouter } from "express";
import { ai } from "@workspace/integrations-gemini-ai";

const router: IRouter = Router();

router.post("/recommend", async (req, res) => {
  try {
    const userProfile = req.body;

    const prompt = `You are a skill recommendation expert. Based on this user profile, 
return ONLY a valid JSON object (no markdown, no backticks, no code fences) with this exact structure:
{
  "skills": [{ "name": "", "emoji": "", "why_for_you": "", "difficulty": "", "time_to_learn": "", "resources": [{"title": "", "type": ""}] }],
  "projects": [{ "title": "", "description": "", "why_for_you": "", "skills_built": [], "timeline": "", "difficulty": "" }],
  "roadmap": [{ "phase": "", "duration": "", "focus": "", "milestones": [] }],
  "summary": ""
}

Rules:
- Return 3-6 skills
- Return 3-4 projects
- Return exactly 3 roadmap phases
- Make results deeply personalized to the user profile
- Do NOT include any markdown, code blocks, or backticks in your response
- Start your response directly with {

User Profile: ${JSON.stringify(userProfile)}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: { maxOutputTokens: 8192 },
    });

    const text = response.text ?? "";
    const cleaned = text.replace(/```json|```/g, "").trim();

    let json;
    try {
      json = JSON.parse(cleaned);
    } catch {
      req.log.error({ raw: text }, "Failed to parse Gemini response as JSON");
      res.status(500).json({ error: "AI returned invalid response" });
      return;
    }

    res.json(json);
  } catch (err) {
    req.log.error({ err }, "Recommendation generation failed");
    res.status(500).json({ error: "AI failed to generate recommendations" });
  }
});

export default router;
