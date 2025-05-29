"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Code,
  Database,
  Shield,
  Smartphone,
  Cloud,
  BarChart3,
  Star,
  LogOut,
  User,
  Brain,
  TrendingUp,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { supabase, type UserInformation } from "@/lib/supabase"
import { ThemeToggle } from "@/components/theme-toggle"
import { SkillExpertiseAssessment } from "@/components/skill-expertise-assessment"
import { RoadmapTracker } from "@/components/roadmap-tracker"
import type { AIRecommendation } from "@/lib/ai-recommendations"

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

const careerPaths: CareerPath[] = [
  {
    id: "frontend",
    title: "Frontend Developer",
    icon: <Code className="h-6 w-6" />,
    description: "Create beautiful, interactive user interfaces and web experiences",
    skills: ["HTML/CSS", "JavaScript", "React", "TypeScript", "UI/UX Design"],
    avgSalary: "$70k - $120k",
    jobGrowth: "13% (Much faster than average)",
    difficulty: "Beginner",
    roadmap: [
      {
        phase: "Foundation (0-3 months)",
        duration: "3 months",
        skills: ["HTML5", "CSS3", "JavaScript ES6+", "Git/GitHub", "Responsive Design"],
        projects: ["Personal Portfolio", "Landing Page", "Calculator App"],
      },
      {
        phase: "Framework Mastery (3-6 months)",
        duration: "3 months",
        skills: ["React.js", "State Management", "API Integration", "CSS Frameworks"],
        projects: ["Todo App", "Weather App", "E-commerce Frontend"],
      },
      {
        phase: "Advanced Skills (6-9 months)",
        duration: "3 months",
        skills: ["TypeScript", "Next.js", "Testing", "Performance Optimization"],
        projects: ["Full-stack Blog", "Real-time Chat App", "Dashboard"],
      },
      {
        phase: "Job Ready (9-12 months)",
        duration: "3 months",
        skills: ["System Design", "Deployment", "Team Collaboration", "Code Reviews"],
        projects: ["Capstone Project", "Open Source Contributions", "Interview Prep"],
      },
    ],
  },
  {
    id: "backend",
    title: "Backend Developer",
    icon: <Database className="h-6 w-6" />,
    description: "Build robust server-side applications and APIs that power applications",
    skills: ["Python/Java/Node.js", "Databases", "APIs", "Cloud Services", "System Design"],
    avgSalary: "$75k - $130k",
    jobGrowth: "22% (Much faster than average)",
    difficulty: "Intermediate",
    roadmap: [
      {
        phase: "Programming Fundamentals (0-4 months)",
        duration: "4 months",
        skills: ["Python/Java/Node.js", "Data Structures", "Algorithms", "Git", "Linux Basics"],
        projects: ["CLI Tools", "Simple Web Server", "File Processing Scripts"],
      },
      {
        phase: "Web Development (4-8 months)",
        duration: "4 months",
        skills: ["REST APIs", "Databases (SQL/NoSQL)", "Authentication", "Testing"],
        projects: ["REST API", "User Management System", "Blog Backend"],
      },
      {
        phase: "Advanced Backend (8-12 months)",
        duration: "4 months",
        skills: ["Microservices", "Caching", "Message Queues", "Docker"],
        projects: ["Microservices App", "Real-time API", "Scalable Backend"],
      },
      {
        phase: "Production Ready (12-15 months)",
        duration: "3 months",
        skills: ["Cloud Deployment", "Monitoring", "Security", "Performance Tuning"],
        projects: ["Production App", "System Design Interview", "Open Source"],
      },
    ],
  },
  {
    id: "datascience",
    title: "Data Scientist",
    icon: <BarChart3 className="h-6 w-6" />,
    description: "Extract insights from data using statistics, machine learning, and visualization",
    skills: ["Python/R", "Statistics", "Machine Learning", "SQL", "Data Visualization"],
    avgSalary: "$85k - $150k",
    jobGrowth: "35% (Much faster than average)",
    difficulty: "Advanced",
    roadmap: [
      {
        phase: "Math & Programming (0-4 months)",
        duration: "4 months",
        skills: ["Python", "Statistics", "Linear Algebra", "SQL", "Pandas/NumPy"],
        projects: ["Data Analysis Projects", "Statistical Reports", "SQL Queries"],
      },
      {
        phase: "Machine Learning (4-8 months)",
        duration: "4 months",
        skills: ["Scikit-learn", "Feature Engineering", "Model Evaluation", "Visualization"],
        projects: ["Prediction Models", "Classification Tasks", "Data Dashboards"],
      },
      {
        phase: "Advanced ML (8-12 months)",
        duration: "4 months",
        skills: ["Deep Learning", "NLP", "Computer Vision", "Big Data Tools"],
        projects: ["Neural Networks", "NLP Projects", "Image Recognition"],
      },
      {
        phase: "Industry Ready (12-18 months)",
        duration: "6 months",
        skills: ["MLOps", "Cloud Platforms", "A/B Testing", "Business Acumen"],
        projects: ["End-to-end ML Pipeline", "Business Case Studies", "Portfolio"],
      },
    ],
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity Specialist",
    icon: <Shield className="h-6 w-6" />,
    description: "Protect systems and data from cyber threats and security vulnerabilities",
    skills: ["Network Security", "Ethical Hacking", "Risk Assessment", "Compliance", "Incident Response"],
    avgSalary: "$80k - $140k",
    jobGrowth: "33% (Much faster than average)",
    difficulty: "Intermediate",
    roadmap: [
      {
        phase: "Security Fundamentals (0-4 months)",
        duration: "4 months",
        skills: ["Network Basics", "Operating Systems", "Security Principles", "Linux"],
        projects: ["Network Scanning", "System Hardening", "Security Audit"],
      },
      {
        phase: "Ethical Hacking (4-8 months)",
        duration: "4 months",
        skills: ["Penetration Testing", "Vulnerability Assessment", "Web Security", "Cryptography"],
        projects: ["Pen Testing Lab", "Web App Security", "Crypto Challenges"],
      },
      {
        phase: "Advanced Security (8-12 months)",
        duration: "4 months",
        skills: ["Incident Response", "Forensics", "Malware Analysis", "Cloud Security"],
        projects: ["Incident Response Plan", "Malware Lab", "Cloud Security Assessment"],
      },
      {
        phase: "Professional Ready (12-15 months)",
        duration: "3 months",
        skills: ["Compliance", "Risk Management", "Security Architecture", "Certifications"],
        projects: ["Security Framework", "Certification Prep", "Capstone Project"],
      },
    ],
  },
  {
    id: "mobile",
    title: "Mobile Developer",
    icon: <Smartphone className="h-6 w-6" />,
    description: "Create native and cross-platform mobile applications for iOS and Android",
    skills: ["React Native/Flutter", "iOS/Android", "Mobile UI/UX", "App Store Optimization"],
    avgSalary: "$75k - $125k",
    jobGrowth: "22% (Much faster than average)",
    difficulty: "Intermediate",
    roadmap: [
      {
        phase: "Mobile Basics (0-3 months)",
        duration: "3 months",
        skills: ["JavaScript/Dart", "Mobile Design Principles", "Git", "Development Environment"],
        projects: ["Simple Calculator", "Weather App", "Note Taking App"],
      },
      {
        phase: "Framework Mastery (3-6 months)",
        duration: "3 months",
        skills: ["React Native/Flutter", "Navigation", "State Management", "API Integration"],
        projects: ["Social Media App", "E-commerce App", "Fitness Tracker"],
      },
      {
        phase: "Advanced Features (6-9 months)",
        duration: "3 months",
        skills: ["Push Notifications", "Offline Storage", "Camera/GPS", "Performance"],
        projects: ["Chat Application", "Photo Sharing App", "Location-based App"],
      },
      {
        phase: "Production Ready (9-12 months)",
        duration: "3 months",
        skills: ["App Store Deployment", "Testing", "Analytics", "Monetization"],
        projects: ["Published App", "App Store Optimization", "Portfolio"],
      },
    ],
  },
  {
    id: "devops",
    title: "DevOps Engineer",
    icon: <Cloud className="h-6 w-6" />,
    description: "Bridge development and operations through automation and infrastructure management",
    skills: ["Docker", "Kubernetes", "CI/CD", "Cloud Platforms", "Infrastructure as Code"],
    avgSalary: "$85k - $145k",
    jobGrowth: "25% (Much faster than average)",
    difficulty: "Advanced",
    roadmap: [
      {
        phase: "Foundation (0-4 months)",
        duration: "4 months",
        skills: ["Linux", "Networking", "Git", "Scripting (Bash/Python)", "Cloud Basics"],
        projects: ["Server Setup", "Automation Scripts", "Basic Monitoring"],
      },
      {
        phase: "Containerization (4-8 months)",
        duration: "4 months",
        skills: ["Docker", "Container Orchestration", "Kubernetes", "Microservices"],
        projects: ["Dockerized Apps", "K8s Cluster", "Container Registry"],
      },
      {
        phase: "CI/CD & IaC (8-12 months)",
        duration: "4 months",
        skills: ["Jenkins/GitHub Actions", "Terraform", "Ansible", "Monitoring"],
        projects: ["CI/CD Pipeline", "Infrastructure Automation", "Monitoring Setup"],
      },
      {
        phase: "Production Systems (12-18 months)",
        duration: "6 months",
        skills: ["Security", "Scalability", "Disaster Recovery", "Cost Optimization"],
        projects: ["Production Infrastructure", "Security Implementation", "Portfolio"],
      },
    ],
  },
]

interface CareerNavigatorProps {
  onSignOut: () => void
}

export function CareerNavigator({ onSignOut }: CareerNavigatorProps) {
  const [currentStep, setCurrentStep] = useState<"expertise-assessment" | "recommendations" | "roadmap">(
    "recommendations",
  )
  const [userInfo, setUserInfo] = useState<UserInformation | null>(null)
  const [selectedPaths, setSelectedPaths] = useState<string[]>([])
  const [selectedPath, setSelectedPath] = useState<CareerPath | null>(null)
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [aiLoading, setAiLoading] = useState(false)

  useEffect(() => {
    fetchUserInfo()
  }, [])

  const fetchUserInfo = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        const { data, error } = await supabase.from("user_information").select("*").eq("id", user.id).single()

        if (error) throw error
        setUserInfo(data)

        // Check if user has completed skill expertise assessment
        if (!data.skill_expertise || Object.keys(data.skill_expertise).length === 0) {
          setCurrentStep("expertise-assessment")
        } else {
          setCurrentStep("recommendations")
          generateRecommendations(data)
          getAIRecommendations(data, user.id)
        }
      }
    } catch (error) {
      console.error("Error fetching user info:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleExpertiseComplete = async (expertise: Record<string, string>) => {
    if (userInfo) {
      const updatedUserInfo = { ...userInfo, skill_expertise: expertise }
      setUserInfo(updatedUserInfo)
      setCurrentStep("recommendations")
      generateRecommendations(updatedUserInfo)

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        getAIRecommendations(updatedUserInfo, user.id)
      }
    }
  }

  const getAIRecommendations = async (user: UserInformation, userId: string) => {
    setAiLoading(true)
    try {
      const response = await fetch("/api/ai-recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userProfile: {
            name: user.name,
            age: user.age,
            education_field: user.education_field,
            study_year: user.study_year,
            skills: user.skills,
            skill_expertise: user.skill_expertise || {},
            interests: user.interests || "",
            career_goals: user.career_goals || "",
            experience_level: user.experience_level || "",
            availability_hours_per_week: user.availability_hours_per_week || 10,
          },
          userId: userId,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setAiRecommendations(data.recommendations)
      }
    } catch (error) {
      console.error("Error getting AI recommendations:", error)
    } finally {
      setAiLoading(false)
    }
  }

  const generateRecommendations = (user: UserInformation) => {
    const suggested: string[] = []
    const userSkills = user.skills.map((skill) => skill.toLowerCase())
    const educationField = user.education_field.toLowerCase()
    const interests = user.interests?.toLowerCase() || ""

    // Recommend based on interests first
    if (interests.includes("web development") || interests.includes("ui/ux")) {
      suggested.push("frontend")
    }
    if (
      interests.includes("data science") ||
      interests.includes("machine learning") ||
      interests.includes("artificial intelligence")
    ) {
      suggested.push("datascience")
    }
    if (interests.includes("cybersecurity")) {
      suggested.push("cybersecurity")
    }
    if (interests.includes("mobile")) {
      suggested.push("mobile")
    }
    if (interests.includes("devops") || interests.includes("cloud")) {
      suggested.push("devops")
    }

    // Recommend based on education field
    if (educationField.includes("computer") || educationField.includes("information")) {
      if (!suggested.includes("frontend")) suggested.push("frontend")
      if (!suggested.includes("backend")) suggested.push("backend")
    }
    if (educationField.includes("commerce") || educationField.includes("business")) {
      if (!suggested.includes("datascience")) suggested.push("datascience")
    }

    // Recommend based on existing skills
    if (userSkills.some((skill) => ["html", "css", "javascript", "react"].includes(skill))) {
      if (!suggested.includes("frontend")) suggested.push("frontend")
    }
    if (userSkills.some((skill) => ["python", "java", "sql", "node.js"].includes(skill))) {
      if (!suggested.includes("backend")) suggested.push("backend")
      if (!suggested.includes("datascience")) suggested.push("datascience")
    }
    if (userSkills.some((skill) => ["cybersecurity", "linux"].includes(skill))) {
      if (!suggested.includes("cybersecurity")) suggested.push("cybersecurity")
    }
    if (userSkills.some((skill) => ["mobile", "android", "ios"].includes(skill))) {
      if (!suggested.includes("mobile")) suggested.push("mobile")
    }
    if (userSkills.some((skill) => ["cloud", "devops", "docker"].includes(skill))) {
      if (!suggested.includes("devops")) suggested.push("devops")
    }
    if (userSkills.some((skill) => ["data analysis", "machine learning", "statistics"].includes(skill))) {
      if (!suggested.includes("datascience")) suggested.push("datascience")
    }

    // Ensure we have at least 3 recommendations
    if (suggested.length < 3) {
      const remaining = careerPaths
        .filter((path) => !suggested.includes(path.id))
        .slice(0, 3 - suggested.length)
        .map((path) => path.id)
      suggested.push(...remaining)
    }

    setSelectedPaths(suggested)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "Advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400"
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400"
    return "text-red-600 dark:text-red-400"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (currentStep === "expertise-assessment" && userInfo) {
    return <SkillExpertiseAssessment userInfo={userInfo} onComplete={handleExpertiseComplete} />
  }

  if (currentStep === "roadmap" && selectedPath && userInfo) {
    return (
      <RoadmapTracker
        selectedPath={selectedPath}
        userInfo={userInfo}
        onBack={() => setCurrentStep("recommendations")}
        onSignOut={onSignOut}
      />
    )
  }

  if (currentStep === "recommendations") {
    const recommendedPaths = careerPaths.filter((path) => selectedPaths.includes(path.id))
    const otherPaths = careerPaths.filter((path) => !selectedPaths.includes(path.id))

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header with user info and controls */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back, {userInfo?.name}!</h1>
              <p className="text-gray-600 dark:text-gray-300">Here are your personalized career recommendations</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <User className="h-4 w-4" />
                <span>
                  {userInfo?.education_field} - Year {userInfo?.study_year}
                </span>
              </div>
              <ThemeToggle />
              <Button onClick={onSignOut} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>

          {/* AI Recommendations Section */}
          {aiRecommendations.length > 0 && (
            <Card className="mb-8 border-2 border-purple-200 dark:border-purple-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
                  <Brain className="h-5 w-5" />
                  AI-Powered Career Recommendations
                </CardTitle>
                <CardDescription>Personalized suggestions based on your skill expertise analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
                  {aiRecommendations.map((rec, index) => (
                    <Card key={index} className="border border-purple-100 dark:border-purple-900">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{rec.careerPath}</CardTitle>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-4 w-4" />
                            <span className={`font-bold ${getMatchScoreColor(rec.matchScore)}`}>{rec.matchScore}%</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-gray-600 dark:text-gray-300">{rec.reasoning}</p>

                        {/* Strength Areas */}
                        {rec.strengthAreas && rec.strengthAreas.length > 0 && (
                          <div>
                            <p className="text-sm font-medium mb-2 flex items-center gap-1">
                              <CheckCircle className="h-3 w-3 text-green-600" />
                              Your Strengths:
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {rec.strengthAreas.map((strength, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs bg-green-100 text-green-800">
                                  {strength}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Skill Gaps */}
                        {rec.skillGaps && rec.skillGaps.length > 0 && (
                          <div>
                            <p className="text-sm font-medium mb-2 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3 text-orange-600" />
                              Skills to Develop:
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {rec.skillGaps.map((gap, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs bg-orange-100 text-orange-800">
                                  {gap}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <div>
                          <p className="text-sm font-medium mb-2">Next Steps:</p>
                          <ul className="text-sm space-y-1">
                            {rec.nextSteps.map((step, stepIndex) => (
                              <li key={stepIndex} className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-purple-600 rounded-full"></div>
                                {step}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="pt-2 border-t">
                          <p className="text-sm">
                            <strong>Timeline:</strong> {rec.timelineEstimate}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {aiLoading && (
            <Card className="mb-8 border-2 border-purple-200 dark:border-purple-800">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                  <span className="text-purple-700 dark:text-purple-300">Getting AI recommendations...</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* User Profile Summary */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {userInfo?.skills && userInfo.skills.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Skills & Expertise</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {userInfo.skills.map((skill) => {
                      const expertise = userInfo.skill_expertise?.[skill] || "beginner"
                      return (
                        <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                          {skill}
                          <span className="text-xs opacity-70">({expertise})</span>
                        </Badge>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {userInfo?.interests && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Interests</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300">{userInfo.interests}</p>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              Recommended for You
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedPaths.map((path) => (
                <Card
                  key={path.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-blue-200 dark:border-blue-800"
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {path.icon}
                        <CardTitle className="text-lg">{path.title}</CardTitle>
                      </div>
                      <Badge className={getDifficultyColor(path.difficulty)}>{path.difficulty}</Badge>
                    </div>
                    <CardDescription>{path.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Key Skills:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {path.skills.slice(0, 3).map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {path.skills.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{path.skills.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-sm">
                        <p>
                          <strong>Salary:</strong> {path.avgSalary}
                        </p>
                        <p>
                          <strong>Growth:</strong> {path.jobGrowth}
                        </p>
                      </div>
                      <Button
                        onClick={() => {
                          setSelectedPath(path)
                          setCurrentStep("roadmap")
                        }}
                        className="w-full"
                      >
                        View Learning Roadmap
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Other Career Paths to Explore</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherPaths.map((path) => (
                <Card key={path.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {path.icon}
                        <CardTitle className="text-lg">{path.title}</CardTitle>
                      </div>
                      <Badge className={getDifficultyColor(path.difficulty)}>{path.difficulty}</Badge>
                    </div>
                    <CardDescription>{path.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Key Skills:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {path.skills.slice(0, 3).map((skill) => (
                            <Badge key={skill} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {path.skills.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{path.skills.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="text-sm">
                        <p>
                          <strong>Salary:</strong> {path.avgSalary}
                        </p>
                        <p>
                          <strong>Growth:</strong> {path.jobGrowth}
                        </p>
                      </div>
                      <Button
                        onClick={() => {
                          setSelectedPath(path)
                          setCurrentStep("roadmap")
                        }}
                        variant="outline"
                        className="w-full"
                      >
                        View Learning Roadmap
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
