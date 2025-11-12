import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Building2, Mail, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import OTPVerification from '@/components/authForm/OTPVerification';
import { registerOrganization } from '@/services/auth';
import type { OrganizationRegisterFormData } from '@/types/auth';
import api from '@/utils/api';

export default function OrganizationSignupWithOTP() {
  const [step, setStep] = useState<'form' | 'otp' | 'complete'>('form');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [acceptTerms, setAcceptTerms] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<OrganizationRegisterFormData>({
    email: '',
    organizationName: '',
    website: '',
    description: '',
    password: '',
    role: 'ORGANIZATION',
    termsAccepted: false,
  });

  // Password validation
  const passwordValidation = {
    minLength: formData.password.length >= 8,
    hasUpper: /[A-Z]/.test(formData.password),
    hasLower: /[a-z]/.test(formData.password),
    hasNumber: /\d/.test(formData.password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
    get isValid() {
      return this.minLength && this.hasUpper && this.hasLower && this.hasNumber && this.hasSpecial;
    },
  };

  const passwordsMatch = formData.password === confirmPassword && confirmPassword !== '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    if (error) setError(null);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setFieldErrors({});

    // Validation
    if (formData.password !== confirmPassword) {
      setFieldErrors({ confirmPassword: 'Passwords do not match' });
      toast({
        title: 'Password Mismatch',
        description: 'Password and Confirm Password must be the same.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    if (!passwordValidation.isValid) {
      setFieldErrors({ password: 'Password does not meet requirements' });
      toast({
        title: 'Weak Password',
        description: 'Please ensure your password meets all requirements.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    if (!acceptTerms) {
      setFieldErrors({ terms: 'You must accept the terms and conditions' });
      toast({
        title: 'Terms Required',
        description: 'Please accept the terms and conditions to continue.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    try {
      // Send OTP to email
      const otpResponse = await api.post('/api/send-otp', { email: formData.email });
      
      if (otpResponse.data.success) {
        toast({
          title: 'Verification Code Sent',
          description: `We've sent a verification code to ${formData.email}`,
        });
        setStep('otp');
      }
    } catch (err: any) {
      console.error('Error sending OTP:', err);
      const errorMessage = err.response?.data?.message || 'Failed to send verification code';
      
      if (errorMessage.toLowerCase().includes('email already exists')) {
        setFieldErrors({ email: 'This email is already registered' });
        toast({
          title: 'Email Already Exists',
          description: 'This email is already registered. Please use a different email or sign in.',
          variant: 'destructive',
        });
      } else {
        setError(errorMessage);
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerified = async () => {
    setIsLoading(true);
    
    try {
      // Now register the organization after OTP verification
      const payload: OrganizationRegisterFormData = {
        ...formData,
        termsAccepted: acceptTerms,
      };
      
      await registerOrganization(payload);
      
      toast({
        title: 'Registration Successful!',
        description: 'Your organization has been registered successfully.',
      });
      
      setStep('complete');
      
      // Redirect to login or dashboard
      setTimeout(() => {
        navigate('/organization/login');
      }, 2000);
    } catch (err: any) {
      console.error('Registration error:', err);
      const errorMessage = err.response?.data?.message || 'Registration failed';
      
      toast({
        title: 'Registration Failed',
        description: errorMessage,
        variant: 'destructive',
      });
      
      // Go back to form
      setStep('form');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToForm = () => {
    setStep('form');
  };

  if (step === 'otp') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <OTPVerification
          email={formData.email}
          onVerified={handleOTPVerified}
          onBack={handleBackToForm}
        />
      </div>
    );
  }

  if (step === 'complete') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Complete!</h2>
            <p className="text-gray-600 mb-6">
              Your organization has been registered successfully. Redirecting to login...
            </p>
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Organization</h2>
            <p className="text-gray-600">Register your organization</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-700 font-medium">{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmitForm} className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="contact@organization.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`pl-10 ${fieldErrors.email ? 'border-red-300' : ''}`}
                  required
                />
              </div>
              {fieldErrors.email && (
                <div className="flex items-center gap-1 text-sm text-red-600">
                  <AlertCircle className="h-3 w-3" />
                  {fieldErrors.email}
                </div>
              )}
            </div>

            {/* Organization Name */}
            <div className="space-y-2">
              <Label htmlFor="organizationName">Organization Name</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="organizationName"
                  name="organizationName"
                  type="text"
                  placeholder="Acme Research Inc."
                  value={formData.organizationName}
                  onChange={handleChange}
                  className={`pl-10 ${fieldErrors.organizationName ? 'border-red-300' : ''}`}
                  required
                />
              </div>
              {fieldErrors.organizationName && (
                <div className="flex items-center gap-1 text-sm text-red-600">
                  <AlertCircle className="h-3 w-3" />
                  {fieldErrors.organizationName}
                </div>
              )}
            </div>

            {/* Website */}
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                type="url"
                placeholder="https://your-organization.com"
                value={formData.website}
                onChange={handleChange}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                name="description"
                rows={3}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                placeholder="Brief description about your organization..."
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {formData.password && (
                <div className="mt-2 space-y-1">
                  <div className="text-xs text-gray-600 mb-1">Password requirements:</div>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    <div className={`flex items-center gap-1 ${passwordValidation.minLength ? 'text-green-600' : 'text-gray-400'}`}>
                      {passwordValidation.minLength ? <CheckCircle2 className="h-3 w-3" /> : <div className="h-3 w-3 rounded-full border" />}
                      8+ characters
                    </div>
                    <div className={`flex items-center gap-1 ${passwordValidation.hasUpper ? 'text-green-600' : 'text-gray-400'}`}>
                      {passwordValidation.hasUpper ? <CheckCircle2 className="h-3 w-3" /> : <div className="h-3 w-3 rounded-full border" />}
                      Uppercase
                    </div>
                    <div className={`flex items-center gap-1 ${passwordValidation.hasLower ? 'text-green-600' : 'text-gray-400'}`}>
                      {passwordValidation.hasLower ? <CheckCircle2 className="h-3 w-3" /> : <div className="h-3 w-3 rounded-full border" />}
                      Lowercase
                    </div>
                    <div className={`flex items-center gap-1 ${passwordValidation.hasNumber ? 'text-green-600' : 'text-gray-400'}`}>
                      {passwordValidation.hasNumber ? <CheckCircle2 className="h-3 w-3" /> : <div className="h-3 w-3 rounded-full border" />}
                      Number
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`pl-10 pr-10 ${passwordsMatch ? 'border-green-300' : ''}`}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                {passwordsMatch && (
                  <CheckCircle2 className="absolute right-10 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
                )}
              </div>
            </div>

            {/* Terms */}
            <div className="space-y-2">
              <div className="flex items-start space-x-3">
                <input
                  id="terms"
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 mt-1"
                  required
                />
                <label htmlFor="terms" className="text-sm text-gray-700">
                  I agree to the{' '}
                  <button type="button" className="text-blue-600 hover:underline" onClick={() => window.open('/terms', '_blank')}>
                    Terms and Conditions
                  </button>{' '}
                  and{' '}
                  <button type="button" className="text-blue-600 hover:underline" onClick={() => window.open('/privacy', '_blank')}>
                    Privacy Policy
                  </button>
                </label>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !passwordValidation.isValid || !passwordsMatch || !acceptTerms}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending Verification Code...
                </div>
              ) : (
                'Continue'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                type="button"
                className="text-blue-600 hover:underline font-medium"
                onClick={() => navigate('/organization/login')}
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
