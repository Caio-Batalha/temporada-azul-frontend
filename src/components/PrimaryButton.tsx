import { Link } from "react-router-dom";
import type { ReactNode } from "react";

type PrimaryButtonProps = {
  children: ReactNode;
  to?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  className?: string;
  disabled?: boolean;
};

const baseClass =
  "inline-flex items-center justify-center rounded-full bg-gradient-to-r from-deep-900 via-deep-700 to-ocean-500 px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-glow transition hover:from-deep-900 hover:to-ocean-600 disabled:cursor-not-allowed disabled:opacity-60";

const PrimaryButton = ({
  children,
  to,
  onClick,
  type = "button",
  className,
  disabled,
}: PrimaryButtonProps) => {
  if (to) {
    return (
      <Link to={to} className={`${baseClass} ${className ?? ""}`.trim()}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClass} ${className ?? ""}`.trim()}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;
