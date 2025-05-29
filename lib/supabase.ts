import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type UserInformation = {
  id: string
  name: string
  email: string
  age: number
  gender: string
  education_field: string
  study_year: number
  skills: string[]
  interests?: string
  career_goals?: string
  experience_level?: string
  availability_hours_per_week?: number
  skill_expertise?: Record<string, string>
  created_at: string
  updated_at: string
}

export async function getStoredRecommendations(userId: string) {
  try {
    const { data, error } = await supabase
      .from("ai_recommendations")
      .select("recommendations")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (error) return null
    return data.recommendations
  } catch (error) {
    console.error("Error getting stored recommendations:", error)
    return null
  }
}

export async function storeRecommendations(userId: string, recommendations: any[]) {
  try {
    const { error } = await supabase.from("ai_recommendations").insert({
      user_id: userId,
      recommendations: recommendations,
    })

    if (error) throw error
  } catch (error) {
    console.error("Error storing recommendations:", error)
  }
}
