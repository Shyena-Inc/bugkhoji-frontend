import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ResearcherLayout from '@/components/ResearcherLayout';
import VulnerabilityForm from '@/components/researcher/VulnerabilityForm';
import { useGetAllPrograms } from '@/api/programs';
import { useCreateReport } from '@/api/reports';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Loader2 } from 'lucide-react';

const SubmitReport = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Fetch programs using the hook (assuming page 1 for initial load)
  const { data: programsData, isLoading: programsLoading, error } = useGetAllPrograms(1);
  
  // Use the create report mutation
  const createReportMutation = useCreateReport();

  const handleFormSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      
      // Debug: Log the original form data
      console.log('Original form data received:', formData);
      console.log('Available programs:', programsData?.programs || programsData || []);
      
      // Create a new submissionData object that matches backend expectations
      const submissionData = {
        title: formData.title,
        description: formData.description,
        content: formData.content || formData.technicalDetails || '',
        status: formData.status || 'DRAFT',
        type: formData.type || 'GENERAL', // Use GENERAL as default like your Postman example
        priority: formData.priority || formData.severity || 'MEDIUM',
        tags: formData.tags || [],
        isPublic: formData.isPublic !== undefined ? formData.isPublic : false,
        metadata: formData.metadata || {},
        attachments: formData.attachments || [],
        programId: '', // Will be set below
        submissionId: formData.submissionId || null // This will be removed if null
      };

      // Remove submissionId if it's null/undefined since your Postman example doesn't include it
      if (!submissionData.submissionId) {
        delete submissionData.submissionId;
      }
      
      const programs = programsData?.programs || programsData || [];
      
      // Handle program selection - ensure we're sending programId in correct format
      if (formData.program) {
        // If program is already an ID (check if it matches CUID format)
        const isValidCUID = /^c[a-z0-9]{24,}$/i.test(formData.program);
        
        if (isValidCUID) {
          submissionData.programId = formData.program;
        } else {
          // If program is a name, find the corresponding ID
          const selectedProgram = programs.find(p => 
            p.name === formData.program || 
            p.id === formData.program ||
            p.title === formData.program
          );
          
          if (selectedProgram) {
            submissionData.programId = selectedProgram.id;
          } else {
            console.error('Program not found:', formData.program);
            console.error('Available programs:', programs);
            throw new Error('Selected program not found');
          }
        }
      } else if (formData.programId) {
        // If programId is already provided, validate and use it
        const isValidCUID = /^c[a-z0-9]{24,}$/i.test(formData.programId);
        if (isValidCUID) {
          submissionData.programId = formData.programId;
        } else {
          throw new Error('Invalid programId format provided');
        }
      } else {
        throw new Error('No program selected');
      }

      // Ensure all required fields are present and valid
      if (!submissionData.title) {
        throw new Error('Title is required');
      }
      if (!submissionData.description) {
        throw new Error('Description is required');
      }
      if (!submissionData.programId) {
        throw new Error('Program selection is required');
      }

      // Validate enum values match exactly what backend expects
      const validStatuses = ['DRAFT', 'PUBLISHED', 'ARCHIVED', 'UNDER_REVIEW'];
      const validTypes = ['GENERAL', 'SECURITY_ANALYSIS', 'PROGRAM_REVIEW', 'SUBMISSION_REPORT', 'AUDIT_REPORT', 'COMPLIANCE_REPORT'];
      const validPriorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

      if (!validStatuses.includes(submissionData.status)) {
        submissionData.status = 'DRAFT'; // Default to DRAFT
      }
      
      if (!validTypes.includes(submissionData.type)) {
        submissionData.type = 'GENERAL'; // Default to GENERAL
      }
      
      if (!validPriorities.includes(submissionData.priority)) {
        submissionData.priority = 'MEDIUM'; // Default to MEDIUM
      }

      // Debug: Log the final submission data (matches your Postman format)
      console.log('Final submission data (should match Postman format):', submissionData);
      
      // Submit the report using the mutation
      await createReportMutation.mutateAsync(submissionData);
      
      // Success handling
      toast({
        title: "Success!",
        description: "Vulnerability report submitted successfully!",
        variant: "default",
      });
      
      // Optional: Navigate to reports list after successful submission
      setTimeout(() => {
        navigate('/researcher/reports');
      }, 1500);
      
    } catch (error) {
      // Enhanced error handling with more details
      console.error('Error submitting report:', error);
      
      // Log the full error response for debugging
      if (error?.response) {
        console.error('Error response status:', error.response.status);
        console.error('Error response data:', error.response.data);
        console.error('Error response headers:', error.response.headers);
      }
      
      // Handle different types of errors
      let errorMessage = 'Failed to submit report. Please try again.';
      
      if (error?.response?.status === 400) {
        // Handle 400 Bad Request specifically
        if (error?.response?.data?.message) {
          errorMessage = `Bad Request: ${error.response.data.message}`;
        } else if (error?.response?.data?.error) {
          errorMessage = `Bad Request: ${error.response.data.error}`;
        } else if (error?.response?.data?.errors) {
          // Handle validation errors
          const validationErrors = Array.isArray(error.response.data.errors) 
            ? error.response.data.errors.join(', ')
            : JSON.stringify(error.response.data.errors);
          errorMessage = `Validation Error: ${validationErrors}`;
        } else {
          errorMessage = 'Bad Request: Please check your input data and try again.';
        }
      } else if (error?.response?.status === 401) {
        errorMessage = 'Session expired. Please log in again.';
        navigate('/researcher/login');
        return;
      } else if (error?.response?.status === 403) {
        errorMessage = 'You do not have permission to submit reports.';
      } else if (error?.response?.status === 422) {
        errorMessage = 'Invalid data provided. Please check all required fields.';
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state for programs
  if (programsLoading) {
    return (
      <ResearcherLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Submit Vulnerability Report</h1>
            <p className="text-slate-600 dark:text-slate-300 mt-2">
              Report a security vulnerability you've discovered to help organizations improve their security.
            </p>
          </div>
          <Card>
            <CardContent className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <div className="text-slate-600 dark:text-slate-300 ml-3">Loading programs...</div>
            </CardContent>
          </Card>
        </div>
      </ResearcherLayout>
    );
  }

  // Show error state
  if (error) {
    return (
      <ResearcherLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Submit Vulnerability Report</h1>
            <p className="text-slate-600 dark:text-slate-300 mt-2">
              Report a security vulnerability you've discovered to help organizations improve their security.
            </p>
          </div>
          <Card>
            <CardContent className="flex justify-center items-center py-8">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 max-w-md">
                <div className="flex items-center text-red-600 dark:text-red-400 font-medium">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Error loading programs
                </div>
                <div className="text-red-500 dark:text-red-300 text-sm mt-1">
                  { error?.message || 'Please try refreshing the page or contact support if the issue persists.'}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </ResearcherLayout>
    );
  }

  return (
    <ResearcherLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Submit Vulnerability Report</h1>
          <p className="text-slate-600 dark:text-slate-300 mt-2">
            Report a security vulnerability you've discovered to help organizations improve their security.
          </p>
        </div>

        <VulnerabilityForm 
          onSubmit={handleFormSubmit} 
          programs={programsData?.programs || programsData || []}
          isSubmitting={isSubmitting || createReportMutation.isPending}
        />
      </div>
    </ResearcherLayout>
  );
};

export default SubmitReport;