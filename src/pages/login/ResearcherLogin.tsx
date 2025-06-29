import LoginForm from "@/components/authForm/LoginForm";
import { loginResearcher } from "@/services/auth";
import { ResearcherLoginFormData } from "@/types/auth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export default function ResearcherLoginPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (data: ResearcherLoginFormData) => {
    try {
      const result = await loginResearcher(data);
      
      // Handle successful login
      if (toast) {
        toast({
          title: "Login successful!",
          description: "Welcome back!",
        });
      }
      
      // Navigate to researcher dashboard
      navigate('/researcher/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle login error
      if (toast) {
        toast({
          title: "Login failed",
          description: "Please check your credentials and try again.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <LoginForm
      onSubmit={handleSubmit}
      role="RESEARCHER"
    />
  );
}