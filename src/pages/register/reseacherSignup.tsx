import RegisterForm from "@/components/authForm/RegisterForm";
import { registerResearcher } from "@/services/auth";
import { ResearcherRegisterFormData } from "@/types/auth";
import { toast } from "@/hooks/use-toast";

export default function ResearcherRegisterPage() {
  const handleSubmit = async (data: ResearcherRegisterFormData) => {
    if (data.role === "RESEARCHER") {
      try {
        await registerResearcher(data);
        toast({
          variant: "success",
          title: "Registration Successful",
          description: "You have registered successfully.",
        });
      } catch (err: any) {
        if (err.response?.data?.errors) {
          err.response.data.errors.forEach(
            (e: { field: string; message: string }) => {
              toast({
                variant: "destructive",
                title: `Invalid ${e.field}`,
                description: e.message,
              });
            }
          );
        } else {
          toast({
            variant: "destructive",
            title: "Server Error",
            description: "Something went wrong. Please try again.",
          });
        }
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
        <RegisterForm onSubmit={handleSubmit} role="RESEARCHER" showTitle={true} />
      </div>
    </div>
  );
}
