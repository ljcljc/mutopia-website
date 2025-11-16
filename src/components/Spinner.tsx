import svgPaths from "../imports/svg-jzpin5grdi";
import svgPathsWithBg from "../imports/svg-osebktixv4";

interface SpinnerProps {
  size?: "small" | "medium" | "large" | number;
  color?: string;
  className?: string;
  /** Whether to show a background track/ring */
  showTrack?: boolean;
  /** Opacity of the background track (0-1) */
  trackOpacity?: number;
}

export function Spinner({ 
  size = "medium", 
  color = "white",
  className = "",
  showTrack = false,
  trackOpacity = 0.3,
}: SpinnerProps) {
  // Size mapping
  const sizeMap = {
    small: 16,
    medium: 24,
    large: 48,
  };

  const dimension = typeof size === "number" ? size : sizeMap[size];

  return (
    <div 
      className={`relative inline-block ${className}`}
      style={{ width: dimension, height: dimension }}
      data-name={showTrack ? "Spinner With Track" : "Spinner"}
      role="status"
      aria-label="Loading"
    >
      {/* Background Track (if enabled) */}
      {showTrack && (
        <svg 
          className="block size-full absolute inset-0" 
          fill="none" 
          viewBox="0 0 48 48"
        >
          <g>
            <path 
              d={svgPathsWithBg.p751f700} 
              fill={color}
              opacity={trackOpacity}
            />
          </g>
        </svg>
      )}
      
      {/* Spinning Arc */}
      <div className="absolute inset-0 animate-spin">
        <svg 
          className="block size-full" 
          fill="none" 
          viewBox="0 0 48 48"
        >
          <g>
            <path 
              d={showTrack ? svgPathsWithBg.p27d9200 : svgPaths.p3ead1300} 
              fill={color}
            />
          </g>
        </svg>
      </div>
    </div>
  );
}
