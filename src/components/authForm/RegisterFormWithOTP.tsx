import { useState } from 'react';
import RegisterForm from './RegisterForm';
import OTPVerification from './OTPVerification';
import type { ResearcherRegisterFormData, OrganizationRegisterFormData } from '@/types/auth';
import type { UserRole } from '@/types/user';

interface RegisterFormWithOTPProps {
  role: UserRole;
  showTitle?: boolean;
}

export default function RegisterFormWithOTP({ role, showTitle = true }: RegisterFormWithOTPProps) {
  const [step, setStep] = useState<'register' | 'verify'>('register');
  const [registrationData, setRegistrationData] = useState<ResearcherRegisterFormData | OrganizationRegisterFormData | null>(null);

  const handleRegistrationSubmit = (data: ResearcherRegisterFormData | OrganizationRegisterFormData) => {
    // Store the registration data
    setRegistrationData(data);
    // Move to OTP verification step
    setStep('verify');
  };

  const handleOTPVerified = () => {
    // OTP verified, now complete the registration
    // The actual registration will be handled by the RegisterForm component
    // which will be called after OTP verification
    setStep('register');
  };

  const handleBackToRegistration = () => {
    setStep('register');
  };

  if (step === 'verify' && registrationData) {
    return (
      <OTPVerification
        email={registrationData.email}
        onVerified={handleOTPVerified}
        onBack={handleBackToRegistration}
      />
    );
  }

  return (
    <RegisterForm
      role={role}
      showTitle={showTitle}
      onSubmit={handleRegistrationSubmit}
    />
  );
}
