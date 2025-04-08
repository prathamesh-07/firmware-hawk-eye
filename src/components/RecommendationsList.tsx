
import { FirmwareReport } from "@/lib/types";
import { Check } from "lucide-react";

interface RecommendationsListProps {
  report: FirmwareReport;
}

export function RecommendationsList({ report }: RecommendationsListProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Security Recommendations</h3>
      
      <div className="space-y-2">
        {report.recommendations.map((recommendation, index) => (
          <div 
            key={index}
            className="flex items-start p-3 border rounded-md border-border bg-secondary/20"
          >
            <div className="mt-0.5 mr-3 p-1 bg-primary rounded-full">
              <Check className="h-3 w-3 text-primary-foreground" />
            </div>
            <p className="text-sm">{recommendation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
