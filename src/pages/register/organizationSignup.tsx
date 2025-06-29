import RegisterForm from "@/components/authForm/RegisterForm";
import { registerOrganization } from "@/services/auth";
import { OrganizationRegisterFormData } from "@/types/auth"; 

export default function OrganizationRegisterPage() {
  const handleSubmit = (data: OrganizationRegisterFormData) => {
    if (data.role === 'ORGANIZATION') {
      registerOrganization(data); 
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
        <RegisterForm
          onSubmit={handleSubmit}
          role="ORGANIZATION"
          showTitle={true}
        />
      </div>
    </div>
  );
}