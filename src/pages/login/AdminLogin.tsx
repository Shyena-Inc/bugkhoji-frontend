import LoginForm from "@/components/authForm/LoginForm";
import { loginAdmin } from "@/services/auth";

export default function AdminLoginPage() {
  return (
    <LoginForm
      onSubmit={loginAdmin}
      role="ADMIN"
    />
  );
}
