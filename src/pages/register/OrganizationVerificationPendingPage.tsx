"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  Clock,
  CheckCircle,
  FileText,
  Mail,
  Phone,
  AlertTriangle,
  ArrowRight,
  Home,
  Upload,
  MessageCircle,
  Calendar,
} from "lucide-react"

interface VerificationStatus {
  status: "pending" | "under_review" | "approved" | "rejected" | "needs_more_info"
  submittedAt: string
  estimatedCompletion: string
  documentsReceived: number
  totalDocuments: number
  lastUpdated: string
}

export default function OrganizationVerificationPendingPage() {
  const navigate = useNavigate()
  
  // Mock verification status - replace with actual API call
  const [verificationStatus] = useState<VerificationStatus>({
    status: "under_review",
    submittedAt: new Date().toISOString(),
    estimatedCompletion: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    documentsReceived: 3,
    totalDocuments: 3,
    lastUpdated: new Date().toISOString(),
  })

  const [timeElapsed, setTimeElapsed] = useState("")

  useEffect(() => {
    const updateTimeElapsed = () => {
      const submitted = new Date(verificationStatus.submittedAt)
      const now = new Date()
      const diffInHours = Math.floor((now.getTime() - submitted.getTime()) / (1000 * 60 * 60))
      
      if (diffInHours < 1) {
        setTimeElapsed("Less than an hour ago")
      } else if (diffInHours < 24) {
        setTimeElapsed(`${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`)
      } else {
        const diffInDays = Math.floor(diffInHours / 24)
        setTimeElapsed(`${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`)
      }
    }

    updateTimeElapsed()
    const interval = setInterval(updateTimeElapsed, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [verificationStatus.submittedAt])

  const getStatusInfo = () => {
    switch (verificationStatus.status) {
      case "pending":
        return {
          icon: <Clock className="h-6 w-6 text-yellow-500" />,
          title: "Documents Received",
          description: "Your verification documents are in our queue for review.",
          color: "yellow",
          progress: 25,
        }
      case "under_review":
        return {
          icon: <FileText className="h-6 w-6 text-blue-500" />,
          title: "Under Review",
          description: "Our team is currently reviewing your verification documents.",
          color: "blue",
          progress: 60,
        }
      case "approved":
        return {
          icon: <CheckCircle className="h-6 w-6 text-green-500" />,
          title: "Verification Approved",
          description: "Your organization has been successfully verified!",
          color: "green",
          progress: 100,
        }
      case "rejected":
        return {
          icon: <AlertTriangle className="h-6 w-6 text-red-500" />,
          title: "Additional Information Required",
          description: "We need additional information to complete your verification.",
          color: "red",
          progress: 30,
        }
      case "needs_more_info":
        return {
          icon: <Upload className="h-6 w-6 text-orange-500" />,
          title: "More Documents Needed",
          description: "Please upload additional documents to complete verification.",
          color: "orange",
          progress: 40,
        }
      default:
        return {
          icon: <Clock className="h-6 w-6 text-gray-500" />,
          title: "Processing",
          description: "We're processing your verification request.",
          color: "gray",
          progress: 10,
        }
    }
  }

  const statusInfo = getStatusInfo()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleGoToDashboard = () => {
    navigate("/organization/dashboard")
  }

  const handleContactSupport = () => {
    // Navigate to support page or open support modal
    navigate("/support")
  }

  const handleUploadMoreDocuments = () => {
    navigate("/organization/verification")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Status Header */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-4 pb-6">
            <div className="flex items-center justify-center">
              <div className={`h-12 w-12 bg-${statusInfo.color}-600 rounded-lg flex items-center justify-center`}>
                {statusInfo.icon}
              </div>
            </div>
            <div className="text-center space-y-2">
              <CardTitle className="text-2xl font-bold">{statusInfo.title}</CardTitle>
              <CardDescription className="text-base">
                {statusInfo.description}
              </CardDescription>
            </div>
          </CardHeader>
        </Card>

        {/* Progress Card */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Verification Progress</h3>
                <span className="text-sm text-muted-foreground">{statusInfo.progress}% Complete</span>
              </div>
              
              <Progress value={statusInfo.progress} className="h-2" />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="text-center p-3 rounded-lg bg-green-50">
                  <CheckCircle className="h-5 w-5 text-green-500 mx-auto mb-2" />
                  <p className="text-sm font-medium">Documents Submitted</p>
                  <p className="text-xs text-muted-foreground">{timeElapsed}</p>
                </div>
                
                <div className={`text-center p-3 rounded-lg ${statusInfo.progress >= 50 ? 'bg-blue-50' : 'bg-gray-50'}`}>
                  <FileText className={`h-5 w-5 mx-auto mb-2 ${statusInfo.progress >= 50 ? 'text-blue-500' : 'text-gray-400'}`} />
                  <p className="text-sm font-medium">Under Review</p>
                  <p className="text-xs text-muted-foreground">
                    {statusInfo.progress >= 50 ? 'In Progress' : 'Pending'}
                  </p>
                </div>
                
                <div className={`text-center p-3 rounded-lg ${statusInfo.progress >= 100 ? 'bg-green-50' : 'bg-gray-50'}`}>
                  <CheckCircle className={`h-5 w-5 mx-auto mb-2 ${statusInfo.progress >= 100 ? 'text-green-500' : 'text-gray-400'}`} />
                  <p className="text-sm font-medium">Approved</p>
                  <p className="text-xs text-muted-foreground">
                    {statusInfo.progress >= 100 ? 'Complete' : 'Pending'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Details */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Verification Details</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-muted-foreground">Status</span>
                <span className="font-medium capitalize">{verificationStatus.status.replace('_', ' ')}</span>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-muted-foreground">Documents Received</span>
                <span className="font-medium">{verificationStatus.documentsReceived} of {verificationStatus.totalDocuments}</span>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-muted-foreground">Submitted</span>
                <span className="font-medium">{formatDate(verificationStatus.submittedAt)}</span>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-muted-foreground">Expected Completion</span>
                <span className="font-medium">{formatDate(verificationStatus.estimatedCompletion)}</span>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">Last Updated</span>
                <span className="font-medium">{formatDate(verificationStatus.lastUpdated)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What's Next */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">What happens next?</h3>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium text-sm">Review Process</p>
                  <p className="text-xs text-muted-foreground">Our verification team will review your submitted documents within 1-2 business days.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium text-sm">Email Notification</p>
                  <p className="text-xs text-muted-foreground">You'll receive an email update once your verification status changes.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium text-sm">Full Access</p>
                  <p className="text-xs text-muted-foreground">Once approved, you'll have full access to all platform features.</p>
                </div>
              </div>
            </div>

            {/* Status-specific alerts */}
            {verificationStatus.status === "needs_more_info" && (
              <Alert className="mt-4 border-orange-200 bg-orange-50">
                <Upload className="h-4 w-4" />
                <AlertDescription>
                  We need additional documents to complete your verification. Please check your email for specific requirements.
                </AlertDescription>
              </Alert>
            )}

            {verificationStatus.status === "approved" && (
              <Alert className="mt-4 border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Congratulations! Your organization is now fully verified and has access to all platform features.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleGoToDashboard}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Home className="mr-2 h-4 w-4" />
                Go to Dashboard
              </Button>
              
              {verificationStatus.status === "needs_more_info" && (
                <Button
                  onClick={handleUploadMoreDocuments}
                  variant="outline"
                  className="flex-1"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Documents
                </Button>
              )}
              
              <Button
                onClick={handleContactSupport}
                variant="outline"
                className="flex-1"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Need Help?</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium text-sm">Email Support</p>
                  <p className="text-xs text-muted-foreground">verification@platform.com</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium text-sm">Phone Support</p>
                  <p className="text-xs text-muted-foreground">1-800-VERIFY (Mon-Fri, 9AM-5PM)</p>
                </div>
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground mt-4 text-center">
              Average response time: 4-6 hours during business hours
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}