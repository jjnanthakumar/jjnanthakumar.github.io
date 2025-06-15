import { cn } from "@/lib/utils";

type ChipProps = {
  children: React.ReactNode;
  className?: string;
};

const Chip = ({ children, className }: ChipProps) => {
  return (
    <span
      className={cn(
        "inline-block px-3 py-1 text-xs font-medium rounded-full bg-secondary/20 text-secondary",
        className
      )}
    >
      {children}
    </span>
  );
};

export default Chip;
