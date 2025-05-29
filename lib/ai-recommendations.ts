import { createOpenRouter } from "@openrouter/ai-sdk-provider"
import { generateText } from "ai"

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY!,
})

export interface UserProfile {
  name: string
  age: number
  education_field: string
  study_year: number
  skills: string[]
  skill_expertise: Record<string, string>
  interests: string
  career_goals: string
  experience_level: string
  availability_hours_per_week: number
}

export interface AIRecommendation {
  careerPath: string
  reasoning: string
  matchScore: number
  nextSteps: string[]
  timelineEstimate: string
  skillGaps: string[]
  strengthAreas: string[]
}

export async function getAIRecommendations(userProfile: UserProfile): Promise<AIRecommendation[]> {
  try {
    // Format skill expertise for the prompt
    const skillsWithExpertise = userProfile.skills
      .map((skill) => {
        const expertise = userProfile.skill_expertise[skill] || "beginner"
        return `${skill} (${expertise})`
      })
      .join(", ")

    const prompt = `
You are a career guidance AI expert. Based on the following user profile, provide 3 personalized tech career recommendations.

User Profile:
- Name: ${userProfile.name}
- Age: ${userProfile.age}
- Education: ${userProfile.education_field} (Year ${userProfile.study_year})
- Current Skills with Expertise: ${skillsWithExpertise}
- Interests: ${userProfile.interests}
- Career Goals: ${userProfile.career_goals}
- Experience Level: ${userProfile.experience_level}
- Available Learning Time: ${userProfile.availability_hours_per_week} hours/week

Please provide recommendations in this exact JSON format:
[
  {
    "careerPath": "Career Path Name",
    "reasoning": "Why this path fits the user based on their skill expertise levels (2-3 sentences)",
    "matchScore": 85,
    "nextSteps": ["Step 1", "Step 2", "Step 3"],
    "timelineEstimate": "6-12 months to job readiness",
    "skillGaps": ["Skill they need to learn", "Another skill gap"],
    "strengthAreas": ["Their strongest skills for this path"]
  }
]

Consider:
1. User's current skills AND their expertise levels (beginner, intermediate, advanced, expert)
2. Their interests and career goals
3. Their available time for learning
4. Their education background
5. Realistic timelines based on their skill expertise levels
6. What skills they're already strong in vs what they need to develop

Focus on these tech career paths: Frontend Development, Backend Development, Data Science, Cybersecurity, Mobile Development, DevOps, UI/UX Design, Product Management.
`

    const { text } = await generateText({
      model: openrouter.chat("meta-llama/llama-3.3-70b-instruct:free"),
      prompt,
      temperature: 0.7,
    })

    // Extract JSON from the response
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      throw new Error("No valid JSON found in AI response")
    }

    const recommendations: AIRecommendation[] = JSON.parse(jsonMatch[0])
    return recommendations
  } catch (error) {
    console.error("Error getting AI recommendations:", error)
    // Return fallback recommendations
    return [
      {
        careerPath: "Frontend Development",
        reasoning:
          "Based on your profile, frontend development offers a great entry point into tech with visual results and growing demand.",
        matchScore: 75,
        nextSteps: ["Learn HTML/CSS basics", "Master JavaScript fundamentals", "Build portfolio projects"],
        timelineEstimate: "6-9 months to job readiness",
        skillGaps: ["React", "TypeScript"],
        strengthAreas: ["HTML/CSS", "JavaScript"],
      },
      {
        careerPath: "Backend Development",
        reasoning:
          "Your analytical skills and interest in problem-solving make backend development a strong fit for building robust systems.",
        matchScore: 70,
        nextSteps: ["Choose a programming language", "Learn database fundamentals", "Build API projects"],
        timelineEstimate: "8-12 months to job readiness",
        skillGaps: ["Node.js", "Databases"],
        strengthAreas: ["Programming Logic", "Problem Solving"],
      },
      {
        careerPath: "Data Science",
        reasoning:
          "With the growing importance of data-driven decisions, this field offers excellent growth opportunities.",
        matchScore: 65,
        nextSteps: ["Learn Python and statistics", "Practice with real datasets", "Build data visualization projects"],
        timelineEstimate: "10-15 months to job readiness",
        skillGaps: ["Python", "Statistics", "Machine Learning"],
        strengthAreas: ["Analytical Thinking", "Mathematics"],
      },
    ]
  }
}
