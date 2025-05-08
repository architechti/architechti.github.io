
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

type CheckboxWithTextProps = {
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
};

export function CheckboxWithText({
  label,
  checked,
  onCheckedChange,
  disabled = false,
}: CheckboxWithTextProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      type="button"
      className={cn(
        "flex items-center h-8 px-3 rounded-md text-sm transition-colors cursor-pointer select-none",
        checked
          ? "bg-primary text-primary-foreground"
          : "bg-muted hover:bg-muted/80",
        disabled && "opacity-50 cursor-not-allowed"
      )}
      onClick={() => !disabled && onCheckedChange(!checked)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={disabled}
    >
      {checked && <Check className="mr-1 h-3.5 w-3.5" />}
      {label}
    </button>
  );
}
