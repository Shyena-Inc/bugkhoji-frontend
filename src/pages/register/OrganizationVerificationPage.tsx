"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import {
  Upload,
  FileText,
  Building2,
  AlertCircle,
  CheckCircle,
  X,
  Loader2,
  Shield,
  Clock,
  ArrowRight,
} from "lucide-react"

interface VerificationDocument {
  id: string
  name: string
  file: File | null
  uploaded: boolean
  required: boolean
}

interface OrganizationVerificationData {
  businessLicense: File | null
  taxDocument: File | null
  incorporationCertificate: File | null
  additionalDocuments: File[]
}

export default function OrganizationVerificationPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  
  const [isLoading, setIsLoading] = useState(false)
  const [generalError, setGeneralError] = useState("")
  
  const [documents, setDocuments] = useState<VerificationDocument[]>([
    {
      id: "business_license",
      name: "Business License",
      file: null,
      uploaded: false,
      required: true,
    },
    {
      id: "tax_document",
      name: "Tax Registration Certificate",
      file: null,
      uploaded: false,
      required: true,
    },
    {
      id: "incorporation",
      name: "Certificate of Incorporation",
      file: null,
      uploaded: false,
      required: true,
    },
  ])

  const [additionalFiles, setAdditionalFiles] = useState<File[]>([])

  const handleFileUpload = (documentId: string, file: File) => {
    // Validate file type and size
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"]
    const maxSize = 10 * 1024 * 1024 // 10MB

    if (!allowedTypes.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Invalid File Type",
        description: "Please upload PDF, JPEG, or PNG files only.",
      })
      return
    }

    if (file.size > maxSize) {
      toast({
        variant: "destructive",
        title: "File Too Large",
        description: "File size must be less than 10MB.",
      })
      return
    }

    setDocuments(prev =>
      prev.map(doc =>
        doc.id === documentId
          ? { ...doc, file, uploaded: true }
          : doc
      )
    )

    toast({
      variant: "success",
      title: "File Uploaded",
      description: `${file.name} has been uploaded successfully.`,
    })
  }

  const handleRemoveFile = (documentId: string) => {
    setDocuments(prev =>
      prev.map(doc =>
        doc.id === documentId
          ? { ...doc, file: null, uploaded: false }
          : doc
      )
    )
  }

  const handleAdditionalFileUpload = (file: File) => {
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/jpg"]
    const maxSize = 10 * 1024 * 1024 // 10MB

    if (!allowedTypes.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Invalid File Type",
        description: "Please upload PDF, JPEG, or PNG files only.",
      })
      return
    }

    if (file.size > maxSize) {
      toast({
        variant: "destructive",
        title: "File Too Large",
        description: "File size must be less than 10MB.",
      })
      return
    }

    setAdditionalFiles(prev => [...prev, file])
    
    toast({
      variant: "success",
      title: "Additional Document Added",
      description: `${file.name} has been added.`,
    })
  }

  const handleRemoveAdditionalFile = (index: number) => {
    setAdditionalFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    setGeneralError("")
    
    // Check if all required documents are uploaded
    const missingRequired = documents.filter(doc => doc.required && !doc.uploaded)
    if (missingRequired.length > 0) {
      setGeneralError("Please upload all required documents before submitting.")
      return
    }

    setIsLoading(true)

    try {
      // Create FormData for file uploads
      const formData = new FormData()
      
      documents.forEach(doc => {
        if (doc.file) {
          formData.append(doc.id, doc.file)
        }
      })
      
      additionalFiles.forEach((file, index) => {
        formData.append(`additional_${index}`, file)
      })

      // Here you would make the API call to submit verification documents
      // const response = await submitVerificationDocuments(formData)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      toast({
        variant: "success",
        title: "Documents Submitted Successfully",
        description: "Your verification documents have been submitted for review.",
      })

      // Navigate to pending verification page
      navigate("/organization/verification-pending")
      
    } catch (error) {
      console.error("Verification submission error:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to submit documents"
      setGeneralError(errorMessage)
      
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "Failed to submit verification documents. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSkipForNow = () => {
    navigate("/organization/dashboard")
  }

  const allRequiredUploaded = documents.filter(doc => doc.required).every(doc => doc.uploaded)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-4 pb-6">
            <div className="flex items-center justify-center">
              <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <CardTitle className="text-2xl font-bold">Organization Verification</CardTitle>
              <CardDescription className="text-base">
                Upload verification documents to complete your registration
              </CardDescription>
            </div>
          </CardHeader>
        </Card>

        {/* Verification Status */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="h-5 w-5 text-orange-500" />
              <h3 className="text-lg font-semibold">Verification Required</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              To ensure the security and authenticity of our platform, all organizations must verify their identity by uploading official documents.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">What happens next?</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Your documents will be reviewed within 1-2 business days</li>
                <li>• You'll receive an email notification once approved</li>
                <li>• Full platform access will be granted after verification</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Document Upload Section */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl">Required Documents</CardTitle>
            <CardDescription>
              Please upload clear, high-quality images or PDFs of the following documents
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* General error alert */}
            {generalError && (
              <Alert variant="destructive" className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{generalError}</AlertDescription>
              </Alert>
            )}

            {/* Required Documents */}
            <div className="space-y-4">
              {documents.map((document) => (
                <div key={document.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <Label className="font-medium">{document.name}</Label>
                      {document.required && (
                        <span className="text-red-500 text-sm">*</span>
                      )}
                    </div>
                    {document.uploaded && (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFile(document.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  {document.uploaded && document.file ? (
                    <div className="bg-green-50 p-3 rounded border border-green-200">
                      <p className="text-sm text-green-800">
                        Uploaded: {document.file.name}
                      </p>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      <div className="text-center">
                        <Upload className="mx-auto h-8 w-8 text-gray-400" />
                        <div className="mt-2">
                          <Input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                handleFileUpload(document.id, file)
                              }
                            }}
                            className="hidden"
                            id={`upload-${document.id}`}
                          />
                          <Label
                            htmlFor={`upload-${document.id}`}
                            className="cursor-pointer text-blue-600 hover:text-blue-500"
                          >
                            Click to upload or drag and drop
                          </Label>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          PDF, PNG, JPG up to 10MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Additional Documents Section */}
            <div className="border-t pt-6">
              <h4 className="font-medium mb-3">Additional Documents (Optional)</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Upload any additional documents that may help verify your organization
              </p>
              
              {/* Additional files list */}
              {additionalFiles.length > 0 && (
                <div className="space-y-2 mb-4">
                  {additionalFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm">{file.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveAdditionalFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-2 border-dashed border-gray-200 rounded-lg p-4">
                <div className="text-center">
                  <Upload className="mx-auto h-6 w-6 text-gray-400" />
                  <div className="mt-2">
                    <Input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          handleAdditionalFileUpload(file)
                        }
                      }}
                      className="hidden"
                      id="upload-additional"
                    />
                    <Label
                      htmlFor="upload-additional"
                      className="cursor-pointer text-blue-600 hover:text-blue-500 text-sm"
                    >
                      Add additional document
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
              <Button
                onClick={handleSubmit}
                disabled={!allRequiredUploaded || isLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit for Verification
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            
            </div>

            <p className="text-xs text-muted-foreground text-center">
              You can upload documents later from your organization dashboard
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}