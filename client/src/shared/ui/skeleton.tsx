type SkeletonProps = {
  className?: string;
};

export const Skeleton = ({ className = '' }: SkeletonProps) => {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded bg-background-secondary ${className}`}
    />
  );
};
