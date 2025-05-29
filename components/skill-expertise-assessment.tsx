"use client"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { ChevronRight, Star, Award, Target } from "lucide-react"
import { supabase, type UserInformation } from "@/lib/supabase"

interface SkillExpertiseAssessmentProps {
  userInfo: UserInformation
  onComplete: (expertise: Record<string, string>) => void
}

const expertiseLevels = [
  {
    value: "beginner",
    label: "Beginner",
    description: "Just starting out, basic understanding",
    color: "bg-green-100 text-green-800",
  },
  {
    value: "intermediate",
    label: "Intermediate",
    description: "Some experience, can work independently",
    color: "bg-yellow-100 text-yellow-800",
  },
  {
    value: "advanced",
    label: "Advanced",
    description: "Strong expertise, can mentor others",
    color: "bg-orange-100 text-orange-800",
  },
  {
    value: "expert",
    label: "Expert",
    description: "Deep knowledge, industry recognized",
    color: "bg-red-100 text-red-800",
  },
]

export function SkillExpertiseAssessment({ userInfo, onComplete }: SkillExpertiseAssessmentProps) {
  const [currentSkillIndex, setCurrentSkillIndex] = useState(0)
  const [skillExpertise, setSkillExpertise] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const currentSkill = userInfo.skills[currentSkillIndex]
  const progress = ((currentSkillIndex + 1) / userInfo.skills.length) * 100

  const handleExpertiseSelect = (expertise: string) => {
    const newExpertise = { ...skillExpertise, [currentSkill]: expertise }
    setSkillExpertise(newExpertise)

    if (currentSkillIndex < userInfo.skills.length - 1) {
      setCurrentSkillIndex(currentSkillIndex + 1)
    } else {
      handleComplete(newExpertise)
    }
  }

  const handleComplete = async (expertise: Record<string, string>) => {
    setLoading(true)
    try {
      // Save skill expertise to database
      const { error } = await supabase
        .from("user_information")
        .update({ skill_expertise: expertise })
        .eq("id", userInfo.id)

      if (error) throw error

      onComplete(expertise)
    } catch (error) {
      console.error("Error saving skill expertise:", error)
    } finally {
      setLoading(false)
    }
  }

  const goBack = () => {
    if (currentSkillIndex > 0) {
      setCurrentSkillIndex(currentSkillIndex - 1)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Saving your expertise assessment...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Assess Your Skill Expertise</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Help us understand your proficiency level in each skill for better recommendations
          </p>
        </div>

        {/* Progress Bar */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {currentSkillIndex + 1} of {userInfo.skills.length}
              </span>
            </div>
            <Progress value={progress} className="w-full" />
          </CardContent>
        </Card>

        {/* Current Skill Assessment */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-xl">Rate Your Expertise</CardTitle>
            </div>
            <CardDescription>How would you rate your current skill level in:</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <Badge variant="outline" className="text-lg px-4 py-2">
                {currentSkill}
              </Badge>
            </div>

            <RadioGroup
              value={skillExpertise[currentSkill] || ""}
              onValueChange={handleExpertiseSelect}
              className="space-y-4"
            >
              {expertiseLevels.map((level) => (
                <div
                  key={level.value}
                  className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                >
                  <RadioGroupItem value={level.value} id={level.value} />
                  <Label htmlFor={level.value} className="flex-1 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{level.label}</span>
                          <Badge className={level.color} variant="secondary">
                            {level.value === "beginner" && <Star className="h-3 w-3" />}
                            {level.value === "intermediate" && (
                              <>
                                <Star className="h-3 w-3" />
                                <Star className="h-3 w-3" />
                              </>
                            )}
                            {level.value === "advanced" && (
                              <>
                                <Star className="h-3 w-3" />
                                <Star className="h-3 w-3" />
                                <Star className="h-3 w-3" />
                              </>
                            )}
                            {level.value === "expert" && <Award className="h-3 w-3" />}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{level.description}</p>
                      </div>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {/* Navigation */}
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={goBack} disabled={currentSkillIndex === 0}>
                ← Previous
              </Button>
              <Button
                onClick={() => handleExpertiseSelect(skillExpertise[currentSkill] || "beginner")}
                disabled={!skillExpertise[currentSkill]}
              >
                {currentSkillIndex === userInfo.skills.length - 1 ? "Complete Assessment" : "Next"}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Skills Summary */}
        {Object.keys(skillExpertise).length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Your Assessed Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {Object.entries(skillExpertise).map(([skill, expertise]) => (
                  <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                    {skill}
                    <span className="text-xs">({expertise})</span>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
