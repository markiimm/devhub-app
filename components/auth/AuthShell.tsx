export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-sm font-bold text-white">
            DH
          </div>
          <span className="text-lg font-semibold">DevHub</span>
        </div>
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-ink-secondary">{subtitle}</p>
        <div className="mt-6">{children}</div>
        <div className="mt-6 text-sm text-ink-secondary">{footer}</div>
      </div>
    </div>
  );
}
