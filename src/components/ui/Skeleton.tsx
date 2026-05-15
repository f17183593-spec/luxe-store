import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  as?: "div" | "span";
}

export function Skeleton({ className, as: Tag = "div" }: SkeletonProps) {
  return (
    <Tag
      className={cn(
        "animate-pulse rounded-lg bg-luxe-silver/40",
        className,
      )}
      aria-hidden="true"
    />
  );
}
