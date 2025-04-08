
import { PotentialIssue } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface IssueCardProps {
  issue: PotentialIssue;
}

export function IssueCard({ issue }: IssueCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <AlertCircle className="h-5 w-5 text-security-info" />
          {issue.name}
        </CardTitle>
        <CardDescription>
          {issue.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-3">
        <div className="space-y-3 text-sm">
          <div>
            <p className="font-semibold text-xs text-muted-foreground uppercase">Potential Impact</p>
            <p>{issue.impact}</p>
          </div>
          <div>
            <p className="font-semibold text-xs text-muted-foreground uppercase">Recommendation</p>
            <p>{issue.recommendation}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
