import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle: string;
  description?: string;
  align?: "left" | "center" | "right";
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  description,
  align = "center",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "space-y-4",
        align === "center" && "text-center",
        align === "right" && "text-right",
        className
      )}
    >
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium">
        {subtitle.toUpperCase()}
      </div>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
        {title}
      </h2>
      {description && (
        <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">
          {description}
        </p>
      )}
      <div
        className={cn("h-1 w-16 bg-primary/80 rounded-full", {
          "mx-auto": align === "center",
          "ml-auto": align === "right",
        })}
      />
    </div>
  );
}
