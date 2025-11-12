import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/index';
import OrganizationLayout from '@/components/OrganizationLayout';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Loader2,
  X,
  Download
} from 'lucide-react';
import api from '@/utils/api';

interface VerificationStatus {
  verified: boolean;
  verificationStatus: string;
  verificationDocuments: string[] | null;
  verificationNotes: string | null;
  verifiedAt: string | null;
}

const OrganizationVerification = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    fetchVerificationStatus();
  }, []);

  const fetchVerificationStatus = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/user/organization/verification');
      setVerificationStatus(response.data.data);
    } catch (error: any) {
      console.error('Error fetching verification status:', error);
      toast({
        title: 'Error',
        description: error?.response?.data?.message || 'Failed to fetch verification status',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      addFiles(files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      addFiles(files);
    }
  };

  const addFiles = (files: File[]) => {
    // Validate file types
    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    const validFiles = files.filter(file => {
      if (!validTypes.includes(file.type)) {
        toast({
          title: 'Invalid file type',
          description: `${file.name} is not a valid file type. Only PDF and images are allowed.`,
          variant: 'destructive',
        });
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: `${file.name} exceeds 10MB limit.`,
          variant: 'destructive',
        });
        return false;
      }
      return true;
    });

    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: 'No files selected',
        description: 'Please select at least one document to upload',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('documents', file);
      });

      const response = await api.post('/api/user/organization/verification', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast({
        title: 'Documents submitted',
        description: 'Your verification documents have been submitted successfully',
        variant: 'default',
      });

      setSelectedFiles([]);
      fetchVerificationStatus();
    } catch (error: any) {
      console.error('Error submitting documents:', error);
      toast({
        title: 'Upload failed',
        description: error?.response?.data?.message || 'Failed to upload documents',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const getStatusBadge = () => {
    if (!verificationStatus) return null;

    const status = verificationStatus.verificationStatus;
    
    if (status === 'approved' || verificationStatus.verified) {
      return (
        <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            Your organization has been verified and approved!
          </AlertDescription>
        </Alert>
      );
    }

    if (status === 'rejected') {
      return (
        <Alert className="border-red-500 bg-red-50 dark:bg-red-950">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 dark:text-red-200">
            Your verification was rejected. {verificationStatus.verificationNotes && `Reason: ${verificationStatus.verificationNotes}`}
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <Alert className="border-yellow-500 bg-yellow-50 dark:bg-yellow-950">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-800 dark:text-yellow-200">
          Your verification is pending review. You can continue using all features, but your programs won't be publicly visible until verified.
        </AlertDescription>
      </Alert>
    );
  };

  if (loading) {
    return (
      <OrganizationLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
        </div>
      </OrganizationLayout>
    );
  }

  return (
    <OrganizationLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Organization Verification
          </h1>
          <p className="text-slate-600 dark:text-slate-300 mt-2">
            Submit verification documents to get your organization approved
          </p>
        </div>

        {getStatusBadge()}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Required Documents
            </CardTitle>
            <CardDescription>
              Please upload the following documents to verify your organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-slate-700 dark:text-slate-300">
                  Business registration certificate or incorporation documents
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-slate-700 dark:text-slate-300">
                  Tax identification number (TIN) or equivalent
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-slate-700 dark:text-slate-300">
                  Proof of address (utility bill, bank statement, etc.)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-slate-700 dark:text-slate-300">
                  Authorized representative ID (passport, driver's license, etc.)
                </span>
              </li>
            </ul>

            {verificationStatus?.verificationDocuments && verificationStatus.verificationDocuments.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-3">
                  Previously Uploaded Documents
                </h3>
                <div className="space-y-2">
                  {verificationStatus.verificationDocuments.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-slate-600" />
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          Document {index + 1}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(doc, '_blank')}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                  : 'border-slate-300 dark:border-slate-700'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-700 dark:text-slate-300 mb-2">
                Drag and drop files here, or click to select
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                Supported formats: PDF, JPG, PNG (Max 10MB per file)
              </p>
              <input
                type="file"
                id="file-upload"
                className="hidden"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileSelect}
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                Select Files
              </Button>
            </div>

            {selectedFiles.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-slate-900 dark:text-white mb-3">
                  Selected Files ({selectedFiles.length})
                </h3>
                <div className="space-y-2">
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-slate-600" />
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          {file.name}
                        </span>
                        <span className="text-xs text-slate-500">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end mt-6">
              <Button
                onClick={handleSubmit}
                disabled={uploading || selectedFiles.length === 0}
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Submit Documents
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </OrganizationLayout>
  );
};

export default OrganizationVerification;
