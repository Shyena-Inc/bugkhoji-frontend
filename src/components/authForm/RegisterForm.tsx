import type React from "react"
import { useState, useCallback, useMemo } from "react"
import { Eye, EyeOff, User, Building2, Mail, Lock, AlertCircle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context"
import type { ResearcherRegisterFormData, OrganizationRegisterFormData } from "@/types/auth"
import type { UserRole } from "@/types/user"
import type { AxiosError } from "axios"
import type { ErrorResponseI } from "@/types/context"

interface RegisterFormProps {
  onSubmit?: (data: ResearcherRegisterFormData | OrganizationRegisterFormData) => void
  role: UserRole
  showTitle?: boolean
}

export default function RegisterForm({ onSubmit, role = "RESEARCHER", showTitle = true }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const { toast } = useToast()
  const navigate = useNavigate()
  const { registerResearcher, registerOrganization } = useAuth()
  const [acceptTerms, setAcceptTerms] = useState(false)

  // Memoize initial form data to prevent recreating on every render
  const initialFormData = useMemo(() => 
    role === "RESEARCHER"
      ? {
          email: "",
          username: "",
          firstName: "",
          lastName: "",
          password: "",
          role: "RESEARCHER" as const,
          termsAccepted: false,
        }
      : {
          email: "",
          organizationName: "",
          website: "",
          description: "",
          password: "",
          role: "ORGANIZATION" as const,
          termsAccepted: false,
        }, [role]
  )

  const [formData, setFormData] = useState<ResearcherRegisterFormData | OrganizationRegisterFormData>(initialFormData)

  // Memoize password validation to prevent recalculating on every render
  const passwordValidation = useMemo(() => {
    const password = formData.password
    const minLength = password.length >= 8
    const hasUpper = /[A-Z]/.test(password)
    const hasLower = /[a-z]/.test(password)
    const hasNumber = /\d/.test(password)
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    return {
      minLength,
      hasUpper,
      hasLower,
      hasNumber,
      hasSpecial,
      isValid: minLength && hasUpper && hasLower && hasNumber && hasSpecial,
    }
  }, [formData.password])

  const passwordsMatch = useMemo(() => 
    formData.password === confirmPassword && confirmPassword !== "",
    [formData.password, confirmPassword]
  )

  // Use useCallback to prevent recreating the function on every render
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    setFormData(prev => ({ ...prev, [name]: value }))

    // Clear field-specific errors when user starts typing
    setFieldErrors(prev => {
      if (prev[name]) {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      }
      return prev
    })

    if (error) {
      setError(null)
    }
  }, [error])

  const handleConfirmPasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value)
    
    setFieldErrors(prev => {
      if (prev.confirmPassword) {
        const newErrors = { ...prev }
        delete newErrors.confirmPassword
        return newErrors
      }
      return prev
    })
  }, [])

  const handleTermsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setAcceptTerms(e.target.checked)
    
    if (fieldErrors.terms) {
      setFieldErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors.terms
        return newErrors
      })
    }
  }, [fieldErrors.terms])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setFieldErrors({})

    try {
      let registrationResult
      if (formData.password !== confirmPassword) {
        setIsLoading(false)
        setFieldErrors({ confirmPassword: "Passwords do not match" })
        toast({
          title: "Password Mismatch",
          description: "Password and Confirm Password must be the same.",
          variant: "destructive",
        })
        return
      }

      if (!passwordValidation.isValid) {
        setIsLoading(false)
        setFieldErrors({ password: "Password does not meet requirements" })
        toast({
          title: "Weak Password",
          description: "Please ensure your password meets all requirements.",
          variant: "destructive",
        })
        return
      }

      if (!acceptTerms) {
        setIsLoading(false)
        setFieldErrors({ terms: "You must accept the terms and conditions" })
        toast({
          title: "Terms Required",
          description: "Please accept the terms and conditions to continue.",
          variant: "destructive",
        })
        return
      }

      if (role === "RESEARCHER") {
        const researcherPayload: ResearcherRegisterFormData = {
          email: formData.email,
          username: (formData as ResearcherRegisterFormData).username,
          firstName: (formData as ResearcherRegisterFormData).firstName,
          lastName: (formData as ResearcherRegisterFormData).lastName,
          password: formData.password,
          role: "RESEARCHER",
          termsAccepted: acceptTerms,
        }
        registrationResult = await registerResearcher(researcherPayload)
      } else {
        const orgPayload: OrganizationRegisterFormData = {
          email: formData.email,
          organizationName: (formData as OrganizationRegisterFormData).organizationName,
          website: (formData as OrganizationRegisterFormData).website,
          description: (formData as OrganizationRegisterFormData).description,
          password: formData.password,
          role: "ORGANIZATION",
          termsAccepted: acceptTerms,
        }
        registrationResult = await registerOrganization(orgPayload)
      }

      if (onSubmit) {
        onSubmit(formData)
      }

      toast({
        title: "Registration successful!",
        description: "Your account has been created successfully",
      })

      setFormData(initialFormData)
      setAcceptTerms(false)
      const dashboardRoute = role === "RESEARCHER" ? "/researcher/dashboard" : "/organization/dashboard"
      navigate(dashboardRoute)
    } catch (error: unknown) {
      console.error("Registration error:", error)
      const apiError = error as AxiosError<ErrorResponseI>

      if (apiError.response?.status === 500) {
        const errorMsg = "Server error occurred. Please try again."
        toast({
          title: "Server Error",
          description: "Please try again later",
          variant: "destructive",
        })
        setError(errorMsg)
      } else {
        const errorMessage = apiError.response?.data?.message || ""
        const validationErrors = apiError.response?.data?.errors

        // Handle specific username/email already exists errors
        if (errorMessage.toLowerCase().includes("email already exists") || 
            errorMessage.toLowerCase().includes("email is already taken") ||
            errorMessage.toLowerCase().includes("email already registered")) {
          setFieldErrors({ email: "This email is already registered. Please use a different email." })
          toast({
            title: "Email Already Exists",
            description: "This email is already registered. Please use a different email or sign in instead.",
            variant: "destructive",
          })
          return
        }

        if (errorMessage.toLowerCase().includes("username already exists") || 
            errorMessage.toLowerCase().includes("username is already taken") ||
            errorMessage.toLowerCase().includes("username already registered")) {
          setFieldErrors({ username: "This username is already taken. Please choose a different username." })
          toast({
            title: "Username Already Exists",
            description: "This username is already taken. Please choose a different username.",
            variant: "destructive",
          })
          return
        }

        if (errorMessage.toLowerCase().includes("organization name already exists") ||
            errorMessage.toLowerCase().includes("organization name is already taken")) {
          setFieldErrors({ organizationName: "This organization name is already taken. Please choose a different name." })
          toast({
            title: "Organization Name Already Exists",
            description: "This organization name is already taken. Please choose a different name.",
            variant: "destructive",
          })
          return
        }

        // Handle validation errors from server
        if (validationErrors && typeof validationErrors === "object") {
          const newFieldErrors: Record<string, string> = {}
          Object.entries(validationErrors).forEach(([field, errors]) => {
            if (Array.isArray(errors)) {
              const errorText = errors[0].toLowerCase()
              
              // Check for specific email/username existence errors in validation errors
              if (field === "email" && (errorText.includes("already exists") || errorText.includes("already taken"))) {
                newFieldErrors[field] = "This email is already registered. Please use a different email."
              } else if (field === "username" && (errorText.includes("already exists") || errorText.includes("already taken"))) {
                newFieldErrors[field] = "This username is already taken. Please choose a different username."
              } else if (field === "organizationName" && (errorText.includes("already exists") || errorText.includes("already taken"))) {
                newFieldErrors[field] = "This organization name is already taken. Please choose a different name."
              } else {
                newFieldErrors[field] = errors[0] // Take first error for each field
              }
            }
          })
          
          setFieldErrors(newFieldErrors)
          
          // Show appropriate toast based on the type of error
          if (newFieldErrors.email && newFieldErrors.email.includes("already registered")) {
            toast({
              title: "Email Already Exists",
              description: "This email is already registered. Please use a different email or sign in instead.",
              variant: "destructive",
            })
          } else if (newFieldErrors.username && newFieldErrors.username.includes("already taken")) {
            toast({
              title: "Username Already Exists",
              description: "This username is already taken. Please choose a different username.",
              variant: "destructive",
            })
          } else if (newFieldErrors.organizationName && newFieldErrors.organizationName.includes("already taken")) {
            toast({
              title: "Organization Name Already Exists",
              description: "This organization name is already taken. Please choose a different name.",
              variant: "destructive",
            })
          } else {
            toast({
              title: "Registration Failed",
              description: "Please check the form for validation errors.",
              variant: "destructive",
            })
          }
          
          setError("Please check the form for validation errors.")
        } else {
          // Generic error handling
          toast({
            title: "Registration Failed",
            description: errorMessage || "Something went wrong. Please try again.",
            variant: "destructive",
          })
          setError(errorMessage || "Something went wrong. Please try again.")
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Memoize components to prevent unnecessary re-renders
  const FormField = useMemo(() => ({
    children,
    error,
  }: {
    children: React.ReactNode
    error?: string
  }) => (
    <div className="space-y-2">
      {children}
      {error && (
        <div className="flex items-center gap-1 text-sm text-red-600">
          <AlertCircle className="h-3 w-3" />
          {error}
        </div>
      )}
    </div>
  ), [])

  const PasswordStrengthIndicator = useMemo(() => () => (
    <div className="mt-2 space-y-1">
      <div className="text-xs text-gray-600 mb-1">Password requirements:</div>
      <div className="grid grid-cols-2 gap-1 text-xs">
        <div className={`flex items-center gap-1 ${passwordValidation.minLength ? "text-green-600" : "text-gray-400"}`}>
          {passwordValidation.minLength ? (
            <CheckCircle2 className="h-3 w-3" />
          ) : (
            <div className="h-3 w-3 rounded-full border border-gray-300" />
          )}
          8+ characters
        </div>
        <div className={`flex items-center gap-1 ${passwordValidation.hasUpper ? "text-green-600" : "text-gray-400"}`}>
          {passwordValidation.hasUpper ? (
            <CheckCircle2 className="h-3 w-3" />
          ) : (
            <div className="h-3 w-3 rounded-full border border-gray-300" />
          )}
          Uppercase
        </div>
        <div className={`flex items-center gap-1 ${passwordValidation.hasLower ? "text-green-600" : "text-gray-400"}`}>
          {passwordValidation.hasLower ? (
            <CheckCircle2 className="h-3 w-3" />
          ) : (
            <div className="h-3 w-3 rounded-full border border-gray-300" />
          )}
          Lowercase
        </div>
        <div className={`flex items-center gap-1 ${passwordValidation.hasNumber ? "text-green-600" : "text-gray-400"}`}>
          {passwordValidation.hasNumber ? (
            <CheckCircle2 className="h-3 w-3" />
          ) : (
            <div className="h-3 w-3 rounded-full border border-gray-300" />
          )}
          Number
        </div>
      </div>
    </div>
  ), [passwordValidation])

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
        {showTitle && (
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
              {role === "RESEARCHER" ? (
                <User className="h-6 w-6 text-blue-600" />
              ) : (
                <Building2 className="h-6 w-6 text-blue-600" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h2>
            <p className="text-gray-600">Register as {role === "RESEARCHER" ? "Researcher" : "Organization"}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-sm text-red-700 font-medium">{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField error={fieldErrors.email}>
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className={`pl-10 ${fieldErrors.email ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""}`}
                required
              />
            </div>
          </FormField>

          {role === "RESEARCHER" ? (
            <div className="grid grid-cols-2 gap-4">
              <FormField error={fieldErrors.firstName}>
                <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  placeholder="John"
                  value={(formData as ResearcherRegisterFormData).firstName}
                  onChange={handleChange}
                  className={fieldErrors.firstName ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""}
                  required
                />
              </FormField>

              <FormField error={fieldErrors.lastName}>
                <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  placeholder="Doe"
                  value={(formData as ResearcherRegisterFormData).lastName}
                  onChange={handleChange}
                  className={fieldErrors.lastName ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""}
                  required
                />
              </FormField>
            </div>
          ) : null}

          {role === "RESEARCHER" ? (
            <FormField error={fieldErrors.username}>
              <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                Username
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="johndoe"
                  value={(formData as ResearcherRegisterFormData).username}
                  onChange={handleChange}
                  className={`pl-10 ${fieldErrors.username ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""}`}
                  required
                />
              </div>
            </FormField>
          ) : (
            <>
              <FormField error={fieldErrors.organizationName}>
                <Label htmlFor="organizationName" className="text-sm font-medium text-gray-700">
                  Organization Name
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="organizationName"
                    name="organizationName"
                    type="text"
                    placeholder="Acme Research Inc."
                    value={(formData as OrganizationRegisterFormData).organizationName}
                    onChange={handleChange}
                    className={`pl-10 ${fieldErrors.organizationName ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""}`}
                    required
                  />
                </div>
              </FormField>

              <FormField error={fieldErrors.website}>
                <Label htmlFor="website" className="text-sm font-medium text-gray-700">
                  Website
                </Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  placeholder="https://your-organization.com"
                  value={(formData as OrganizationRegisterFormData).website}
                  onChange={handleChange}
                  className={fieldErrors.website ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""}
                  required
                />
              </FormField>

              <FormField error={fieldErrors.description}>
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Description
                </Label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className={`flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none ${fieldErrors.description ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""}`}
                  placeholder="Brief description about your organization..."
                  value={(formData as OrganizationRegisterFormData).description}
                  onChange={handleChange}
                  required
                />
              </FormField>
            </>
          )}

          <FormField error={fieldErrors.password}>
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
                className={`pl-10 pr-10 ${fieldErrors.password ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""}`}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
            {formData.password && <PasswordStrengthIndicator />}
          </FormField>

          <FormField error={fieldErrors.confirmPassword}>
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
              Confirm Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                className={`pl-10 pr-10 ${fieldErrors.confirmPassword ? "border-red-300 focus:border-red-500 focus:ring-red-500" : passwordsMatch ? "border-green-300 focus:border-green-500 focus:ring-green-500" : ""}`}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
              {passwordsMatch && (
                <CheckCircle2 className="absolute right-10 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
              )}
            </div>
          </FormField>

          <FormField error={fieldErrors.terms}>
            <div className="flex items-start space-x-3">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={handleTermsChange}
                  className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 focus:ring-offset-0 ${
                    fieldErrors.terms ? "border-red-300" : ""
                  }`}
                  required
                />
              </div>
              <div className="text-sm">
                <label htmlFor="terms" className="text-gray-700 cursor-pointer">
                  I agree to the{" "}
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-700 underline font-medium"
                    onClick={() => window.open("/terms-and-conditions", "_blank")}
                  >
                    Terms and Conditions
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-700 underline font-medium"
                    onClick={() => window.open("/privacy-policy", "_blank")}
                  >
                    Privacy Policy
                  </button>
                </label>
              </div>
            </div>
          </FormField>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium py-2.5 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || !passwordValidation.isValid || !passwordsMatch || !acceptTerms}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating Account...
              </div>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <button
              type="button"
              className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
              onClick={() => navigate("/login/researcher")}
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}