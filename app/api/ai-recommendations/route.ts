import { type NextRequest, NextResponse } from "next/server"
import { getAIRecommendations } from "@/lib/ai-recommendations"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { userProfile, userId } = await request.json()

    // Check if recommendations already exist
    const { data: existingRecs } = await supabase
      .from("ai_recommendations")
      .select("recommendations")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    // If recommendations exist and are recent (less than 7 days), return them
    if (existingRecs) {
      return NextResponse.json({ recommendations: existingRecs.recommendations, fromCache: true })
    }

    // Generate new recommendations
    const recommendations = await getAIRecommendations(userProfile)

    // Store recommendations in database
    const { error: insertError } = await supabase.from("ai_recommendations").insert({
      user_id: userId,
      recommendations: recommendations,
    })

    if (insertError) {
      console.error("Error storing recommendations:", insertError)
    }

    return NextResponse.json({ recommendations, fromCache: false })
  } catch (error) {
    console.error("Error in AI recommendations API:", error)
    return NextResponse.json({ error: "Failed to get AI recommendations" }, { status: 500 })
  }
}
