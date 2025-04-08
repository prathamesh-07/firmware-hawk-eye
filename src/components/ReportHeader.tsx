
import { FirmwareReport } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { FileText, Calendar, HardDrive, BarChart2 } from "lucide-react";
import { ScoreIndicator } from "./ScoreIndicator";

interface ReportHeaderProps {
  report: FirmwareReport;
}

export function ReportHeader({ report }: ReportHeaderProps) {
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    else return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                {report.fileName}
              </h2>
              <p className="text-muted-foreground mt-1">
                {report.fileType || "Unknown Firmware Type"}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Analyzed on {format(report.analysisDate, "PPP")}</span>
              </div>
              <div className="flex items-center">
                <HardDrive className="mr-2 h-4 w-4 text-muted-foreground" />
                <span>Size: {formatFileSize(report.fileSize)}</span>
              </div>
              {report.entropy !== undefined && (
                <div className="flex items-center">
                  <BarChart2 className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>Entropy: {report.entropy.toFixed(1)}/8.0</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <ScoreIndicator score={report.overallRiskScore} size="lg" />
            <div className="mt-2 text-center">
              <span className="text-sm text-muted-foreground">Overall Risk Score</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
