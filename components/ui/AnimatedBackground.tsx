export function AnimatedBackground({ color = "#22d3ee" }: { color?: string }) {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 animate-grid-pan bg-grid" />
      <div
        className="absolute -top-40 left-1/4 h-[420px] w-[420px] animate-blob-float rounded-full opacity-25 blur-[110px]"
        style={{ background: color }}
      />
      <div
        className="absolute -bottom-40 right-1/4 h-[380px] w-[380px] animate-blob-float rounded-full opacity-20 blur-[110px]"
        style={{ background: color, animationDelay: "-7s" }}
      />
    </div>
  );
}
