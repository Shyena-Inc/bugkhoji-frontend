"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  AlertCircle,
  ArrowLeft,
  Building2,
  User,
  Phone,
  Globe,
  MapPin,
  FileText,
  CheckCircle,
} from "lucide-react"
import { Link } from "react-router-dom"

interface OrganizationRegisterFormData {
  // Organization Details
  organizationName: string
  organizationType: string
  website: string
  description: string

  // Address Information
  address: string
  city: string
  state: string
  zipCode: string
  country: string

  // Contact Person Details
  contactPersonName: string
  contactPersonTitle: string
  email: string
  phone: string

  // Account Security
  password: string
  confirmPassword: string

  // Agreements
  acceptTerms: boolean
  acceptPrivacy: boolean
  acceptMarketing: boolean

  role: "ORGANIZATION"
}

// Replace the mock registration function with actual API call
const registerOrganization = async (data: OrganizationRegisterFormData) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

const organizationTypes = [
  "Healthcare Institution",
  "Information Technology",
  "Research University",
  "Pharmaceutical Company",
  "Biotechnology Company",
  "Government Agency",
  "Non-Profit Organization",
  "Clinical Research Organization",
  "Medical Device Company",
  "Other",
]

const countries = ["United States","Nepal", "Canada", "United Kingdom", "Germany", "France", "Australia", "Japan", "Other"]

export default function OrganizationRegisterPage() {
  const navigate = useNavigate()
  const { toast } = useToast()

  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof OrganizationRegisterFormData, string>>>({})
  const [generalError, setGeneralError] = useState("")

  const [formData, setFormData] = useState<OrganizationRegisterFormData>({
    organizationName: "",
    organizationType: "",
    website: "",
    description: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    contactPersonName: "",
    contactPersonTitle: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
    acceptPrivacy: false,
    acceptMarketing: false,
    role: "ORGANIZATION",
  })

  const validateStep = (step: number) => {
    const newErrors: Partial<Record<keyof OrganizationRegisterFormData, string>> = {}

    if (step === 1) {
      // Organization Details
      if (!formData.organizationName.trim()) {
        newErrors.organizationName = "Organization name is required"
      }
      if (!formData.organizationType) {
        newErrors.organizationType = "Please select organization type"
      }
      if (formData.website && !/^https?:\/\/.+\..+/.test(formData.website)) {
        newErrors.website = "Please enter a valid website URL"
      }
      if (!formData.description.trim()) {
        newErrors.description = "Organization description is required"
      } else if (formData.description.length < 50) {
        newErrors.description = "Description must be at least 50 characters"
      }
    }

    if (step === 2) {
      // Contact & Address
      if (!formData.contactPersonName.trim()) {
        newErrors.contactPersonName = "Contact person name is required"
      }
      if (!formData.contactPersonTitle.trim()) {
        newErrors.contactPersonTitle = "Contact person title is required"
      }
      if (!formData.email) {
        newErrors.email = "Email is required"
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Please enter a valid email address"
      }
      if (!formData.phone.trim()) {
        newErrors.phone = "Phone number is required"
      }
      if (!formData.address.trim()) {
        newErrors.address = "Address is required"
      }
      if (!formData.city.trim()) {
        newErrors.city = "City is required"
      }
      if (!formData.country) {
        newErrors.country = "Please select a country"
      }
    }

    if (step === 3) {
      // Security & Terms
      if (!formData.password) {
        newErrors.password = "Password is required"
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters"
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
        newErrors.password = "Password must contain uppercase, lowercase, and number"
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password"
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match"
      }

      if (!formData.acceptTerms) {
        newErrors.acceptTerms = "You must accept the terms and conditions"
      }
      if (!formData.acceptPrivacy) {
        newErrors.acceptPrivacy = "You must accept the privacy policy"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
      setGeneralError("")
    }
  }

  const handleBack = () => {
    setCurrentStep(currentStep - 1)
    setGeneralError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setGeneralError("")

    if (!validateStep(3)) {
      return
    }

    setIsLoading(true)

    try {
      const result = await registerOrganization(formData)

      toast({
        title: "Registration successful!",
        description: "Your organization has been registered. Please check your email for verification.",
      })

      // Navigate to success page or login
      navigate("/organization/registration-success")
    } catch (error) {
      console.error("Registration error:", error)

      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"
      setGeneralError(errorMessage)

      toast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof OrganizationRegisterFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear field-specific error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }

    // Clear general error when user makes changes
    if (generalError) {
      setGeneralError("")
    }
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step < currentStep
                ? "bg-green-600 text-white"
                : step === currentStep
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600"
            }`}
          >
            {step < currentStep ? <CheckCircle className="h-4 w-4" /> : step}
          </div>
          {step < 3 && <div className={`w-16 h-1 mx-2 ${step < currentStep ? "bg-green-600" : "bg-gray-200"}`} />}
        </div>
      ))}
    </div>
  )

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold">Organization Information</h3>
        <p className="text-sm text-muted-foreground">Tell us about your organization</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="organizationName">Organization Name *</Label>
        <div className="relative">
          <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="organizationName"
            placeholder="Enter your organization name"
            value={formData.organizationName}
            onChange={(e) => handleInputChange("organizationName", e.target.value)}
            className={`pl-10 ${errors.organizationName ? "border-red-500" : ""}`}
          />
        </div>
        {errors.organizationName && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {errors.organizationName}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="organizationType">Organization Type *</Label>
        <Select
          value={formData.organizationType}
          onValueChange={(value) => handleInputChange("organizationType", value)}
        >
          <SelectTrigger className={errors.organizationType ? "border-red-500" : ""}>
            <SelectValue placeholder="Select organization type" />
          </SelectTrigger>
          <SelectContent>
            {organizationTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.organizationType && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {errors.organizationType}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="website">Website</Label>
        <div className="relative">
          <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="website"
            placeholder="https://www.yourorganization.com"
            value={formData.website}
            onChange={(e) => handleInputChange("website", e.target.value)}
            className={`pl-10 ${errors.website ? "border-red-500" : ""}`}
          />
        </div>
        {errors.website && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {errors.website}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Organization Description *</Label>
        <div className="relative">
          <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Textarea
            id="description"
            placeholder="Describe your organization, its mission, and research focus (minimum 50 characters)"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            className={`pl-10 min-h-[100px] ${errors.description ? "border-red-500" : ""}`}
          />
        </div>
        <div className="flex justify-between items-center">
          {errors.description ? (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.description}
            </p>
          ) : (
            <div />
          )}
          <p className="text-xs text-muted-foreground">{formData.description.length}/50 minimum</p>
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold">Contact & Address Information</h3>
        <p className="text-sm text-muted-foreground">Primary contact and location details</p>
      </div>

      {/* Contact Person */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contactPersonName">Contact Person Name *</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="contactPersonName"
              placeholder="Full name"
              value={formData.contactPersonName}
              onChange={(e) => handleInputChange("contactPersonName", e.target.value)}
              className={`pl-10 ${errors.contactPersonName ? "border-red-500" : ""}`}
            />
          </div>
          {errors.contactPersonName && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.contactPersonName}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactPersonTitle">Title/Position *</Label>
          <Input
            id="contactPersonTitle"
            placeholder="e.g., Research Director"
            value={formData.contactPersonTitle}
            onChange={(e) => handleInputChange("contactPersonTitle", e.target.value)}
            className={errors.contactPersonTitle ? "border-red-500" : ""}
          />
          {errors.contactPersonTitle && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.contactPersonTitle}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="contact@organization.com"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.email}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="phone"
              placeholder="+1 (555) 123-4567"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className={`pl-10 ${errors.phone ? "border-red-500" : ""}`}
            />
          </div>
          {errors.phone && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.phone}
            </p>
          )}
        </div>
      </div>

      {/* Address */}
      <div className="space-y-2">
        <Label htmlFor="address">Street Address *</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="address"
            placeholder="123 Research Drive"
            value={formData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            className={`pl-10 ${errors.address ? "border-red-500" : ""}`}
          />
        </div>
        {errors.address && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {errors.address}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            placeholder="City"
            value={formData.city}
            onChange={(e) => handleInputChange("city", e.target.value)}
            className={errors.city ? "border-red-500" : ""}
          />
          {errors.city && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.city}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">State/Province</Label>
          <Input
            id="state"
            placeholder="State"
            value={formData.state}
            onChange={(e) => handleInputChange("state", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="zipCode">ZIP/Postal Code</Label>
          <Input
            id="zipCode"
            placeholder="12345"
            value={formData.zipCode}
            onChange={(e) => handleInputChange("zipCode", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Country *</Label>
          <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
            <SelectTrigger className={errors.country ? "border-red-500" : ""}>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.country && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.country}
            </p>
          )}
        </div>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold">Security & Terms</h3>
        <p className="text-sm text-muted-foreground">Set up your account security and review terms</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password *</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a strong password"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            className={`pl-10 pr-10 ${errors.password ? "border-red-500" : ""}`}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </div>
        {errors.password && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {errors.password}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          Password must be at least 8 characters with uppercase, lowercase, and number
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password *</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
            className={`pl-10 pr-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </div>
        {errors.confirmPassword && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {errors.confirmPassword}
          </p>
        )}
      </div>

      {/* Terms and Conditions */}
      <div className="space-y-4 pt-4 border-t">
        <div className="space-y-3">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="acceptTerms"
              checked={formData.acceptTerms}
              onCheckedChange={(checked) => handleInputChange("acceptTerms", checked as boolean)}
              className={errors.acceptTerms ? "border-red-500" : ""}
            />
            <div className="space-y-1">
              <Label htmlFor="acceptTerms" className="text-sm cursor-pointer">
                I agree to the{" "}
                <Button variant="link" className="px-0 h-auto text-sm" asChild>
                  <Link to="/terms" target="_blank">
                    Terms and Conditions
                  </Link>
                </Button>{" "}
                *
              </Label>
              {errors.acceptTerms && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.acceptTerms}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="acceptPrivacy"
              checked={formData.acceptPrivacy}
              onCheckedChange={(checked) => handleInputChange("acceptPrivacy", checked as boolean)}
              className={errors.acceptPrivacy ? "border-red-500" : ""}
            />
            <div className="space-y-1">
              <Label htmlFor="acceptPrivacy" className="text-sm cursor-pointer">
                I agree to the{" "}
                <Button variant="link" className="px-0 h-auto text-sm" asChild>
                  <Link to="/privacy" target="_blank">
                    Privacy Policy
                  </Link>
                </Button>{" "}
                *
              </Label>
              {errors.acceptPrivacy && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.acceptPrivacy}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="acceptMarketing"
              checked={formData.acceptMarketing}
              onCheckedChange={(checked) => handleInputChange("acceptMarketing", checked as boolean)}
            />
            <Label htmlFor="acceptMarketing" className="text-sm cursor-pointer">
              I would like to receive updates about new features and research opportunities
            </Label>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Back button */}
        <div className="flex items-center">
          <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Main registration card */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-4 pb-6">
            <div className="flex items-center justify-center">
              <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <CardTitle className="text-2xl font-bold">Organization Registration</CardTitle>
              <CardDescription className="text-base">
                Join our research platform to connect with researchers worldwide
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Step Indicator */}
            {renderStepIndicator()}

            {/* General error alert */}
            {generalError && (
              <Alert variant="destructive" className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{generalError}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Render current step */}
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}

              {/* Navigation buttons */}
              <div className="flex justify-between pt-6 border-t">
                {currentStep > 1 ? (
                  <Button type="button" variant="outline" onClick={handleBack} disabled={isLoading}>
                    Back
                  </Button>
                ) : (
                  <div />
                )}

                {currentStep < 3 ? (
                  <Button type="button" onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
                    Next Step
                  </Button>
                ) : (
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      "Create Organization Account"
                    )}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Login link */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Button variant="link" className="px-0 h-auto text-sm font-medium" asChild>
              <Link to="/organization/login">Sign in</Link>
            </Button>
          </p>
        </div>
      </div>
    </div>
  )
}
