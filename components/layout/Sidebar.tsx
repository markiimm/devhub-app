"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { CommandPalette } from "@/components/ui/CommandPalette";

const NAV = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: "grid",
    text: "text-section-dashboard",
    bg: "bg-section-dashboard/10",
    border: "border-section-dashboard/40",
    shadow: "shadow-[0_0_18px_-4px_#22d3ee80]",
  },
  {
    href: "/brain",
    label: "Dev Brain",
    icon: "code",
    text: "text-section-brain",
    bg: "bg-section-brain/10",
    border: "border-section-brain/40",
    shadow: "shadow-[0_0_18px_-4px_#c084fc80]",
  },
  {
    href: "/vaults",
    label: "Vaults",
    icon: "box",
    text: "text-section-vaults",
    bg: "bg-section-vaults/10",
    border: "border-section-vaults/40",
    shadow: "shadow-[0_0_18px_-4px_#34d39980]",
  },
  {
    href: "/projects",
    label: "Project Lab",
    icon: "folder",
    text: "text-section-projects",
    bg: "bg-section-projects/10",
    border: "border-section-projects/40",
    shadow: "shadow-[0_0_18px_-4px_#fb923c80]",
  },
];

export function Sidebar({ name, handle }: { name: string; handle: string }) {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col border-r border-border bg-surface-1/80 px-4 py-5 backdrop-blur-sm">
      <div className="flex items-center gap-2.5 px-1 pb-7">
        <div className="flex h-8 w-8 items-center justify-center rounded-md border border-accent/50 bg-accent/10 font-mono text-xs font-bold text-accent shadow-glow">
          DH
        </div>
        <span className="font-mono text-base font-semibold tracking-tight">
          dev<span className="text-accent">Hub</span>
        </span>
      </div>

      <div className="pb-4">
        <CommandPalette />
      </div>

      <nav className="flex flex-1 flex-col gap-1.5">
        {NAV.map((item, i) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{ animationDelay: `${i * 60}ms` }}
              className={`focus-ring animate-fade-up flex items-center gap-2.5 rounded-sm border px-3 py-2 text-sm transition-all duration-200 ${
                active
                  ? `${item.border} ${item.bg} ${item.shadow} text-ink-primary`
                  : "border-transparent text-ink-secondary hover:border-border hover:bg-surface-2 hover:text-ink-primary"
              }`}
            >
              <Icon name={item.icon} size={16} className={active ? item.text : "text-ink-muted"} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border pt-4">
        <Link href="/settings" className="flex items-center gap-2.5 rounded-sm px-2 py-2 transition-colors hover:bg-surface-3">
          <div className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-accent/50 bg-accent/10 font-mono text-[10px] font-semibold text-accent">
            {name.slice(0, 2).toUpperCase()}
            <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-status-good opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full border border-surface-1 bg-status-good" />
            </span>
          </div>
          <div className="min-w-0">
            <div className="truncate text-xs font-medium text-ink-primary">{name}</div>
            <div className="truncate font-mono text-xs text-ink-muted">@{handle}</div>
          </div>
        </Link>
      </div>
    </aside>
  );
}
