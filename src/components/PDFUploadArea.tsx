import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText } from 'lucide-react';
import { useFilesStore } from '@/store/files';
import { pdf } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

export const PDFUploadArea = () => {
  const [isDragOver, setIsDragOver] = useState(false);
  const { addFile, updateFileStatus } = useFilesStore();

  const uploadFile = async (file: File) => {
    const fileId = `${file.name}-${Date.now()}`;
    
    // Add file to store with uploading status
    addFile({
      id: fileId,
      name: file.name,
      status: 'uploading',
    });

    try {
      // Simulate upload process
      updateFileStatus(fileId, 'processing');
      
      const response = await pdf.upload(file);
      
      updateFileStatus(fileId, 'success', response.fileId);
      toast({
        title: 'Upload successful',
        description: `${file.name} has been uploaded successfully.`,
      });
    } catch (error: any) {
      updateFileStatus(fileId, 'error', undefined, error.message || 'Upload failed');
      toast({
        title: 'Upload failed',
        description: `Failed to upload ${file.name}. Please try again.`,
        variant: 'destructive',
      });
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setIsDragOver(false);
    
    acceptedFiles.forEach((file) => {
      if (file.type === 'application/pdf') {
        uploadFile(file);
      } else {
        toast({
          title: 'Invalid file type',
          description: 'Please upload only PDF files.',
          variant: 'destructive',
        });
      }
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    multiple: true,
    onDragEnter: () => setIsDragOver(true),
    onDragLeave: () => setIsDragOver(false),
  });

  return (
    <Card className="bg-surface border-card-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <FileText className="h-5 w-5" />
          PDF Hub
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className={`upload-area ${isDragActive || isDragOver ? 'drag-over' : ''} cursor-pointer`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-4">
            <Upload className="h-12 w-12 text-muted-foreground" />
            <div className="text-center">
              <p className="text-lg font-medium text-foreground">
                {isDragActive ? 'Drop your PDFs here' : 'Drag & drop PDFs here'}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                or click to browse files
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};