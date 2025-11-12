import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Plus, 
  X, 
  Save, 
  ArrowLeft, 
  Calendar,
  DollarSign,
  Globe,
  Shield,
  AlertTriangle,
  Info,
  Image as ImageIcon,
  Link as LinkIcon
} from "lucide-react";
import { useCreateProgram, useUploadProgramLogoFromUrl } from "@/api/programs";
import LogoUpload from "@/components/LogoUpload";
import { useToast } from "@/hooks/use-toast";

// TypeScript interfaces
interface RewardRange {
  min: string;
  max: string;
}

interface FormData {
  title: string;
  software_name: string;
  websiteName: string;
  description: string;
  scope: string[];
  rewards: {
    critical: RewardRange;
    high: RewardRange;
    medium: RewardRange;
    low: RewardRange;
  };
  submission_guidelines: string;
  disclosure_policy: string;
  start_date: string;
  end_date: string;
  logo?: string;
  logoUrl?: string;
}

interface ValidationErrors {
  [key: string]: string;
}

const CreateProgram: React.FC = () => {
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [createdProgramId, setCreatedProgramId] = useState<string | null>(null);
  const [logoUrlInput, setLogoUrlInput] = useState<string>('');
  const [fetchingLogo, setFetchingLogo] = useState<boolean>(false);
  const createProgramMutation = useCreateProgram();
  const { toast } = useToast();

  // Form state with TypeScript
  const [formData, setFormData] = useState<FormData>({
    title: '',
    software_name: '',
    websiteName: '',
    description: '',
    scope: [],
    rewards: {
      critical: { min: '', max: '' },
      high: { min: '', max: '' },
      medium: { min: '', max: '' },
      low: { min: '', max: '' }
    },
    submission_guidelines: '',
    disclosure_policy: '',
    start_date: '',
    end_date: ''
  });

  const [currentScopeItem, setCurrentScopeItem] = useState<string>('');
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Form handlers with TypeScript
  const handleInputChange = (field: keyof FormData, value: string): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleRewardChange = (severity: keyof FormData['rewards'], type: keyof RewardRange, value: string): void => {
    setFormData(prev => ({
      ...prev,
      rewards: {
        ...prev.rewards,
        [severity]: { ...prev.rewards[severity], [type]: value }
      }
    }));
  };

  // Scope management with TypeScript
  const addScopeItem = (): void => {
    if (currentScopeItem.trim()) {
      setFormData(prev => ({
        ...prev,
        scope: [...prev.scope, currentScopeItem.trim()]
      }));
      setCurrentScopeItem('');
    }
  };

  const removeScopeItem = (index: number): void => {
    setFormData(prev => ({
      ...prev,
      scope: prev.scope.filter((_, i) => i !== index)
    }));
  };

  // Form validation with TypeScript
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.software_name.trim()) newErrors.software_name = 'Software name is required';
    if (!formData.websiteName.trim()) newErrors.websiteName = 'Website name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.scope.length === 0) newErrors.scope = 'At least one scope item is required';
    if (!formData.submission_guidelines.trim()) newErrors.submission_guidelines = 'Submission guidelines are required';
    if (!formData.disclosure_policy.trim()) newErrors.disclosure_policy = 'Disclosure policy is required';
    if (!formData.start_date) newErrors.start_date = 'Start date is required';
    if (!formData.end_date) newErrors.end_date = 'End date is required';

    // Validate reward ranges
    Object.keys(formData.rewards).forEach(severity => {
      const severityKey = severity as keyof FormData['rewards'];
      const reward = formData.rewards[severityKey];
      if (!reward.min || !reward.max) {
        newErrors[`rewards_${severity}`] = `${severity} reward range is required`;
      } else if (parseFloat(reward.min) >= parseFloat(reward.max)) {
        newErrors[`rewards_${severity}`] = `${severity} minimum must be less than maximum`;
      }
    });

    // Validate dates
    if (formData.start_date && formData.end_date) {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      if (startDate >= endDate) {
        newErrors.end_date = 'End date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler with TypeScript
  const handleSubmit = (): void => {
    if (!validateForm()) return;

    // Format rewards to match your JSON structure: "min-max" strings
    const formattedRewards: Record<string, string> = {};
    Object.keys(formData.rewards).forEach((severity) => {
      const severityKey = severity as keyof FormData['rewards'];
      const reward = formData.rewards[severityKey];
      formattedRewards[severity] = `${reward.min}-${reward.max}`;
    });

    // Create the program data object (not FormData yet)
    const programData = {
      title: formData.title,
      software_name: formData.software_name,
      websiteName: formData.websiteName,
      description: formData.description,
      scope: formData.scope,
      rewards: formattedRewards, // This should be: { critical: "2000-7000", high: "1000-2000", ... }
      submission_guidelines: formData.submission_guidelines,
      disclosure_policy: formData.disclosure_policy,
      start_date: new Date(formData.start_date).toISOString(),
      end_date: new Date(formData.end_date).toISOString()
    };

    // Send as JSON, not FormData
    createProgramMutation.mutate(programData as any, {
      onSuccess: (response) => {
        const programId = response?.program?.id;
        setCreatedProgramId(programId);
        setShowSuccess(true);
      },
      onError: (error: any) => {
        console.error('Failed to create program:', error);
        console.error('Response data:', error?.response?.data);
      }
    });
  };

  const handleFetchLogoFromUrl = async () => {
    if (!logoUrlInput.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter a website URL to fetch the logo",
        variant: "destructive"
      });
      return;
    }

    if (!createdProgramId) {
      toast({
        title: "Program Not Created",
        description: "Please create the program first before fetching logo",
        variant: "destructive"
      });
      return;
    }

    setFetchingLogo(true);
    try {
      const response = await fetch(`/api/v1/programs/${createdProgramId}/logo-from-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ websiteUrl: logoUrlInput })
      });

      const data = await response.json();

      if (response.ok) {
        setFormData(prev => ({ ...prev, logo: data.logoUrl }));
        toast({
          title: "Success",
          description: "Logo fetched successfully from website",
        });
      } else {
        toast({
          title: "Failed to Fetch Logo",
          description: data.message || "Could not fetch logo from the website. Please upload manually.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error fetching logo:', error);
      toast({
        title: "Error",
        description: "Failed to fetch logo from website. Please upload manually.",
        variant: "destructive"
      });
    } finally {
      setFetchingLogo(false);
    }
  };

  const severityConfig: Record<string, { icon: React.ComponentType<{ className?: string }> }> = {
    critical: { icon: AlertTriangle },
    high: { icon: Shield },
    medium: { icon: Info },
    low: { icon: Shield }
  };

  // Success view
  if (showSuccess) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                <Save className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium">Program Created Successfully!</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Your bug bounty program has been created and is ready to engage security researchers.
              </p>
              <Button onClick={() => window.history.back()}>
                Back to Programs
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Programs
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Create New Program
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mt-1">
            Set up a new bug bounty program to engage security researchers
          </p>
        </div>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Program Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Presidential Graduate School"
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="software_name">Software Name *</Label>
              <Input
                id="software_name"
                value={formData.software_name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('software_name', e.target.value)}
                placeholder="e.g., Presidential Graduate School Platform"
                className={errors.software_name ? 'border-red-500' : ''}
              />
              {errors.software_name && <p className="text-sm text-red-500">{errors.software_name}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="websiteName">Website Name *</Label>
            <Input
              id="websiteName"
              value={formData.websiteName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('websiteName', e.target.value)}
              placeholder="e.g., presidential.edu.np"
              className={errors.websiteName ? 'border-red-500' : ''}
            />
            {errors.websiteName && <p className="text-sm text-red-500">{errors.websiteName}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('description', e.target.value)}
              placeholder="Describe what this program is about..."
              rows={4}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Program Logo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Program Logo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {createdProgramId ? (
            <>
              <LogoUpload
                currentLogo={formData.logo}
                uploadEndpoint={`/api/v1/programs/${createdProgramId}/logo`}
                onUploadSuccess={(logoUrl) => setFormData(prev => ({ ...prev, logo: logoUrl }))}
                fallbackText="P"
                size="lg"
              />
              
              <div className="border-t pt-4">
                <Label htmlFor="logoUrl" className="flex items-center gap-2 mb-2">
                  <LinkIcon className="h-4 w-4" />
                  Or Fetch Logo from Website URL
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="logoUrl"
                    value={logoUrlInput}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLogoUrlInput(e.target.value)}
                    placeholder="https://example.com"
                    disabled={fetchingLogo}
                  />
                  <Button
                    type="button"
                    onClick={handleFetchLogoFromUrl}
                    disabled={fetchingLogo || !logoUrlInput.trim()}
                  >
                    {fetchingLogo ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Fetching...
                      </>
                    ) : (
                      'Fetch Logo'
                    )}
                  </Button>
                </div>
                <p className="text-sm text-slate-500 mt-2">
                  We'll try to automatically fetch the logo from the website
                </p>
              </div>
            </>
          ) : (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Create the program first, then you can upload a logo
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Program Scope */}
      <Card>
        <CardHeader>
          <CardTitle>Program Scope</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={currentScopeItem}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentScopeItem(e.target.value)}
              placeholder="Add scope item (e.g., main website: example.com)"
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && (e.preventDefault(), addScopeItem())}
            />
            <Button type="button" onClick={addScopeItem} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {formData.scope.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.scope.map((item: string, index: number) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {item}
                  <button
                    type="button"
                    onClick={() => removeScopeItem(index)}
                    className="ml-1 hover:bg-red-100 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {errors.scope && <p className="text-sm text-red-500">{errors.scope}</p>}
        </CardContent>
      </Card>

      {/* Reward Structure */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Reward Structure
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.keys(formData.rewards).map((severity: string) => {
              const severityKey = severity as keyof FormData['rewards'];
              const config = severityConfig[severity];
              const IconComponent = config.icon;
              
              return (
                <div key={severity} className="space-y-2">
                  <Label className="flex items-center gap-2 capitalize">
                    <IconComponent className="h-4 w-4" />
                    {severity} Severity
                  </Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      type="number"
                      value={formData.rewards[severityKey].min}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleRewardChange(severityKey, 'min', e.target.value)}
                      placeholder="Min"
                      min="0"
                      className="flex-1"
                    />
                    <span className="text-slate-500">to</span>
                    <Input
                      type="number"
                      value={formData.rewards[severityKey].max}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleRewardChange(severityKey, 'max', e.target.value)}
                      placeholder="Max"
                      min="0"
                      className="flex-1"
                    />
                  </div>
                  {errors[`rewards_${severity}`] && (
                    <p className="text-sm text-red-500">{errors[`rewards_${severity}`]}</p>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Guidelines & Policies */}
      <Card>
        <CardHeader>
          <CardTitle>Guidelines & Policies</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="submission_guidelines">Submission Guidelines *</Label>
            <Textarea
              id="submission_guidelines"
              value={formData.submission_guidelines}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('submission_guidelines', e.target.value)}
              placeholder="Describe how researchers should submit vulnerabilities..."
              rows={3}
              className={errors.submission_guidelines ? 'border-red-500' : ''}
            />
            {errors.submission_guidelines && (
              <p className="text-sm text-red-500">{errors.submission_guidelines}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="disclosure_policy">Disclosure Policy *</Label>
            <Textarea
              id="disclosure_policy"
              value={formData.disclosure_policy}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('disclosure_policy', e.target.value)}
              placeholder="Describe your responsible disclosure policy..."
              rows={3}
              className={errors.disclosure_policy ? 'border-red-500' : ''}
            />
            {errors.disclosure_policy && (
              <p className="text-sm text-red-500">{errors.disclosure_policy}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Program Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Program Timeline
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date *</Label>
              <Input
                id="start_date"
                type="datetime-local"
                value={formData.start_date}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('start_date', e.target.value)}
                className={errors.start_date ? 'border-red-500' : ''}
              />
              {errors.start_date && <p className="text-sm text-red-500">{errors.start_date}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date">End Date *</Label>
              <Input
                id="end_date"
                type="datetime-local"
                value={formData.end_date}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('end_date', e.target.value)}
                className={errors.end_date ? 'border-red-500' : ''}
              />
              {errors.end_date && <p className="text-sm text-red-500">{errors.end_date}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => window.history.back()}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={createProgramMutation.isPending}
          className="min-w-32"
        >
          {createProgramMutation.isPending ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Creating...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Create Program
            </>
          )}
        </Button>
      </div>

      {/* Error Alert */}
      {createProgramMutation.isError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {createProgramMutation.error?.response?.data?.message || 'Failed to create program'}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default CreateProgram;