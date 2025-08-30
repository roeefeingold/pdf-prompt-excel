import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFilesStore } from '@/store/files';
import { FileText, Loader2, CheckCircle, XCircle } from 'lucide-react';

export const FileList = () => {
  const files = useFilesStore((state) => state.files);

  if (files.length === 0) {
    return null;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploading':
        return <Loader2 className="h-4 w-4 animate-spin text-warning" />;
      case 'processing':
        return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'uploading':
        return 'Uploading...';
      case 'processing':
        return 'Processing...';
      case 'success':
        return 'Uploaded ✅';
      case 'error':
        return 'Failed ❌';
      default:
        return 'Unknown';
    }
  };

  return (
    <Card className="bg-surface border-card-border">
      <CardHeader>
        <CardTitle className="text-foreground">Uploaded Files</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-3 rounded-lg border border-border bg-background"
            >
              <div className="flex items-center space-x-3">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">{file.name}</p>
                  {file.error && (
                    <p className="text-sm text-destructive">{file.error}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(file.status)}
                <span className={`text-sm file-status-${file.status}`}>
                  {getStatusText(file.status)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};