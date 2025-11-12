import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Upload, Loader2, X } from 'lucide-react';
import api from '@/utils/api';
import { ErrorHandler, UploadRetryHandler } from '@/utils/errorHandler';

interface LogoUploadProps {
  currentLogo?: string | null;
  uploadEndpoint: string;
  onUploadSuccess?: (logoUrl: string) => void;
  fallbackText?: string;
  size?: 'sm' | 'md' | 'lg';
}

const LogoUpload = ({
  currentLogo,
  uploadEndpoint,
  onUploadSuccess,
  fallbackText = 'U',
  size = 'md',
}: LogoUploadProps) => {
  const [logo, setLogo] = useState<string | null>(currentLogo || null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const sizeClasses = {
    sm: 'h-16 w-16',
    md: 'h-24 w-24',
    lg: 'h-32 w-32',
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a JPG, PNG, SVG, or WebP image',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please upload an image smaller than 5MB',
        variant: 'destructive',
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    handleUpload(file);
  };

  const handleUpload = async (file: File) => {
    setUploading(true);

    try {
      const response = await UploadRetryHandler.uploadWithRetry(
        async () => {
          const formData = new FormData();
          formData.append('logo', file);

          return await api.post(uploadEndpoint, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
          });
        },
        {
          maxRetries: 2,
          onRetry: (attempt) => {
            console.log(`Retrying upload (attempt ${attempt})...`);
          },
        }
      );

      const logoUrl = response.data.data?.logoUrl || response.data.logoUrl;
      
      setLogo(logoUrl);
      setPreview(null);
      
      ErrorHandler.showSuccess('Success', 'Logo uploaded successfully');

      if (onUploadSuccess) {
        onUploadSuccess(logoUrl);
      }
    } catch (error: any) {
      ErrorHandler.handleUploadError(error);
      setPreview(null);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (file) {
      // Simulate file input change
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      if (fileInputRef.current) {
        fileInputRef.current.files = dataTransfer.files;
        handleFileSelect({ target: fileInputRef.current } as any);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleRemovePreview = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex items-center gap-6">
      <div
        className="relative"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <Avatar className={sizeClasses[size]}>
          <AvatarImage src={preview || logo || undefined} alt="Logo" />
          <AvatarFallback className="text-2xl bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300">
            {fallbackText}
          </AvatarFallback>
        </Avatar>
        
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        )}

        {preview && !uploading && (
          <button
            onClick={handleRemovePreview}
            className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/svg+xml,image/webp"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload Photo
            </>
          )}
        </Button>
        
        <p className="text-sm text-slate-500 mt-2">
          JPG, PNG, SVG or WebP. Max size 5MB.
        </p>
        <p className="text-xs text-slate-400 mt-1">
          Or drag and drop an image
        </p>
      </div>
    </div>
  );
};

export default LogoUpload;
