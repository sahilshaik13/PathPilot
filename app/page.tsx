"use client"

import { useState, useEffect } from "react"
import { SignupForm } from "@/components/auth/signup-form"
import { SigninForm } from "@/components/auth/signin-form"
import { supabase } from "@/lib/supabase"
import { ProfileSetup } from "@/components/profile-setup"
import { CareerNavigator } from "@/components/career-navigator"

export default function Home() {
  const [currentView, setCurrentView] = useState<"signin" | "signup" | "profile-setup" | "app">("signin")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already signed in
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        // Check if user has completed profile setup
        const { data: userInfo } = await supabase
          .from("user_information")
          .select("skills, interests, career_goals, skill_expertise")
          .eq("id", session.user.id)
          .single()

        if (userInfo) {
          // Check if profile setup is complete (has skills and interests)
          if (userInfo.skills?.length > 0 && userInfo.interests) {
            // Check if skill expertise assessment is complete
            if (userInfo.skill_expertise && Object.keys(userInfo.skill_expertise).length > 0) {
              setCurrentView("app")
            } else {
              // Has profile but no expertise assessment
              setCurrentView("app") // CareerNavigator will handle expertise assessment
            }
          } else {
            // Profile incomplete
            setCurrentView("profile-setup")
          }
        } else {
          // No user info record, go to profile setup
          setCurrentView("profile-setup")
        }
      } else {
        setCurrentView("signin")
      }
      setLoading(false)
    }

    checkAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        // When user signs in, check their profile completion
        const { data: userInfo } = await supabase
          .from("user_information")
          .select("skills, interests, career_goals, skill_expertise")
          .eq("id", session.user.id)
          .single()

        if (userInfo) {
          if (userInfo.skills?.length > 0 && userInfo.interests) {
            if (userInfo.skill_expertise && Object.keys(userInfo.skill_expertise).length > 0) {
              setCurrentView("app")
            } else {
              setCurrentView("app") // Will show expertise assessment
            }
          } else {
            setCurrentView("profile-setup")
          }
        } else {
          setCurrentView("profile-setup")
        }
      } else if (event === "SIGNED_OUT") {
        setCurrentView("signin")
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setCurrentView("signin")
  }

  const handleSignupSuccess = () => {
    // After successful signup, go to signin
    setCurrentView("signin")
  }

  const handleSigninSuccess = () => {
    // After signin, the auth state change will handle navigation
    // Don't set view here, let the useEffect handle it
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    )
  }

  if (currentView === "app") {
    return <CareerNavigator onSignOut={handleSignOut} />
  }

  if (currentView === "profile-setup") {
    return <ProfileSetup onComplete={() => setCurrentView("app")} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">🚀 Tech Career Navigator</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Discover your perfect tech career path with personalized roadmaps
          </p>
        </div>

        <div className="flex justify-center">
          {currentView === "signin" ? (
            <SigninForm onSuccess={handleSigninSuccess} onSwitchToSignup={() => setCurrentView("signup")} />
          ) : (
            <SignupForm onSuccess={handleSignupSuccess} onSwitchToSignin={() => setCurrentView("signin")} />
          )}
        </div>
      </div>
    </div>
  )
}
