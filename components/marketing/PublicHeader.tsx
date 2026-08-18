import Link from "next/link";

export function PublicHeader() {
  return (
    <header className="relative z-10 flex flex-wrap items-center justify-between gap-3 px-6 py-6 sm:px-10">
      <Link href="/" className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-md border border-accent/50 bg-accent/10 font-mono text-xs font-bold text-accent shadow-glow">
          DH
        </div>
        <span className="font-mono text-base font-semibold tracking-tight">
          dev<span className="text-accent">Hub</span>
        </span>
      </Link>
      <div className="flex flex-wrap items-center gap-2">
        <Link href="/feed" className="btn btn-ghost">
          Feed
        </Link>
        <Link href="/explore" className="btn btn-ghost">
          Comunidade
        </Link>
        <Link href="/library" className="btn btn-ghost">
          Biblioteca
        </Link>
        <Link href="/pricing" className="btn btn-ghost">
          Planos
        </Link>
        <Link href="/login" className="btn btn-ghost">
          Entrar
        </Link>
        <Link href="/signup" className="btn btn-primary font-mono">
          $ criar conta →
        </Link>
      </div>
    </header>
  );
}
