type RadarMetric = {
  label: string;
  value: number;
  color: string;
};

type PerformanceRadarChartProps = {
  metrics: RadarMetric[];
};

export function PerformanceRadarChart({ metrics }: PerformanceRadarChartProps) {
  const width = 338;
  const height = 274;
  const centerX = width / 2;
  const centerY = 140;
  const levels = [0.25, 0.5, 0.75, 1];
  const outerRadius = 76;
  const labelRadius = 106;

  const getPoint = (index: number, scale: number) => {
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / metrics.length;
    const radius = outerRadius * scale;

    return {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
    };
  };

  const punctualityIndex = metrics.findIndex((metric) => metric.label === "Punctuality");

  const polygonPath = metrics
    .map((metric, index) => {
      const point = getPoint(index, metric.value / 20);
      return `${point.x},${point.y}`;
    })
    .join(" ");

  const labelOffsetByLabel: Record<string, { dx: number; dy: number }> = {
    Ratings: { dx: 0, dy: 0 },
    Response: { dx: 2, dy: 0 },
    Punctuality: { dx: 4, dy: 3 },
    Completion: { dx: -4, dy: 3 },
    Technical: { dx: -2, dy: 0 },
  };

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full max-w-[314px] overflow-visible" aria-hidden="true">
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
        return <line key={index} x1={centerX} y1={centerY} x2={point.x} y2={point.y} stroke="#E7DED8" strokeWidth="1" />;
      })}

      <polygon points={polygonPath} fill="rgba(99,52,121,0.22)" stroke="#7F627F" strokeWidth="1.4" />

      {punctualityIndex >= 0 ? (
        <circle
          cx={getPoint(punctualityIndex, metrics[punctualityIndex].value / 20).x}
          cy={getPoint(punctualityIndex, metrics[punctualityIndex].value / 20).y}
          r="6"
          fill="#DE6A07"
        />
      ) : null}

      {metrics.map((metric, index) => {
        const angle = -Math.PI / 2 + (Math.PI * 2 * index) / metrics.length;
        const x = centerX + Math.cos(angle) * labelRadius;
        const y = centerY + Math.sin(angle) * labelRadius;
        const { dx, dy } = labelOffsetByLabel[metric.label] ?? { dx: 0, dy: 0 };

        return (
          <text
            key={metric.label}
            x={x + dx}
            y={y + dy}
            textAnchor={x < centerX - 8 ? "end" : x > centerX + 8 ? "start" : "middle"}
            dominantBaseline="middle"
            fill="#4A2C55"
            fontSize="11"
            fontWeight="700"
            fontFamily="Comfortaa, sans-serif"
            letterSpacing="0"
          >
            {metric.label}
          </text>
        );
      })}
    </svg>
  );
}
