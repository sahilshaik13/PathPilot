"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Clock, CheckCircle, Circle, Play, ArrowLeft, Target, Award, Calendar, TrendingUp } from "lucide-react"
import { supabase, type UserInformation } from "@/lib/supabase"

interface CareerPath {
  id: string
  title: string
  icon: React.ReactNode
  description: string
  skills: string[]
  avgSalary: string
  jobGrowth: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  roadmap: {
    phase: string
    duration: string
    skills: string[]
    projects: string[]
  }[]
}

interface RoadmapProgress {
  id: string
  user_id: string
  career_path: string
  phase_index: number
  skill_name: string
  project_name?: string
  status: "pending" | "in_progress" | "completed"
  started_at?: string
  completed_at?: string
}

interface RoadmapTrackerProps {
  selectedPath: CareerPath
  userInfo: UserInformation
  onBack: () => void
  onSignOut: () => void
}

const expertiseLevels = [
  { value: "beginner", label: "Beginner", description: "Just starting out, basic understanding" },
  { value: "intermediate", label: "Intermediate", description: "Some experience, can work independently" },
  { value: "advanced", label: "Advanced", description: "Strong expertise, can mentor others" },
  { value: "expert", label: "Expert", description: "Deep knowledge, industry recognized" },
]

export function RoadmapTracker({ selectedPath, userInfo, onBack, onSignOut }: RoadmapTrackerProps) {
  const [progress, setProgress] = useState<RoadmapProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [hasStarted, setHasStarted] = useState(false)
  const [showExpertiseDialog, setShowExpertiseDialog] = useState(false)
  const [completedSkill, setCompletedSkill] = useState<string>("")
  const [selectedExpertise, setSelectedExpertise] = useState<string>("")
  const [updatingProgress, setUpdatingProgress] = useState(false)

  useEffect(() => {
    if (selectedPath.id) {
      fetchProgress().then(() => {
        // Only sync if the user has already started the roadmap
        // or we're loading for the first time
        if (hasStarted || loading) {
          syncRoadmapWithDatabase()
        }
      })
    }
  }, [selectedPath.id])

  const fetchProgress = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data, error } = await supabase
          .from("roadmap_progress")
          .select("*")
          .eq("user_id", user.id)
          .eq("career_path", selectedPath.id)

        if (error) throw error

        setProgress(data || [])
        setHasStarted(data && data.length > 0)
      }
    } catch (error) {
      console.error("Error fetching progress:", error)
    } finally {
      setLoading(false)
    }
  }

  const syncRoadmapWithDatabase = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      // Fetch current progress from database
      const { data: existingProgress, error: fetchError } = await supabase
        .from("roadmap_progress")
        .select("*")
        .eq("user_id", user.id)
        .eq("career_path", selectedPath.id)

      if (fetchError) throw fetchError

      // Create a map of existing progress items for easy lookup
      const existingProgressMap = new Map()
      existingProgress?.forEach((item) => {
        const key = `${item.phase_index}-${item.skill_name}`
        existingProgressMap.set(key, item)
      })

      // Create entries for items that should exist based on current roadmap
      const progressEntries: any[] = []
      const existingKeys = new Set()

      selectedPath.roadmap.forEach((phase, phaseIndex) => {
        // Process skills
        phase.skills.forEach((skill) => {
          const key = `${phaseIndex}-${skill}`
          existingKeys.add(key)

          // If this skill doesn't exist in the database yet, add it
          if (!existingProgressMap.has(key)) {
            progressEntries.push({
              user_id: user.id,
              career_path: selectedPath.id,
              phase_index: phaseIndex,
              skill_name: skill,
              status: "pending",
            })
          }
        })

        // Process projects
        phase.projects.forEach((project) => {
          const key = `${phaseIndex}-Project: ${project}`
          existingKeys.add(key)

          // If this project doesn't exist in the database yet, add it
          if (!existingProgressMap.has(key)) {
            progressEntries.push({
              user_id: user.id,
              career_path: selectedPath.id,
              phase_index: phaseIndex,
              skill_name: `Project: ${project}`,
              project_name: project,
              status: "pending",
            })
          }
        })
      })

      // Insert new items if any
      if (progressEntries.length > 0) {
        const { error: insertError } = await supabase.from("roadmap_progress").insert(progressEntries)

        if (insertError) throw insertError
      }

      // Find items that exist in the database but not in the current roadmap (deleted items)
      const itemsToDelete: number[] = []
      existingProgress?.forEach((item) => {
        const key = `${item.phase_index}-${item.skill_name}`
        if (!existingKeys.has(key)) {
          itemsToDelete.push(item.id)
        }
      })

      // Delete items that no longer exist in the roadmap
      if (itemsToDelete.length > 0) {
        const { error: deleteError } = await supabase.from("roadmap_progress").delete().in("id", itemsToDelete)

        if (deleteError) throw deleteError
      }

      // Refresh progress data after sync
      fetchProgress()
      setHasStarted((existingProgress && existingProgress.length > 0) || progressEntries.length > 0)
    } catch (error) {
      console.error("Error syncing roadmap:", error)
    }
  }

  const startRoadmap = async () => {
    try {
      await syncRoadmapWithDatabase()
      setHasStarted(true)
    } catch (error) {
      console.error("Error starting roadmap:", error)
    }
  }

  const updateItemStatus = async (
    phaseIndex: number,
    skillName: string,
    _projectName: string | undefined,
    newStatus: "pending" | "in_progress" | "completed",
  ) => {
    setUpdatingProgress(true)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const existingItem = progress.find((p) => p.phase_index === phaseIndex && p.skill_name === skillName)

      const updateData: any = {
        status: newStatus,
        updated_at: new Date().toISOString(),
      }

      if (newStatus === "in_progress" && !existingItem?.started_at) {
        updateData.started_at = new Date().toISOString()
      }

      if (newStatus === "completed") {
        updateData.completed_at = new Date().toISOString()
      } else if ((newStatus === "pending" || newStatus === "in_progress") && existingItem?.completed_at) {
        updateData.completed_at = null
      }

      const { error } = await supabase
        .from("roadmap_progress")
        .update(updateData)
        .eq("user_id", user.id)
        .eq("career_path", selectedPath.id)
        .eq("phase_index", phaseIndex)
        .eq("skill_name", skillName)

      if (error) throw error

      // Prompt expertise dialog after completing a skill (non-project)
      if (newStatus === "completed" && !skillName.startsWith("Project:")) {
        setCompletedSkill(skillName)
        setShowExpertiseDialog(true)
      }

      fetchProgress()
    } catch (error) {
      console.error("Error updating progress:", error)
    } finally {
      setUpdatingProgress(false)
    }
  }

  const handleExpertiseSubmit = async () => {
    if (!selectedExpertise || !completedSkill) return
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const updatedSkills = [...userInfo.skills]
      if (!updatedSkills.includes(completedSkill)) {
        updatedSkills.push(completedSkill)
      }
      const updatedExpertise = {
        ...userInfo.skill_expertise,
        [completedSkill]: selectedExpertise,
      }

      const { error } = await supabase
        .from("user_information")
        .update({ skills: updatedSkills, skill_expertise: updatedExpertise })
        .eq("id", user.id)

      if (error) throw error

      userInfo.skills = updatedSkills
      userInfo.skill_expertise = updatedExpertise

      setShowExpertiseDialog(false)
      setCompletedSkill("")
      setSelectedExpertise("")
    } catch (error) {
      console.error("Error updating skills:", error)
    }
  }

  const getItemProgress = (phaseIndex: number, skillName: string) =>
    progress.find((p) => p.phase_index === phaseIndex && p.skill_name === skillName)

  const getPhaseProgress = (phaseIndex: number) => {
    const phaseItems = progress.filter((p) => p.phase_index === phaseIndex)
    const completedItems = phaseItems.filter((p) => p.status === "completed")
    return phaseItems.length > 0 ? (completedItems.length / phaseItems.length) * 100 : 0
  }

  const getOverallProgress = () => {
    const completedItems = progress.filter((p) => p.status === "completed")
    return progress.length > 0 ? (completedItems.length / progress.length) * 100 : 0
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "in_progress":
        return <Play className="h-4 w-4 text-blue-600" />
      default:
        return <Circle className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "in_progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading your roadmap...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            {selectedPath.icon}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{selectedPath.title} Roadmap</h1>
              <p className="text-gray-600 dark:text-gray-300">Track your learning progress</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={onBack} variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button onClick={onSignOut} variant="outline" size="sm">
              Sign Out
            </Button>
          </div>
        </div>

        {/* Overall Progress */}
        {hasStarted && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Overall Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Completion</span>
                  <span>{Math.round(getOverallProgress())}%</span>
                </div>
                <Progress value={getOverallProgress()} className="w-full" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{progress.filter((p) => p.status === "completed").length} completed</span>
                  <span>{progress.length} total items</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Start Roadmap Button */}
        {!hasStarted && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Ready to Start Your Journey?
              </CardTitle>
              <CardDescription>
                Begin tracking your progress through the {selectedPath.title} learning roadmap
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={startRoadmap} className="w-full" size="lg">
                <Play className="h-5 w-5 mr-2" />
                Start Roadmap
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Roadmap Phases */}
        {hasStarted && (
          <div className="space-y-6">
            {selectedPath.roadmap.map((phase, phaseIndex) => {
              const phaseProgress = getPhaseProgress(phaseIndex)
              const isPhaseCompleted = phaseProgress === 100

              return (
                <Card
                  key={phase.phase + phaseIndex}
                  className={isPhaseCompleted ? "border-green-200 bg-green-50/50" : undefined}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                            isPhaseCompleted
                              ? "bg-green-600 text-white"
                              : phaseProgress > 0
                                ? "bg-blue-600 text-white"
                                : "bg-gray-300 text-gray-600"
                          }`}
                        >
                          {isPhaseCompleted ? <CheckCircle className="h-4 w-4" /> : phaseIndex + 1}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{phase.phase}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {phase.duration}
                            </Badge>
                            <Badge variant="outline">{Math.round(phaseProgress)}% Complete</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Progress value={phaseProgress} className="w-full mt-2" />
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="skills" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="skills">Skills ({phase.skills.length})</TabsTrigger>
                        <TabsTrigger value="projects">Projects ({phase.projects.length})</TabsTrigger>
                      </TabsList>

                      <TabsContent value="skills" className="mt-4">
                        <div className="space-y-3">
                          {phase.skills.map((skill, skillIndex) => {
                            const itemProgress = getItemProgress(phaseIndex, skill)
                            const status = itemProgress?.status || "pending"

                            return (
                              <div
                                key={`${skill}-${phaseIndex}-${skillIndex}`}
                                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                              >
                                <div className="flex items-center gap-3">
                                  {getStatusIcon(status)}
                                  <div>
                                    <span className="font-medium">{skill}</span>
                                    {itemProgress?.started_at && (
                                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                        <Calendar className="h-3 w-3" />
                                        Started: {new Date(itemProgress.started_at).toLocaleDateString()}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge className={getStatusColor(status)} variant="secondary">
                                    {status.replace("_", " ")}
                                  </Badge>
                                  <div className="flex gap-1">
                                    {status === "pending" && (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => updateItemStatus(phaseIndex, skill, undefined, "in_progress")}
                                        disabled={updatingProgress}
                                      >
                                        Start
                                      </Button>
                                    )}
                                    {status === "in_progress" && (
                                      <Button
                                        size="sm"
                                        onClick={() => updateItemStatus(phaseIndex, skill, undefined, "completed")}
                                        disabled={updatingProgress}
                                      >
                                        Complete
                                      </Button>
                                    )}
                                    {status === "completed" && (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => updateItemStatus(phaseIndex, skill, undefined, "in_progress")}
                                        disabled={updatingProgress}
                                      >
                                        Reopen
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </TabsContent>

                      <TabsContent value="projects" className="mt-4">
                        <div className="space-y-3">
                          {phase.projects.map((project, projectIndex) => {
                            const skillName = `Project: ${project}`
                            const itemProgress = getItemProgress(phaseIndex, skillName)
                            const status = itemProgress?.status || "pending"

                            return (
                              <div
                                key={`${skillName}-${phaseIndex}-${projectIndex}`}
                                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                              >
                                <div className="flex items-center gap-3">
                                  {getStatusIcon(status)}
                                  <div>
                                    <span className="font-medium">{project}</span>
                                    {itemProgress?.started_at && (
                                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                        <Calendar className="h-3 w-3" />
                                        Started: {new Date(itemProgress.started_at).toLocaleDateString()}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge className={getStatusColor(status)} variant="secondary">
                                    {status.replace("_", " ")}
                                  </Badge>
                                  <div className="flex gap-1">
                                    {status === "pending" && (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => updateItemStatus(phaseIndex, skillName, project, "in_progress")}
                                        disabled={updatingProgress}
                                      >
                                        Start
                                      </Button>
                                    )}
                                    {status === "in_progress" && (
                                      <Button
                                        size="sm"
                                        onClick={() => updateItemStatus(phaseIndex, skillName, project, "completed")}
                                        disabled={updatingProgress}
                                      >
                                        Complete
                                      </Button>
                                    )}
                                    {status === "completed" && (
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => updateItemStatus(phaseIndex, skillName, project, "in_progress")}
                                        disabled={updatingProgress}
                                      >
                                        Reopen
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Expertise Assessment Dialog */}
        <Dialog open={showExpertiseDialog} onOpenChange={setShowExpertiseDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Congratulations! New Skill Acquired
              </DialogTitle>
              <DialogDescription>
                You've completed learning <strong>{completedSkill}</strong>! Please rate your current expertise level.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <RadioGroup value={selectedExpertise} onValueChange={setSelectedExpertise}>
                {expertiseLevels.map((level) => (
                  <div key={level.value} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <RadioGroupItem value={level.value} id={level.value} />
                    <Label htmlFor={level.value} className="flex-1 cursor-pointer">
                      <div>
                        <div className="font-medium">{level.label}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{level.description}</div>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowExpertiseDialog(false)} className="flex-1">
                  Skip for Now
                </Button>
                <Button onClick={handleExpertiseSubmit} disabled={!selectedExpertise} className="flex-1">
                  Add to My Skills
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
