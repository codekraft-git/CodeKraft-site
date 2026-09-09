export function Brand({ className = "", showTagline = true }: { className?: string; showTagline?: boolean }) {
  return (
    <a href="#home" className={`brand ${className}`} aria-label="CodeKraft home">
      <span className="brand-symbol-wrap" aria-hidden="true">
        <img
          src="/assets/codekraft-emblem.png"
          width="38"
          height="38"
          alt=""
          className="brand-symbol-img"
          draggable={false}
        />
      </span>
      <span className="brand-text-wrap" aria-hidden="true">
        <span className="brand-title">CodeKraft</span>
        {showTagline && <span className="brand-tagline">BUILD · SECURE · INNOVATE</span>}
      </span>
    </a>
  );
}
