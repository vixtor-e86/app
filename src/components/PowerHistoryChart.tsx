import { useEffect, useRef } from 'react';

interface PowerHistoryChartProps {
  voltage: number[];
  current: number[];
  timestamps: number[];
}

export default function PowerHistoryChart({ voltage, current, timestamps }: PowerHistoryChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || voltage.length < 2) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;

    ctx.clearRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const y = (h / 4) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    for (let i = 0; i < 6; i++) {
      const x = (w / 5) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }

    // Voltage line
    const vMin = 210;
    const vMax = 245;
    const vRange = vMax - vMin;

    ctx.strokeStyle = 'rgba(0, 240, 255, 0.8)';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#00F0FF';
    ctx.beginPath();
    voltage.forEach((v, i) => {
      const x = (i / (voltage.length - 1)) * w;
      const y = h - ((v - vMin) / vRange) * h;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Current line
    const cMin = 0;
    const cMax = 15;
    const cRange = cMax - cMin;

    ctx.strokeStyle = 'rgba(255, 0, 255, 0.6)';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#FF00FF';
    ctx.beginPath();
    current.forEach((c, i) => {
      const x = (i / (current.length - 1)) * w;
      const y = h - ((c - cMin) / cRange) * h;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Legend
    ctx.fillStyle = '#00F0FF';
    ctx.font = '10px "Share Tech Mono"';
    ctx.fillText('VOLTAGE', 10, 15);
    ctx.fillStyle = '#FF00FF';
    ctx.fillText('CURRENT', 80, 15);
  }, [voltage, current, timestamps]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  );
}
