import { useEffect, useRef } from "react";

/** Textura de grão sutil usada como camada decorativa no hero. */
export function Grain() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function draw() {
      const w = (canvas!.width = canvas!.offsetWidth);
      const h = (canvas!.height = canvas!.offsetHeight);
      if (!w || !h) return;
      const id = ctx!.createImageData(w, h);
      for (let i = 0; i < id.data.length; i += 4) {
        const v = 200 + Math.random() * 55;
        id.data[i] = v;
        id.data[i + 1] = v;
        id.data[i + 2] = v;
        id.data[i + 3] = Math.random() * 14;
      }
      ctx!.putImageData(id, 0, 0);
    }

    draw();
    window.addEventListener("resize", draw);
    return () => window.removeEventListener("resize", draw);
  }, []);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none absolute inset-0 opacity-50 mix-blend-overlay"
      aria-hidden="true"
    />
  );
}
