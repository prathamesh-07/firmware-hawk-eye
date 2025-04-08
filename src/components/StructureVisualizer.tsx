
import { FirmwareReport } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

interface StructureVisualizerProps {
  report: FirmwareReport;
}

export function StructureVisualizer({ report }: StructureVisualizerProps) {
  const totalSize = report.fileSize;
  
  const colors = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-green-500", 
    "bg-yellow-500",
    "bg-red-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
  ];
  
  // Generate hover details for each section
  const sections = useMemo(() => {
    return report.structureAnalysis.sections.map((section, index) => {
      const percentage = (section.size / totalSize) * 100;
      
      return {
        ...section,
        percentage,
        color: colors[index % colors.length],
        sizeFormatted: formatFileSize(section.size)
      };
    });
  }, [report]);
  
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    else return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Firmware Structure</h3>
      
      {/* Visualization bar */}
      <div className="w-full h-12 flex rounded-md overflow-hidden">
        {sections.map((section, index) => (
          <div
            key={index}
            className={cn(
              section.color,
              "relative group"
            )}
            style={{ width: `${section.percentage}%` }}
          >
            {/* Tooltip */}
            <div className="absolute opacity-0 group-hover:opacity-100 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-black/90 text-white text-xs rounded pointer-events-none transition-opacity whitespace-nowrap z-50">
              <p className="font-semibold">{section.name}</p>
              <p className="text-gray-300">Size: {section.sizeFormatted}</p>
              <p className="text-gray-300">Offset: 0x{section.offset.toString(16).toUpperCase()}</p>
              <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-solid border-t-black/90 border-l-transparent border-r-transparent"></div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {sections.map((section, index) => (
          <div key={index} className="flex items-center text-sm">
            <div className={cn("w-3 h-3 rounded-sm mr-2", section.color)}></div>
            <div className="flex-1">
              <span className="font-medium">{section.name}</span>
              <span className="text-muted-foreground ml-2">({section.percentage.toFixed(1)}%)</span>
            </div>
          </div>
        ))}
      </div>
      
      {/* Details */}
      <div className="mt-6 space-y-4">
        <h4 className="text-sm font-semibold text-muted-foreground uppercase">Section Details</h4>
        <div className="space-y-3">
          {sections.map((section, index) => (
            <div key={index} className="border rounded-md p-4">
              <div className="flex justify-between items-center">
                <h5 className="font-medium">{section.name}</h5>
                <span className="text-sm text-muted-foreground">{section.sizeFormatted}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{section.description}</p>
              <div className="mt-2 flex items-center gap-x-2">
                <span className="text-xs bg-secondary px-2 py-1 rounded">
                  Offset: 0x{section.offset.toString(16).toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
