import React from 'react';

const GaugeChart = ({ value = 0, size = 180, label = 'Risk', riskLevel = 'Low' }) => {
  const numVal = Number(value) || 0;
  const normalizedValue = Math.min(Math.max(numVal, 0), 100);
  const radius = size / 2 - 16;
  const cx = size / 2;
  const cy = size / 2;

  const startAngle = 180;
  const totalAngle = 180;
  const valueAngle = startAngle - (normalizedValue / 100) * totalAngle;

  const toRad = (deg) => (deg * Math.PI) / 180;
  const polarToCart = (angle) => ({
    x: cx + radius * Math.cos(toRad(angle)),
    y: cy - radius * Math.sin(toRad(angle))
  });

  const start = polarToCart(startAngle);
  const end = polarToCart(0);
  const valueEnd = polarToCart(valueAngle);

  const bgArc = `M ${start.x} ${start.y} A ${radius} ${radius} 0 0 1 ${end.x} ${end.y}`;
  const largeArc = normalizedValue > 50 ? 1 : 0;
  const valArc = normalizedValue > 0
    ? `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${valueEnd.x} ${valueEnd.y}`
    : '';

  const getColor = () => {
    if (normalizedValue >= 70) return '#FF3B30';
    if (normalizedValue >= 40) return '#FFB000';
    return '#34C759';
  };
  const color = getColor();

  return (
    <div className="flex flex-col items-center" data-testid="gauge-chart">
      <div className="relative" style={{ width: size, height: size / 2 + 10 }}>
        <svg width={size} height={size / 2 + 10} viewBox={`0 0 ${size} ${size / 2 + 10}`} className="absolute inset-0">
          <path d={bgArc} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" strokeLinecap="round" />
          {valArc && (
            <path d={valArc} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
              style={{ filter: `drop-shadow(0 0 8px ${color}80)` }}
            />
          )}
        </svg>
        {/* Text overlay using HTML for reliable rendering */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
          <div className="text-3xl font-bold text-white" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            {normalizedValue.toFixed(1)}%
          </div>
          <div className="text-[10px] uppercase tracking-[0.15em] text-[#52525B]" style={{ fontFamily: "'Manrope', sans-serif" }}>
            {label}
          </div>
        </div>
      </div>
      <span
        className="mt-2 px-3 py-1 rounded text-xs font-mono uppercase tracking-wider border"
        style={{ color, backgroundColor: `${color}15`, borderColor: `${color}30` }}
      >
        {riskLevel}
      </span>
    </div>
  );
};

export default GaugeChart;
