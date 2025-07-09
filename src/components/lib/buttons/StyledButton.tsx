import React, { useState } from "react";
import { darkenColor } from "../../../utils/Colors.utils";

interface StyledButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
}

const StyledButton: React.FC<StyledButtonProps> = ({ variant = "primary", className = "", style, ...props }) => {
  const [hovered, setHovered] = useState(false);

  const baseColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--color-accent")
    .trim() || "#3b82f6";

  const backgroundColor =
    variant === "primary"
      ? hovered
        ? darkenColor(baseColor, 18)
        : baseColor
      : "transparent";

  return (
    <button
      className={`py-3 px-4 rounded-md font-medium transition-colors duration-300 text-text-primary cursor-pointer ${className}`}
      style={{ ...style, backgroundColor: variant === "primary" ? backgroundColor : undefined }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...props}
    />
  );
};

export default StyledButton;
