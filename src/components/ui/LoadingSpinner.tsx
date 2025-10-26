import { cn } from "@/utils/utils";

interface LoadingSpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  containerClassName?: string;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-8 w-8",
  lg: "h-12 w-12",
};

export const LoadingSpinner = ({
  className,
  size = "md",
  containerClassName,
}: LoadingSpinnerProps) => {
  return (
    <div className={cn("flex justify-center py-8", containerClassName)}>
      <div
        className={cn(
          "animate-spin rounded-full border-b-2 border-primary",
          sizeClasses[size],
          className
        )}
      />
    </div>
  );
};
