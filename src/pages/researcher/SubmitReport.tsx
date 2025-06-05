
import ResearcherLayout from '@/components/ResearcherLayout';
import VulnerabilityForm from '@/components/researcher/VulnerabilityForm';

const SubmitReport = () => {
  const handleFormSubmit = (formData: any) => {
    // Here you would typically send the data to your backend
    console.log('Report submitted:', formData);
  };

  return (
    <ResearcherLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Submit Vulnerability Report</h1>
          <p className="text-slate-600 dark:text-slate-300 mt-2">
            Report a security vulnerability you've discovered to help organizations improve their security.
          </p>
        </div>

        <VulnerabilityForm onSubmit={handleFormSubmit} />
      </div>
    </ResearcherLayout>
  );
};

export default SubmitReport;
