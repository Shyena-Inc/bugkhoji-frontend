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
      
      // Submit the report using the mutation
      await createReportMutation.mutateAsync(formData);
      
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
      // Error handling
      console.error('Error submitting report:', error);
      
      // Handle different types of errors
      let errorMessage = 'Failed to submit report. Please try again.';
      
      if (error?.response?.status === 401) {
        errorMessage = 'Session expired. Please log in again.';
        navigate('/researcher/login');
        return;
      } else if (error?.response?.status === 403) {
        errorMessage = 'You do not have permission to submit reports.';
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