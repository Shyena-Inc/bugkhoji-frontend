import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { endpoints } from '@/utils/api';
import { 
  ResearcherRegisterFormData, 
  OrganizationRegisterFormData, 
} from '@/types/auth'; 
import { UserRole } from '@/types/user';

interface RegisterFormProps {
  onSubmit?: (data: ResearcherRegisterFormData | OrganizationRegisterFormData) => void;
  role: UserRole;
  showTitle?: boolean;
}

export default function RegisterForm({ 
  onSubmit, 
  role = 'RESEARCHER', 
  showTitle = true 
}: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const initialFormData = role === 'RESEARCHER' 
    ? {
        email: '',
        username: '',
        firstName: '',
        lastName: '',
        password: '',
        role: 'RESEARCHER' as const
      }
    : {
        email: '',
        organizationName: '',
        website: '',
        description: '',
        password: '',
        role: 'ORGANIZATION' as const
      };

  const [formData, setFormData] = useState<ResearcherRegisterFormData | OrganizationRegisterFormData>(initialFormData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const endpoint = role === 'RESEARCHER' 
        ? endpoints.auth.registerResearcher 
        : endpoints.auth.registerOrganization;

      // Prepare the request body according to the role
      const requestBody = role === 'RESEARCHER'
        ? {
            email: formData.email,
            username: (formData as ResearcherRegisterFormData).username,
            firstName: (formData as ResearcherRegisterFormData).firstName,
            lastName: (formData as ResearcherRegisterFormData).lastName,
            password: formData.password
          }
        : {
            email: formData.email,
            organizationName: (formData as OrganizationRegisterFormData).organizationName,
            website: (formData as OrganizationRegisterFormData).website,
            description: (formData as OrganizationRegisterFormData).description,
            password: formData.password
          };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();

      // Call the onSubmit prop if provided
      if (onSubmit) {
        onSubmit(formData);
      }

      toast({
        title: 'Registration successful!',
        description: data.message || 'Your account has been created successfully',
      });

      // Reset form after successful submission
      setFormData(initialFormData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      toast({
        title: 'Registration failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {showTitle && (
        <div>
          <h2 className="text-xl font-semibold text-center">
            Register as {role === 'RESEARCHER' ? 'Researcher' : 'Organization'}
          </h2>
        </div>
      )}

      {error && (
        <div className="p-4 text-sm text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      {role === 'RESEARCHER' ? (
        <>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="Your username"
              value={(formData as ResearcherRegisterFormData).username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="Your first name"
              value={(formData as ResearcherRegisterFormData).firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Your last name"
              value={(formData as ResearcherRegisterFormData).lastName}
              onChange={handleChange}
              required
            />
          </div>
        </>
      ) : (
        <>
          <div className="space-y-2">
            <Label htmlFor="organizationName">Organization Name</Label>
            <Input
              id="organizationName"
              name="organizationName"
              type="text"
              placeholder="Your organization name"
              value={(formData as OrganizationRegisterFormData).organizationName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              name="website"
              type="url"
              placeholder="https://your-organization.com"
              value={(formData as OrganizationRegisterFormData).website}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Brief description about your organization"
              value={(formData as OrganizationRegisterFormData).description}
              onChange={handleChange}
              required
            />
          </div>
        </>
      )}

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
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
      </div>

      <Button 
        type="submit" 
        className="w-full bg-blue-600 hover:bg-blue-700"
        disabled={isLoading}
      >
        {isLoading ? 'Registering...' : 'Register'}
      </Button>
    </form>
  );
}