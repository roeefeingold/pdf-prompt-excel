import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFilesStore } from '@/store/files';
import { report } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { FileSpreadsheet, Loader2 } from 'lucide-react';

export const ReportGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const getSuccessfulFiles = useFilesStore((state) => state.getSuccessfulFiles);
  const successfulFiles = getSuccessfulFiles();
  const hasUploadedFiles = successfulFiles.length > 0;

  const handleGenerateReport = async () => {
    if (!prompt.trim()) {
      toast({
        title: 'Prompt required',
        description: 'Please describe your desired Excel report.',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);

    try {
      const blob = await report.generate(prompt);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `report-${Date.now()}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: 'Report generated',
        description: 'Your Excel report has been downloaded successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Generation failed',
        description: 'Failed to generate report. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="bg-surface border-card-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <FileSpreadsheet className="h-5 w-5" />
          Generate Excel Report
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="prompt">Describe your desired Excel report</Label>
          <Textarea
            id="prompt"
            placeholder="Example: Create a summary table with key data points from all uploaded PDFs, including dates, amounts, and categories..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[100px] bg-input border-input-border"
            disabled={isGenerating}
          />
        </div>
        
        <Button
          onClick={handleGenerateReport}
          disabled={!hasUploadedFiles || isGenerating || !prompt.trim()}
          className="w-full bg-primary hover:bg-primary-hover text-primary-foreground"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Report...
            </>
          ) : (
            <>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Generate Excel Report
            </>
          )}
        </Button>
        
        {!hasUploadedFiles && (
          <p className="text-sm text-muted-foreground text-center">
            Upload at least one PDF to enable report generation
          </p>
        )}
      </CardContent>
    </Card>
  );
};