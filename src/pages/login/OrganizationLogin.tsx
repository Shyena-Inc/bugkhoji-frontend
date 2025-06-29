import LoginForm from "@/components/authForm/LoginForm";
import { loginOrganization } from "@/services/auth";

export default function OrganizationLoginPage() {
  return (
    <LoginForm
      onSubmit={loginOrganization}
      role="ORGANIZATION"
    />
  );
}
