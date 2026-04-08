type RadarMetric = {
  label: string;
  value: number;
  color: string;
};

type PerformanceRadarChartProps = {
  metrics: RadarMetric[];
};

export function PerformanceRadarChart({ metrics }: PerformanceRadarChartProps) {
  const size = 232;
  const center = size / 2;
  const levels = [0.25, 0.5, 0.75, 1];
  const labelRadius = 126;

  const getPoint = (index: number, scale: number) => {
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / metrics.length;
    const radius = 82 * scale;

    return {
      x: center + Math.cos(angle) * radius,
      y: center + Math.sin(angle) * radius,
    };
  };

  const polygonPath = metrics
    .map((metric, index) => {
      const point = getPoint(index, metric.value / 20);
      return `${point.x},${point.y}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="h-[232px] w-[232px]" aria-hidden="true">
      {levels.map((level) => (
        <polygon
          key={level}
          points={metrics
            .map((_, index) => {
              const point = getPoint(index, level);
              return `${point.x},${point.y}`;
            })
            .join(" ")}
          fill="none"
          stroke="#E7DED8"
          strokeWidth="1"
        />
      ))}

      {metrics.map((_, index) => {
        const point = getPoint(index, 1);
        return <line key={index} x1={center} y1={center} x2={point.x} y2={point.y} stroke="#E7DED8" strokeWidth="1" />;
      })}

      <polygon points={polygonPath} fill="rgba(99,52,121,0.16)" stroke="#633479" strokeWidth="2.5" />

      {metrics.map((metric, index) => {
        const point = getPoint(index, metric.value / 20);
        return <circle key={metric.label} cx={point.x} cy={point.y} r="5" fill={metric.color} stroke="white" strokeWidth="2" />;
      })}

      {metrics.map((metric, index) => {
        const angle = -Math.PI / 2 + (Math.PI * 2 * index) / metrics.length;
        const x = center + Math.cos(angle) * labelRadius;
        const y = center + Math.sin(angle) * labelRadius;
        const lines = metric.label.split("\n");

        return (
          <text
            key={`${metric.label}-label`}
            x={x}
            y={y}
            textAnchor={x < center - 8 ? "end" : x > center + 8 ? "start" : "middle"}
            dominantBaseline={y < center - 8 ? "auto" : y > center + 8 ? "hanging" : "middle"}
            fill="#8B6357"
            fontSize="11"
            fontWeight="700"
          >
            {lines.map((line, lineIndex) => (
              <tspan key={`${metric.label}-${line}`} x={x} dy={lineIndex === 0 ? 0 : 13}>
                {line}
              </tspan>
            ))}
          </text>
        );
      })}
    </svg>
  );
}
