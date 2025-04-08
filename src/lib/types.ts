
export interface Vulnerability {
  id: string;
  name: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  location?: string;
  recommendation: string;
  details?: string;
}

export interface PotentialIssue {
  id: string;
  name: string;
  description: string;
  impact: string;
  recommendation: string;
}

export interface FirmwareReport {
  id: string;
  fileName: string;
  fileSize: number;
  analysisDate: Date;
  entropy?: number;
  compressionRatio?: number;
  fileType?: string;
  vulnerabilities: Vulnerability[];
  potentialIssues: PotentialIssue[];
  structureAnalysis: {
    sections: {
      name: string;
      size: number;
      offset: number;
      description: string;
    }[];
  };
  overallRiskScore: number;
  recommendations: string[];
}

export interface AnalysisProgress {
  step: 'uploading' | 'analyzing' | 'structuring' | 'scanning' | 'reporting' | 'complete';
  progress: number; // 0-100
  message: string;
}
