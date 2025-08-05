
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

        <VulnerabilityForm onSubmit={handleFormSubmit} programs={[
    { id: "prog-1", title: "Flagforge" },
    { id: "prog-2", title: "Bugkhoji" },
    { id: "prog-3", title: "LogicLabs" },
    { id: "prog-4", title: "CodeKickStarters" }

  ]}
  submissions={[
    { id: "sub-1", title: "Previous XSS Report" },
    { id: "sub-2", title: "Auth Bypass Finding" }
  ]} />
      </div>
    </ResearcherLayout>
  );
};

export default SubmitReport;
