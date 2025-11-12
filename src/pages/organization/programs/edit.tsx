import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '../../../context/index';
import { useGetOrganizationProgram, useUpdateProgram } from '@/api/programs';
import { useToast } from '@/hooks/use-toast';
import OrganizerLayout from '@/components/OrganizationLayout';
import { Skeleton } from '@/components/ui/skeleton';

const EditProgram = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: programData, isLoading } = useGetOrganizationProgram(id!);
  const updateProgram = useUpdateProgram(id!);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    websiteName: '',
    websiteUrls: '',
    scope: '',
    outOfScope: '',
    submissionGuidelines: '',
    disclosurePolicy: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    if (programData) {
      setFormData({
        title: programData.title || '',
        description: programData.description || '',
        websiteName: programData.websiteName || '',
        websiteUrls: Array.isArray(programData.websiteUrls) 
          ? programData.websiteUrls.join('\n') 
          : '',
        scope: Array.isArray(programData.scope) 
          ? programData.scope.join('\n') 
          : '',
        outOfScope: programData.outOfScope || '',
        submissionGuidelines: programData.submissionGuidelines || '',
        disclosurePolicy: programData.disclosurePolicy || '',
        startDate: programData.startDate 
          ? new Date(programData.startDate).toISOString().split('T')[0] 
          : '',
        endDate: programData.endDate 
          ? new Date(programData.endDate).toISOString().split('T')[0] 
          : '',
      });
    }
  }, [programData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('websiteName', formData.websiteName);
      
      // Convert newline-separated strings to arrays
      const websiteUrls = formData.websiteUrls
        .split('\n')
        .map(url => url.trim())
        .filter(url => url);
      websiteUrls.forEach(url => formDataToSend.append('websiteUrls[]', url));

      const scope = formData.scope
        .split('\n')
        .map(item => item.trim())
        .filter(item => item);
      scope.forEach(item => formDataToSend.append('scope[]', item));

      if (formData.outOfScope) {
        formDataToSend.append('outOfScope', formData.outOfScope);
      }
      if (formData.submissionGuidelines) {
        formDataToSend.append('submissionGuidelines', formData.submissionGuidelines);
      }
      if (formData.disclosurePolicy) {
        formDataToSend.append('disclosurePolicy', formData.disclosurePolicy);
      }
      if (formData.startDate) {
        formDataToSend.append('startDate', formData.startDate);
      }
      if (formData.endDate) {
        formDataToSend.append('endDate', formData.endDate);
      }

      await updateProgram.mutateAsync(formDataToSend);

      toast({
        title: 'Success',
        description: 'Program updated successfully',
      });

      navigate(`/organization/programs/${id}`);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.response?.data?.message || 'Failed to update program',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <OrganizerLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-96 w-full" />
        </div>
      </OrganizerLayout>
    );
  }

  if (!programData) {
    return (
      <OrganizerLayout>
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold text-red-600">Program not found</h2>
          <Link to="/organization/programs">
            <Button className="mt-4">Back to Programs</Button>
          </Link>
        </div>
      </OrganizerLayout>
    );
  }

  return (
    <OrganizerLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to={`/organization/programs/${id}`}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Edit Program</h1>
              <p className="text-slate-600 mt-1">Update your program details</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Program Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Program Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Bug Bounty Program"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Describe your bug bounty program..."
                />
              </div>

              {/* Website Name */}
              <div className="space-y-2">
                <Label htmlFor="websiteName">Website Name *</Label>
                <Input
                  id="websiteName"
                  name="websiteName"
                  value={formData.websiteName}
                  onChange={handleChange}
                  required
                  placeholder="e.g., example.com"
                />
              </div>

              {/* Website URLs */}
              <div className="space-y-2">
                <Label htmlFor="websiteUrls">Website URLs (one per line)</Label>
                <Textarea
                  id="websiteUrls"
                  name="websiteUrls"
                  value={formData.websiteUrls}
                  onChange={handleChange}
                  rows={3}
                  placeholder="https://example.com&#10;https://app.example.com"
                />
              </div>

              {/* Scope */}
              <div className="space-y-2">
                <Label htmlFor="scope">In Scope (one per line)</Label>
                <Textarea
                  id="scope"
                  name="scope"
                  value={formData.scope}
                  onChange={handleChange}
                  rows={4}
                  placeholder="*.example.com&#10;example.com/api/*"
                />
              </div>

              {/* Out of Scope */}
              <div className="space-y-2">
                <Label htmlFor="outOfScope">Out of Scope</Label>
                <Textarea
                  id="outOfScope"
                  name="outOfScope"
                  value={formData.outOfScope}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Describe what's out of scope..."
                />
              </div>

              {/* Submission Guidelines */}
              <div className="space-y-2">
                <Label htmlFor="submissionGuidelines">Submission Guidelines</Label>
                <Textarea
                  id="submissionGuidelines"
                  name="submissionGuidelines"
                  value={formData.submissionGuidelines}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Provide guidelines for submitting vulnerabilities..."
                />
              </div>

              {/* Disclosure Policy */}
              <div className="space-y-2">
                <Label htmlFor="disclosurePolicy">Disclosure Policy</Label>
                <Textarea
                  id="disclosurePolicy"
                  name="disclosurePolicy"
                  value={formData.disclosurePolicy}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe your disclosure policy..."
                />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-4 pt-4">
                <Link to={`/organization/programs/${id}`}>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={updateProgram.isPending}>
                  {updateProgram.isPending ? (
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
            </CardContent>
          </Card>
        </form>
      </div>
    </OrganizerLayout>
  );
};

export default EditProgram;
