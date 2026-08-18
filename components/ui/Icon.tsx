const PATHS: Record<string, string> = {
  grid: '<rect x="3" y="3" width="7" height="7" rx="1.6"/><rect x="14" y="3" width="7" height="7" rx="1.6"/><rect x="3" y="14" width="7" height="7" rx="1.6"/><rect x="14" y="14" width="7" height="7" rx="1.6"/>',
  code: '<polyline points="9,7 4,12 9,17"/><polyline points="15,7 20,12 15,17"/>',
  box: '<path d="M3 7.5l9-4.5 9 4.5-9 4.5-9-4.5z"/><path d="M3 7.5v9l9 4.5 9-4.5v-9"/><path d="M12 12v9"/>',
  folder: '<path d="M3 6.5A1.5 1.5 0 0 1 4.5 5h4.6l2 2.3H19.5A1.5 1.5 0 0 1 21 8.8v9.7A1.5 1.5 0 0 1 19.5 20h-15A1.5 1.5 0 0 1 3 18.5v-12z"/>',
  bug: '<rect x="7" y="8.2" width="10" height="10" rx="4.2"/><path d="M12 8.2V5M9.2 5L7.5 3.3M14.8 5l1.7-1.7M3.7 12.2h3.3M17 12.2h3.3M5 17.5l2.7-1.6M19 17.5l-2.7-1.6M5 8.2l2.7 1.5M19 8.2l-2.7 1.5"/>',
  bulb: '<path d="M9 18.5h6M10 21.3h4M12 3.2a6 6 0 0 0-3 11.2c.6.4 1 1.1 1 1.9h4c0-.8.4-1.5 1-1.9a6 6 0 0 0-3-11.2z"/>',
  wrench: '<path d="M14.7 6.3a4 4 0 0 0-5.3 5.3L3 18l3 3 6.4-6.4a4 4 0 0 0 5.3-5.3l-2.8 2.8-2.2-.4-.4-2.2z"/>',
  check: '<polyline points="4,12.5 9,17.5 20,5.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><polyline points="12,7 12,12 16,14.3"/>',
  plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  x: '<line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/>',
  search: '<circle cx="10.4" cy="10.4" r="6.4"/><line x1="15.2" y1="15.2" x2="21" y2="21"/>',
  sparkles: '<path d="M12 3l1.35 4.1L17.5 8.5l-4.15 1.4L12 14l-1.35-4.1L6.5 8.5l4.15-1.4z"/><path d="M18.7 14.5l.6 1.8 1.8.6-1.8.6-.6 1.8-.6-1.8-1.8-.6 1.8-.6z"/>',
  chevronRight: '<polyline points="8,4 16,12 8,20"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="1.8"/><path d="M4 16V5.5A1.5 1.5 0 0 1 5.5 4H16"/>',
  logOut: '<path d="M9 4H5.5A1.5 1.5 0 0 0 4 5.5v13A1.5 1.5 0 0 0 5.5 20H9"/><line x1="20" y1="12" x2="10" y2="12"/><polyline points="15,7 20,12 15,17"/>',
  user: '<circle cx="12" cy="8.5" r="3.5"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/>',
  trash: '<path d="M4 7h16"/><path d="M9 7V4.8A1.8 1.8 0 0 1 10.8 3h2.4A1.8 1.8 0 0 1 15 4.8V7"/><path d="M6 7l1 13.2A1.8 1.8 0 0 0 8.8 22h6.4a1.8 1.8 0 0 0 1.8-1.8L18 7"/>',
  edit: '<path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-3-3L5 17v3z"/>',
  github: '<path d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.8c-2.9.6-3.5-1.3-3.5-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.4 1.1 3 .8.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.5-1.3.1-2.7 0 0 .8-.3 2.7 1a9.5 9.5 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .6 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 4-2.4 4.7-4.6 5 .4.4.7 1 .7 2v3c0 .3.2.6.7.5A10 10 0 0 0 12 2z"/>',
  bell: '<path d="M6 10a6 6 0 0 1 12 0c0 4.6 1.8 5.8 1.8 5.8H4.2S6 14.6 6 10z"/><path d="M10 19.8a2 2 0 0 0 4 0"/>',
  zap: '<polygon points="13,2 4,14 11,14 10,22 20,9 13,9"/>',
  fileText: '<path d="M6 3h8l4 4v14H6V3z"/><line x1="9" y1="12.5" x2="15" y2="12.5"/><line x1="9" y1="16" x2="15" y2="16"/>',
  star: '<polygon points="12,3 14.9,9.6 22,10.5 16.8,15.2 18.2,22 12,18.4 5.8,22 7.2,15.2 2,10.5 9.1,9.6"/>',
  gitFork: '<circle cx="6" cy="5" r="2.3"/><circle cx="18" cy="5" r="2.3"/><circle cx="12" cy="19" r="2.3"/><path d="M6 7.3V11a3 3 0 0 0 3 3h1.5M18 7.3V11a3 3 0 0 0-3 3h-1.5M12 14v2.7"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
};

export function Icon({
  name,
  size = 16,
  className,
}: {
  name: keyof typeof PATHS | string;
  size?: number;
  className?: string;
}) {
  const d = PATHS[name] ?? "";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      dangerouslySetInnerHTML={{ __html: d }}
    />
  );
}
