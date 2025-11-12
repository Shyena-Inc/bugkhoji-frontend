import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/index';
import OrganizationLayout from '@/components/OrganizationLayout';
import LogoUpload from '@/components/LogoUpload';
import { Building2, Save, Loader2 } from 'lucide-react';
import { useUpdateOrganizationProfile } from '@/api/profile';
import { ErrorHandler } from '@/utils/errorHandler';

const OrganizationSettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const updateProfileMutation = useUpdateOrganizationProfile();
  
  const [formData, setFormData] = useState({
    name: user?.organizationName || '',
    email: user?.email || '',
    website: '',
    description: '',
    phone: '',
    address: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || formData.name.trim().length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Organization name is required',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.email || formData.email.trim().length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Email is required',
        variant: 'destructive',
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: 'Validation Error',
        description: 'Please enter a valid email address',
        variant: 'destructive',
      });
      return;
    }

    // URL validation if website is provided
    if (formData.website && formData.website.trim().length > 0) {
      try {
        new URL(formData.website);
      } catch {
        toast({
          title: 'Validation Error',
          description: 'Please enter a valid website URL',
          variant: 'destructive',
        });
        return;
      }
    }
    
    try {
      await updateProfileMutation.mutateAsync(formData);
      
      toast({
        title: 'Settings updated',
        description: 'Your organization settings have been saved successfully',
        variant: 'default',
      });
    } catch (error: any) {
      ErrorHandler.handleApiError(error, 'Failed to update profile');
      toast({
        title: 'Error',
        description: error?.response?.data?.message || error?.message || 'Failed to update settings',
        variant: 'destructive',
      });
    }
  };

  return (
    <OrganizationLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Organization Settings
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mt-2">
            Manage your organization profile and preferences
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Organization Information
            </CardTitle>
            <CardDescription>
              Update your organization details and contact information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Logo Upload */}
              <div className="pb-6 border-b border-slate-200 dark:border-slate-700">
                <Label className="mb-4 block">Organization Logo</Label>
                <LogoUpload
                  currentLogo={user?.logo}
                  uploadEndpoint="/api/user/organization/logo"
                  fallbackText={formData.name.substring(0, 2).toUpperCase()}
                  size="lg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Organization Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter organization name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="contact@organization.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    name="website"
                    type="url"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://www.organization.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Main St, City, State, ZIP"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell us about your organization..."
                  rows={4}
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={updateProfileMutation.isPending}>
                  {updateProfileMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </OrganizationLayout>
  );
};

export default OrganizationSettings;
