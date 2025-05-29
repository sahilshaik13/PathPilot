"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { X, Plus, Target, Lightbulb, Clock } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface ProfileSetupProps {
  onComplete: () => void
}

const predefinedSkills = [
  "HTML/CSS",
  "JavaScript",
  "Python",
  "Java",
  "C++",
  "React",
  "Node.js",
  "SQL",
  "Git",
  "Linux",
  "Photoshop",
  "Excel",
  "PowerPoint",
  "Communication",
  "Leadership",
  "Problem Solving",
  "Data Analysis",
  "Machine Learning",
  "Cybersecurity",
  "Mobile Development",
  "Cloud Computing",
  "DevOps",
]

const interestAreas = [
  "Web Development",
  "Mobile App Development",
  "Data Science & Analytics",
  "Artificial Intelligence",
  "Cybersecurity",
  "Cloud Computing",
  "Game Development",
  "UI/UX Design",
  "DevOps & Infrastructure",
  "Blockchain",
  "IoT (Internet of Things)",
  "Machine Learning",
]

export function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [customSkill, setCustomSkill] = useState("")
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [formData, setFormData] = useState({
    careerGoals: "",
    experienceLevel: "",
    timeCommitment: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const addSkill = (skill: string) => {
    if (skill && !selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill])
    }
    setCustomSkill("")
  }

  const removeSkill = (skillToRemove: string) => {
    setSelectedSkills(selectedSkills.filter((skill) => skill !== skillToRemove))
  }

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest))
    } else {
      setSelectedInterests([...selectedInterests, interest])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("No authenticated user")

      const { error: updateError } = await supabase
        .from("user_information")
        .update({
          skills: selectedSkills,
          interests: selectedInterests.join(", "),
          career_goals: formData.careerGoals,
          experience_level: formData.experienceLevel,
          availability_hours_per_week: formData.timeCommitment ? Number.parseInt(formData.timeCommitment) : null,
        })
        .eq("id", user.id)

      if (updateError) throw updateError

      onComplete()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Complete Your Profile</h1>
          <p className="text-lg text-gray-600">
            Help us personalize your career recommendations by sharing more about yourself
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Tell us about your goals and interests
            </CardTitle>
            <CardDescription>This information will help us provide better career guidance</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

              {/* Skills Section */}
              <div>
                <Label className="text-base font-semibold flex items-center gap-2 mb-3">
                  <Lightbulb className="h-4 w-4" />
                  What technical skills do you currently have?
                </Label>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {predefinedSkills.map((skill) => (
                      <Button
                        key={skill}
                        type="button"
                        variant={selectedSkills.includes(skill) ? "default" : "outline"}
                        size="sm"
                        onClick={() => (selectedSkills.includes(skill) ? removeSkill(skill) : addSkill(skill))}
                      >
                        {skill}
                        {selectedSkills.includes(skill) && <X className="ml-1 h-3 w-3" />}
                      </Button>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Input
                      placeholder="Add custom skill"
                      value={customSkill}
                      onChange={(e) => setCustomSkill(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addSkill(customSkill)
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => addSkill(customSkill)}
                      disabled={!customSkill}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {selectedSkills.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Selected Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedSkills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                            {skill}
                            <X className="h-3 w-3 cursor-pointer" onClick={() => removeSkill(skill)} />
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Interests Section */}
              <div>
                <Label className="text-base font-semibold mb-3 block">
                  What areas of technology interest you most?
                </Label>
                <div className="flex flex-wrap gap-2">
                  {interestAreas.map((interest) => (
                    <Button
                      key={interest}
                      type="button"
                      variant={selectedInterests.includes(interest) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleInterest(interest)}
                    >
                      {interest}
                      {selectedInterests.includes(interest) && <X className="ml-1 h-3 w-3" />}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Career Goals */}
              <div>
                <Label htmlFor="goals" className="text-base font-semibold">
                  What are your career goals?
                </Label>
                <Textarea
                  id="goals"
                  placeholder="e.g., Get an internship at a tech company, switch to a tech career, start freelancing, build my own startup..."
                  value={formData.careerGoals}
                  onChange={(e) => setFormData({ ...formData, careerGoals: e.target.value })}
                  className="mt-2"
                  rows={3}
                />
              </div>

              {/* Experience Level */}
              <div>
                <Label htmlFor="experience" className="text-base font-semibold">
                  How would you describe your current experience level?
                </Label>
                <Input
                  id="experience"
                  placeholder="e.g., Complete beginner, some programming experience, intermediate, advanced..."
                  value={formData.experienceLevel}
                  onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                  className="mt-2"
                />
              </div>

              {/* Time Commitment */}
              <div>
                <Label htmlFor="time" className="text-base font-semibold flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  How many hours per week can you dedicate to learning?
                </Label>
                <Input
                  id="time"
                  type="number"
                  placeholder="e.g., 10"
                  value={formData.timeCommitment}
                  onChange={(e) => setFormData({ ...formData, timeCommitment: e.target.value })}
                  className="mt-2"
                  min="1"
                  max="40"
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading || selectedSkills.length === 0 || selectedInterests.length === 0}
              >
                {loading ? "Setting up your profile..." : "Complete Profile & Get Recommendations"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
