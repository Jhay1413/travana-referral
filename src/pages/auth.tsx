import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { LoginForm } from "@/components/login-form"
import { SignupForm } from "@/components/signup-form"
import { authClient } from "@/lib/auth-client"
import type { RegistrationMutationSchema } from "@/lib/schemas"

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()
  const { data: session } = authClient.useSession()

  // Get the intended destination from location state, fallback to dashboard
  const from = location.state?.from?.pathname || "/dashboard"

  // Handle redirect after successful authentication
  useEffect(() => {
    if (session) {
      navigate(from, { replace: true })
    }
  }, [session, navigate, from])

 
  if (isLogin) {
    return (
      <LoginForm 
      
        onSwitchToSignup={() => setIsLogin(false)}
      />
    )
  }

  return (
    <SignupForm 
    
      onSwitchToLogin={() => setIsLogin(true)}
    />
  )
}
