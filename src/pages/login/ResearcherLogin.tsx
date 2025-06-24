import LoginForm from "@/components/authForm/LoginForm";
import { loginResearcher } from "@/services/auth";

export default function ResearcherLoginPage() {
  return (
    <LoginForm
      onSubmit={loginResearcher}
      role="RESEARCHER"
    />
  );
}
