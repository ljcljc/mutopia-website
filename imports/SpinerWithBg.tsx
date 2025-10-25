import svgPaths from "./svg-osebktixv4";

function Spiner() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 48 48">
      <g id="Spiner">
        <path d={svgPaths.p751f700} fill="var(--fill-0, #25C8A8)" id="Ellipse 1" opacity="0.3" />
      </g>
    </svg>
  );
}

function Spiner1() {
  return (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 48 48">
      <g id="Spiner">
        <path d={svgPaths.p27d9200} fill="var(--fill-0, #25C8A8)" id="Ellipse 1" />
      </g>
    </svg>
  );
}

export default function SpinerWithBg() {
  return (
    <div className="relative size-full" data-name="Spiner With BG">
      <Spiner />
      <Spiner1 />
    </div>
  );
}