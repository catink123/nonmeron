import { Box, BoxProps } from "@mui/material";
import { useEffect, useRef, useState } from "react";

export interface CircleProgressProps extends BoxProps {
  min?: number,
  max?: number,
  value?: number
}

const animRotationSpeed = 2,
  backdropStyle = '#222222AA',
  valueStyle = '#FFF',
  valueBackgroundStyle = '#222222AA',
  outerRadius = 16,
  innerRadius = 13,
  lineWidth = 2,
  resolution = 1.5;

export default function CircleProgress({ min, max, value, ...restProps }: CircleProgressProps) {
  const canvRef = useRef<HTMLCanvasElement>(null);
  const [calculatedSize, setCalculatedSize] = useState(32);
  const prevT = useRef(0);
  const animID = useRef<number>();
  const ctxRef = useRef<CanvasRenderingContext2D>();
  const currentRotation = useRef(0);

  function draw(t: number) {
    const delta = (t - prevT.current) / 1000;
    prevT.current = t;

    if (canvRef.current === null) return;
    if (ctxRef.current === undefined) ctxRef.current = canvRef.current.getContext('2d')!;
    const ctx = ctxRef.current;

    const or = outerRadius * devicePixelRatio * resolution;
    const ir = innerRadius * devicePixelRatio * resolution;
    const val = value === undefined ? 1 : ((value - (min ?? 0)) / (max ?? 100));
    ctx.clearRect(0, 0, canvRef.current.width, canvRef.current.height);

    ctx.fillStyle = backdropStyle;
    ctx.lineWidth = lineWidth * devicePixelRatio * resolution;

    ctx.beginPath();
    ctx.arc(or, or, or, 0, Math.PI * 2);
    ctx.fill();

    ctx.setLineDash([0, 0]);

    ctx.strokeStyle = valueBackgroundStyle;
    ctx.beginPath();
    ctx.arc(or, or, ir, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = valueStyle;
    if (value === undefined) ctx.setLineDash([15 * devicePixelRatio, 15 * devicePixelRatio]);

    ctx.beginPath();
    ctx.arc(or, or, ir, Math.PI * 1.5 + currentRotation.current, Math.PI * 1.5 + Math.PI * 2 * val + currentRotation.current, false);
    ctx.stroke();

    currentRotation.current += delta * animRotationSpeed;
    animID.current = requestAnimationFrame(draw);
  }

  function onResize() {
    if (canvRef.current === null) return;
    const calculatedSize = outerRadius * 2 * devicePixelRatio * resolution;
    canvRef.current.width = calculatedSize;
    canvRef.current.height = calculatedSize;
  }

  useEffect(() => {
    animID.current = requestAnimationFrame(draw);
    onResize();
    window.onresize = onResize;
    return () => {
      cancelAnimationFrame(animID.current!);
    }
  }, []);

  return (
    <Box component="canvas" ref={canvRef} style={{ width: outerRadius * 2 + 'px', height: outerRadius * 2 + 'px' }} {...restProps} />
  )
}