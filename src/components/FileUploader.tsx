
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, File } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface FileUploaderProps {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
}

export function FileUploader({ onFileSelected, disabled = false }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);
  
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (disabled) return;
    
    const files = e.dataTransfer.files;
    if (files.length) {
      handleFiles(files);
    }
  }, [disabled]);
  
  const handleFiles = (files: FileList) => {
    const file = files[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        toast.error("File is too large", {
          description: "Maximum file size is 50MB"
        });
        return;
      }
      
      onFileSelected(file);
      toast.success("File uploaded successfully", {
        description: `${file.name} (${formatFileSize(file.size)})`
      });
    }
  };
  
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };
  
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    else return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  };

  return (
    <div className="w-full">
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-10 text-center transition-colors",
          isDragging ? "border-primary bg-primary/5" : "border-border",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="rounded-full bg-secondary p-4">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Drop firmware file here</h3>
            <p className="text-sm text-muted-foreground">
              Or click to browse for files <br />
              <span className="text-xs">(Max file size: 50MB)</span>
            </p>
          </div>
          <div>
            <label htmlFor="file-upload">
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                onChange={handleFileInput}
                disabled={disabled}
              />
              <Button
                variant="secondary"
                disabled={disabled}
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <File className="mr-2 h-4 w-4" />
                Select File
              </Button>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
