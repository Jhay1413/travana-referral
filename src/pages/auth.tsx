import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { LoginForm } from "@/components/login-form"
import { SignupForm } from "@/components/signup-form"
import type { RegistrationMutationSchema } from "@/lib/schemas"

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const navigate = useNavigate()

  const handleLogin = (email: string, password: string) => {
    console.log("Login attempt:", { email, password })
    // Redirect to dashboard after successful login
    navigate("/dashboard")
  }

  const handleSignup = (data: RegistrationMutationSchema) => {
    console.log("Signup attempt:", data)
    // Redirect to dashboard after successful signup
    navigate("/dashboard")
  }

  if (isLogin) {
    return (
      <LoginForm 
        onLogin={handleLogin}
        onSwitchToSignup={() => setIsLogin(false)}
      />
    )
  }

  return (
    <SignupForm 
      onSignup={handleSignup}
      onSwitchToLogin={() => setIsLogin(true)}
    />
  )
}
