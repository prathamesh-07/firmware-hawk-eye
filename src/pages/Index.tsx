
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  AlertTriangle, 
  AlertCircle, 
  Layers,
  ClipboardCheck,
  Download
} from "lucide-react";
import { FileUploader } from "@/components/FileUploader";
import { ProgressIndicator } from "@/components/ProgressIndicator";
import { VulnerabilityCard } from "@/components/VulnerabilityCard";
import { IssueCard } from "@/components/IssueCard";
import { StructureVisualizer } from "@/components/StructureVisualizer";
import { ReportHeader } from "@/components/ReportHeader";
import { RecommendationsList } from "@/components/RecommendationsList";
import { firmwareAnalyzer } from "@/lib/analyzer";
import { FirmwareReport, AnalysisProgress } from "@/lib/types";
import { toast } from "sonner";

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState<AnalysisProgress>({
    step: 'uploading',
    progress: 0,
    message: 'Ready to analyze firmware'
  });
  const [report, setReport] = useState<FirmwareReport | null>(null);
  const [activeTab, setActiveTab] = useState('vulnerabilities');

  useEffect(() => {
    // Register progress callback
    const unsubscribe = firmwareAnalyzer.onProgress(progress => {
      setAnalysisProgress(progress);
      if (progress.step === 'complete') {
        setIsAnalyzing(false);
      }
    });
    
    return unsubscribe;
  }, []);

  const handleFileSelected = (file: File) => {
    setSelectedFile(file);
    setReport(null);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    
    setIsAnalyzing(true);
    try {
      const result = await firmwareAnalyzer.analyzeFirmware(selectedFile);
      setReport(result);
      toast.success("Analysis complete", {
        description: `${result.vulnerabilities.length} vulnerabilities found.`
      });
    } catch (error) {
      console.error("Analysis failed:", error);
      toast.error("Analysis failed", {
        description: "There was an error analyzing the firmware file."
      });
      setIsAnalyzing(false);
    }
  };

  const handleExport = () => {
    if (!report) return;
    
    // Create a JSON blob and trigger download
    const reportJson = JSON.stringify(report, null, 2);
    const blob = new Blob([reportJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `firmware-analysis-${report.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Report exported", {
      description: "Report has been downloaded as JSON"
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container px-4 py-8 mx-auto">
        <header className="mb-8 text-center">
          <div className="inline-flex items-center justify-center p-2 mb-4 bg-primary/10 rounded-full">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Firmware HawkEye</h1>
          <p className="mt-2 text-muted-foreground">
            Analyze firmware files for security vulnerabilities and potential issues
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="md:col-span-3">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Upload Firmware</h2>
                  <FileUploader 
                    onFileSelected={handleFileSelected} 
                    disabled={isAnalyzing}
                  />
                  <Button 
                    className="w-full" 
                    size="lg" 
                    disabled={!selectedFile || isAnalyzing} 
                    onClick={handleAnalyze}
                  >
                    <Shield className="mr-2 h-5 w-5" />
                    {isAnalyzing ? "Analyzing..." : "Analyze Firmware"}
                  </Button>
                </div>
                
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Analysis Progress</h2>
                  <ProgressIndicator progress={analysisProgress} />
                  
                  {selectedFile && (
                    <div className="p-4 border rounded-md bg-secondary/30">
                      <div className="text-sm">
                        <div className="font-medium">Selected File:</div>
                        <div className="mt-1 font-mono text-muted-foreground">
                          {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {report && (
            <div className="md:col-span-3 space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Analysis Report</h2>
                <Button variant="outline" onClick={handleExport}>
                  <Download className="mr-2 h-4 w-4" />
                  Export Report
                </Button>
              </div>
              
              <ReportHeader report={report} />
              
              <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 mb-6">
                  <TabsTrigger value="vulnerabilities" className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Vulnerabilities</span>
                    <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-destructive/20 text-destructive">
                      {report.vulnerabilities.length}
                    </span>
                  </TabsTrigger>
                  <TabsTrigger value="issues" className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    <span>Potential Issues</span>
                    <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-security-info/20 text-security-info">
                      {report.potentialIssues.length}
                    </span>
                  </TabsTrigger>
                  <TabsTrigger value="structure" className="flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    <span>Structure</span>
                  </TabsTrigger>
                  <TabsTrigger value="recommendations" className="flex items-center gap-2">
                    <ClipboardCheck className="h-4 w-4" />
                    <span>Recommendations</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="vulnerabilities" className="mt-0">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Detected Vulnerabilities 
                      <span className="ml-2 text-destructive">
                        ({report.vulnerabilities.length})
                      </span>
                    </h3>
                    {report.vulnerabilities.length > 0 ? (
                      <div className="grid gap-4">
                        {report.vulnerabilities.map((vulnerability) => (
                          <VulnerabilityCard 
                            key={vulnerability.id} 
                            vulnerability={vulnerability} 
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center border rounded-md">
                        <p className="text-muted-foreground">No vulnerabilities detected.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="issues" className="mt-0">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Potential Issues
                      <span className="ml-2 text-security-info">
                        ({report.potentialIssues.length})
                      </span>
                    </h3>
                    {report.potentialIssues.length > 0 ? (
                      <div className="grid md:grid-cols-2 gap-4">
                        {report.potentialIssues.map((issue) => (
                          <IssueCard key={issue.id} issue={issue} />
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center border rounded-md">
                        <p className="text-muted-foreground">No potential issues detected.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="structure" className="mt-0">
                  <StructureVisualizer report={report} />
                </TabsContent>
                
                <TabsContent value="recommendations" className="mt-0">
                  <RecommendationsList report={report} />
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
