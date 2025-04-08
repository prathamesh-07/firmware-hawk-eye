
import { FirmwareReport, Vulnerability, PotentialIssue, AnalysisProgress } from './types';

/**
 * Mock firmware analyzer service
 * In a real application, this would interface with a backend service or use
 * WebAssembly to perform actual firmware analysis.
 */
export class FirmwareAnalyzer {
  private analysisCallbacks: ((progress: AnalysisProgress) => void)[] = [];
  
  /**
   * Analyze a firmware file
   * @param file The firmware file to analyze
   * @returns A promise that resolves to a FirmwareReport
   */
  public async analyzeFirmware(file: File): Promise<FirmwareReport> {
    // For demo purposes, we'll simulate the analysis process with delays
    
    // Step 1: File upload and initial processing
    this.updateProgress({
      step: 'uploading',
      progress: 10,
      message: 'Uploading firmware file...'
    });
    
    await this.simulateDelay(800);
    
    // Step 2: Initial analysis
    this.updateProgress({
      step: 'analyzing',
      progress: 30,
      message: 'Analyzing firmware structure...'
    });
    
    await this.simulateDelay(1200);
    
    // Step 3: Structure analysis
    this.updateProgress({
      step: 'structuring',
      progress: 50,
      message: 'Mapping firmware sections...'
    });
    
    await this.simulateDelay(1000);
    
    // Step 4: Vulnerability scanning
    this.updateProgress({
      step: 'scanning',
      progress: 70,
      message: 'Scanning for vulnerabilities...'
    });
    
    await this.simulateDelay(1500);
    
    // Step 5: Report generation
    this.updateProgress({
      step: 'reporting',
      progress: 90,
      message: 'Generating detailed report...'
    });
    
    await this.simulateDelay(1000);
    
    // Complete
    this.updateProgress({
      step: 'complete',
      progress: 100,
      message: 'Analysis complete!'
    });
    
    // Generate a mock report based on the file
    return this.generateMockReport(file);
  }
  
  /**
   * Register a callback to receive analysis progress updates
   */
  public onProgress(callback: (progress: AnalysisProgress) => void): () => void {
    this.analysisCallbacks.push(callback);
    
    // Return a function to unregister the callback
    return () => {
      const index = this.analysisCallbacks.indexOf(callback);
      if (index !== -1) {
        this.analysisCallbacks.splice(index, 1);
      }
    };
  }
  
  /**
   * Update the analysis progress
   */
  private updateProgress(progress: AnalysisProgress): void {
    // Notify all registered callbacks
    this.analysisCallbacks.forEach(callback => callback(progress));
  }
  
  /**
   * Helper function to simulate delay for demo purposes
   */
  private simulateDelay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  /**
   * Generate a mock report based on the file
   * In a real application, this would perform actual analysis
   */
  private generateMockReport(file: File): FirmwareReport {
    const vulnerabilities: Vulnerability[] = [
      {
        id: 'vuln-1',
        name: 'Hardcoded Credentials',
        description: 'Found hardcoded API keys and passwords in the firmware binary.',
        severity: 'high',
        location: 'offset 0x45A8-0x45F2',
        recommendation: 'Remove hardcoded credentials and implement secure credential storage.',
        details: 'API key pattern found: "api_key=a1b2c3d4e5f6g7h8i9j0"'
      },
      {
        id: 'vuln-2',
        name: 'Insecure Communication',
        description: 'Firmware appears to use unencrypted HTTP communication.',
        severity: 'high',
        location: 'Multiple locations',
        recommendation: 'Implement TLS/SSL for all network communications.',
        details: 'Found multiple instances of HTTP URL patterns without HTTPS.'
      },
      {
        id: 'vuln-3',
        name: 'Buffer Overflow Vulnerability',
        description: 'Potential buffer overflow vulnerability in string handling functions.',
        severity: 'medium',
        location: 'offset 0x12340-0x12390',
        recommendation: 'Implement proper input validation and use safer string handling functions.',
        details: 'Found usage of unsafe strcpy() function without bounds checking.'
      },
      {
        id: 'vuln-4',
        name: 'Outdated Libraries',
        description: 'Firmware contains outdated versions of OpenSSL (1.0.1e).',
        severity: 'medium',
        location: 'Library section',
        recommendation: 'Update to the latest version of OpenSSL.',
        details: 'OpenSSL 1.0.1e is vulnerable to Heartbleed and other known exploits.'
      },
      {
        id: 'vuln-5',
        name: 'Insufficient Entropy',
        description: 'Weak random number generation detected.',
        severity: 'low',
        location: 'offset 0x7A210-0x7A250',
        recommendation: 'Implement a cryptographically secure random number generator.',
        details: 'Using predictable seed value for random number generation.'
      }
    ];
    
    const potentialIssues: PotentialIssue[] = [
      {
        id: 'issue-1',
        name: 'No Secure Boot Implementation',
        description: 'The firmware does not implement secure boot mechanisms.',
        impact: 'Allows unauthorized firmware modifications and potential compromise.',
        recommendation: 'Implement secure boot with cryptographic signature verification.'
      },
      {
        id: 'issue-2',
        name: 'Excessive Debug Information',
        description: 'Debug symbols and extensive logging remain enabled in the firmware.',
        impact: 'Provides attackers with detailed information about the system.',
        recommendation: 'Remove debug symbols and limit logging in production firmware.'
      },
      {
        id: 'issue-3',
        name: 'No Firmware Update Mechanism',
        description: 'No secure mechanism for firmware updates was detected.',
        impact: 'Makes it difficult to patch security vulnerabilities.',
        recommendation: 'Implement a secure firmware update process with verification.'
      }
    ];
    
    // Calculate mock risk score based on vulnerabilities
    const highSeverityCount = vulnerabilities.filter(v => v.severity === 'high').length;
    const mediumSeverityCount = vulnerabilities.filter(v => v.severity === 'medium').length;
    const lowSeverityCount = vulnerabilities.filter(v => v.severity === 'low').length;
    
    // Calculate risk score: high vulns count 3x, medium 2x, low 1x
    const overallRiskScore = Math.min(
      10,
      Math.round((highSeverityCount * 3 + mediumSeverityCount * 2 + lowSeverityCount) * 1.5)
    );
    
    return {
      id: `report-${Date.now()}`,
      fileName: file.name,
      fileSize: file.size,
      analysisDate: new Date(),
      entropy: 7.2, // Mock entropy value (0-8, higher means more random/encrypted)
      compressionRatio: 0.3, // Mock compression ratio
      fileType: this.guessFileType(file.name),
      vulnerabilities,
      potentialIssues,
      structureAnalysis: {
        sections: [
          {
            name: 'Header',
            size: Math.round(file.size * 0.02),
            offset: 0,
            description: 'Firmware metadata and configuration'
          },
          {
            name: 'Bootloader',
            size: Math.round(file.size * 0.10),
            offset: Math.round(file.size * 0.02),
            description: 'Initial boot code'
          },
          {
            name: 'Kernel',
            size: Math.round(file.size * 0.30),
            offset: Math.round(file.size * 0.12),
            description: 'Core system code'
          },
          {
            name: 'File System',
            size: Math.round(file.size * 0.40),
            offset: Math.round(file.size * 0.42),
            description: 'Embedded file system with configurations and resources'
          },
          {
            name: 'Resources',
            size: Math.round(file.size * 0.15),
            offset: Math.round(file.size * 0.82),
            description: 'Images, sounds, and other resources'
          },
          {
            name: 'Signature',
            size: Math.round(file.size * 0.03),
            offset: Math.round(file.size * 0.97),
            description: 'Firmware integrity signature'
          }
        ]
      },
      overallRiskScore,
      recommendations: [
        'Implement encryption for sensitive data storage',
        'Update all third-party libraries to their latest versions',
        'Remove hardcoded credentials from the firmware',
        'Implement secure boot mechanisms',
        'Add proper input validation for all user inputs',
        'Implement a secure update mechanism with signature verification'
      ]
    };
  }
  
  /**
   * Guess the file type based on the file name
   */
  private guessFileType(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase() || '';
    
    // Common firmware file extensions
    const extensionMap: Record<string, string> = {
      'bin': 'Binary Firmware',
      'hex': 'Intel HEX Format',
      'fw': 'Generic Firmware',
      'img': 'Disk Image',
      'rom': 'Read-Only Memory Image',
      'elf': 'Executable and Linkable Format',
      'fdt': 'Flattened Device Tree',
      'uboot': 'U-Boot Image',
      'dtb': 'Device Tree Blob'
    };
    
    return extensionMap[extension] || 'Unknown Firmware Type';
  }
}

// Export a singleton instance
export const firmwareAnalyzer = new FirmwareAnalyzer();
