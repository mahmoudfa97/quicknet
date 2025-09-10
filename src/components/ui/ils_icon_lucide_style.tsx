import React from "react";

// ILS (₪) icon designed to match Lucide's sizing and API style.
// - Default size matches Lucide's icons (24).
// - Props: size, strokeWidth (kept for API compatibility), className, style, ariaLabel
// - Uses a centered text glyph for pixel-perfect shekel sign rendering across systems.

export interface ILSIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  strokeWidth?: number;
  className?: string;
  style?: React.CSSProperties;
  ariaLabel?: string;
}

const ILSIcon: React.FC<ILSIconProps> = ({
  size = 24,
  strokeWidth = 2,
  className = "",
  style = {},
  ariaLabel = "ILS currency icon",
  ...props
}) => {
  const fontSize = Math.round(size * 0.7); // scale font to fit viewBox nicely

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={ariaLabel}
      className={className}
      style={style}
      {...props}
    >
      {/* Background box kept empty to match Lucide's transparent style */}
      {/* Render the shekel sign as text so the glyph looks correct and consistent */}
      <text
        x="50%"
        y="55%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial"
        fontSize={fontSize}
        fill="currentColor"
        style={{ lineHeight: 1 }}
      >
        ₪
      </text>
    </svg>
  );
};

export default ILSIcon;

// Convenience size-specific exports (matching common Lucide usage sizes)
export const ILSIcon16: React.FC<Omit<ILSIconProps, "size">> = (props) => <ILSIcon size={16} {...props} />;
export const ILSIcon20: React.FC<Omit<ILSIconProps, "size">> = (props) => <ILSIcon size={20} {...props} />;
export const ILSIcon24: React.FC<Omit<ILSIconProps, "size">> = (props) => <ILSIcon size={24} {...props} />;
export const ILSIcon32: React.FC<Omit<ILSIconProps, "size">> = (props) => <ILSIcon size={32} {...props} />;
