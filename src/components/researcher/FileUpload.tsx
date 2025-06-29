
import { Upload } from 'lucide-react';
import { Label } from '@/components/ui/label';

const FileUpload = () => {
  return (
    <div className="space-y-2">
      <Label>Attach Files (Optional)</Label>
      <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center">
        <Upload className="mx-auto h-12 w-12 text-slate-400" />
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Drag and drop files here, or click to select
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-500">
          PNG, JPG, PDF up to 10MB
        </p>
      </div>
    </div>
  );
};

export default FileUpload;
