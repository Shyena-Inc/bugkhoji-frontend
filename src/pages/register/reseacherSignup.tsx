import RegisterForm from "@/components/authForm/RegisterForm";
import { registerResearcher } from "@/services/auth";
import { ResearcherRegisterFormData} from "@/types/auth"; 

export default function ResearcherRegisterPage() {
  const handleSubmit = (data: ResearcherRegisterFormData) => {
    if (data.role === 'RESEARCHER') {
      registerResearcher(data); 
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
        <RegisterForm
          onSubmit={handleSubmit}
          role="RESEARCHER"
          showTitle={true}
        />
      </div>
    </div>
  );
}