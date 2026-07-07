export const AuthMethodDivider = () => {
  return (
    <div className="flex items-center gap-3" aria-hidden="true">
      <div className="h-px flex-1 bg-border-soft" />
      <span className="block-small text-typography-secondary">or</span>
      <div className="h-px flex-1 bg-border-soft" />
    </div>
  );
};
