"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "grid" },
  { href: "/brain", label: "Dev Brain", icon: "code" },
  { href: "/vaults", label: "Vaults", icon: "box" },
  { href: "/projects", label: "Project Lab", icon: "folder" },
];

export function Sidebar({ name, handle }: { name: string; handle: string }) {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 flex h-screen w-56 shrink-0 flex-col border-r border-border bg-surface-1 px-3 py-4">
      <div className="flex items-center gap-2.5 px-2 pb-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-accent text-xs font-bold text-white">
          DH
        </div>
        <span className="text-sm font-semibold">DevHub</span>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5">
        {NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 rounded-sm px-2.5 py-1.5 text-sm transition-colors ${
                active
                  ? "bg-surface-3 text-ink-primary"
                  : "text-ink-secondary hover:bg-surface-2 hover:text-ink-primary"
              }`}
            >
              <Icon name={item.icon} size={16} className={active ? "text-accent" : "text-ink-muted"} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border pt-3">
        <Link href="/settings" className="flex items-center gap-2.5 rounded-sm px-2 py-1.5 hover:bg-surface-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-white">
            {name.slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="truncate text-xs font-medium text-ink-primary">{name}</div>
            <div className="truncate text-xs text-ink-muted">@{handle}</div>
          </div>
        </Link>
      </div>
    </aside>
  );
}
