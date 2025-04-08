
import { Progress } from "@/components/ui/progress";
import { AnalysisProgress } from "@/lib/types";
import { cn } from "@/lib/utils";
import { 
  Upload, 
  Search, 
  Layers, 
  Shield, 
  FileText, 
  CheckCircle 
} from "lucide-react";

interface ProgressIndicatorProps {
  progress: AnalysisProgress;
}

export function ProgressIndicator({ progress }: ProgressIndicatorProps) {
  const steps = [
    { key: 'uploading', icon: Upload, label: 'Upload' },
    { key: 'analyzing', icon: Search, label: 'Initial Analysis' },
    { key: 'structuring', icon: Layers, label: 'Structure Mapping' },
    { key: 'scanning', icon: Shield, label: 'Vulnerability Scan' },
    { key: 'reporting', icon: FileText, label: 'Generate Report' },
    { key: 'complete', icon: CheckCircle, label: 'Complete' }
  ];
  
  const currentStepIndex = steps.findIndex(step => step.key === progress.step);
  
  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">{progress.message}</span>
        <span className="text-sm font-mono">{progress.progress}%</span>
      </div>
      
      <Progress value={progress.progress} className="h-2" />
      
      <div className="flex justify-between mt-6">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index <= currentStepIndex;
          const isCurrent = step.key === progress.step;
          
          return (
            <div 
              key={step.key} 
              className="flex flex-col items-center"
            >
              <div 
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center",
                  isActive ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground",
                  isCurrent && "animate-pulse-scan"
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <span className={cn(
                "text-xs mt-2",
                isActive ? "text-foreground" : "text-muted-foreground"
              )}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
