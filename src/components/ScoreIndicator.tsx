
import { cn } from "@/lib/utils";

interface ScoreIndicatorProps {
  score: number; // 0-10
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function ScoreIndicator({ 
  score, 
  size = "md", 
  showLabel = true 
}: ScoreIndicatorProps) {
  
  // Map score (0-10) to colors
  const getScoreColor = () => {
    if (score <= 3) return "text-security-low";
    if (score <= 7) return "text-security-medium";
    return "text-security-high";
  };
  
  // Map score (0-10) to risk label
  const getRiskLabel = () => {
    if (score <= 3) return "Low Risk";
    if (score <= 7) return "Medium Risk";
    return "High Risk";
  };
  
  // Size mapping
  const sizeClasses = {
    sm: {
      container: "w-16 h-16",
      outerCircle: "w-16 h-16",
      innerCircle: "w-12 h-12",
      score: "text-2xl",
      label: "text-xs"
    },
    md: {
      container: "w-24 h-24",
      outerCircle: "w-24 h-24",
      innerCircle: "w-20 h-20",
      score: "text-3xl",
      label: "text-sm"
    },
    lg: {
      container: "w-32 h-32",
      outerCircle: "w-32 h-32",
      innerCircle: "w-28 h-28",
      score: "text-4xl",
      label: "text-base"
    }
  };
  
  const selectedSize = sizeClasses[size];
  const scoreColor = getScoreColor();
  const riskLabel = getRiskLabel();
  
  return (
    <div className={cn(
      "relative flex items-center justify-center",
      selectedSize.container
    )}>
      {/* Outer circle (colored ring) */}
      <div className={cn(
        "absolute rounded-full border-4",
        scoreColor,
        selectedSize.outerCircle
      )} />
      
      {/* Inner circle (content) */}
      <div className={cn(
        "absolute bg-card rounded-full flex flex-col items-center justify-center",
        selectedSize.innerCircle
      )}>
        <span className={cn("font-bold", scoreColor, selectedSize.score)}>
          {score}
        </span>
        {showLabel && (
          <span className={cn("font-medium", scoreColor, selectedSize.label)}>
            {riskLabel}
          </span>
        )}
      </div>
    </div>
  );
}
