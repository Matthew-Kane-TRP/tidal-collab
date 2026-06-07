// Clean stroke-based SVG icons for tools. Single source of truth so the whole
// app shares one consistent icon language (24x24 grid, currentColor stroke).

const PATHS = {
  // Comparative Market Analysis — bar chart
  cma: (
    <>
      <line x1="4" y1="20" x2="20" y2="20" />
      <rect x="5" y="11" width="3.5" height="6" rx="1" />
      <rect x="10.25" y="7" width="3.5" height="10" rx="1" />
      <rect x="15.5" y="13" width="3.5" height="4" rx="1" />
    </>
  ),
  // Inspection — magnifier over a checklist
  inspection: (
    <>
      <circle cx="11" cy="11" r="6" />
      <line x1="15.5" y1="15.5" x2="20" y2="20" />
      <polyline points="8.5 11 10.3 12.8 13.5 9.5" />
    </>
  ),
  // Repair request — wrench
  repair: (
    <>
      <path d="M14.7 6.3a4 4 0 0 0-5.2 5.2L4 17l3 3 5.5-5.5a4 4 0 0 0 5.2-5.2l-2.4 2.4-2.6-.6-.6-2.6 2.4-2.4z" />
    </>
  ),
  // Contract — document with lines
  contract: (
    <>
      <path d="M7 3h7l4 4v14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
      <polyline points="14 3 14 7 18 7" />
      <line x1="9" y1="12" x2="15" y2="12" />
      <line x1="9" y1="15.5" x2="15" y2="15.5" />
    </>
  ),
  // Social — share nodes
  social: (
    <>
      <circle cx="7" cy="12" r="2.5" />
      <circle cx="17" cy="6" r="2.5" />
      <circle cx="17" cy="18" r="2.5" />
      <line x1="9.2" y1="10.8" x2="14.8" y2="7.2" />
      <line x1="9.2" y1="13.2" x2="14.8" y2="16.8" />
    </>
  ),
  // Listing alert — bell
  alert: (
    <>
      <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6z" />
      <path d="M10.5 19a1.6 1.6 0 0 0 3 0" />
    </>
  ),
  // Pipeline dashboard — trend line
  pipeline: (
    <>
      <polyline points="4 15 9 10 13 13 20 6" />
      <polyline points="15 6 20 6 20 11" />
      <line x1="4" y1="20" x2="20" y2="20" />
    </>
  ),
  // Market snapshot — buildings
  market: (
    <>
      <path d="M4 20V9l5-3 5 3" />
      <path d="M14 20V11l5-2v11" />
      <line x1="3" y1="20" x2="21" y2="20" />
      <line x1="8" y1="12" x2="8" y2="12.01" />
      <line x1="8" y1="16" x2="8" y2="16.01" />
      <line x1="17" y1="13" x2="17" y2="13.01" />
      <line x1="17" y1="16.5" x2="17" y2="16.51" />
    </>
  ),
  arrow: (
    <>
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="13 6 19 12 13 18" />
    </>
  ),
  back: (
    <>
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="11 6 5 12 11 18" />
    </>
  ),
}

export default function ToolIcon({ name, size = 24, strokeWidth = 1.75, style }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      aria-hidden="true"
    >
      {PATHS[name] || null}
    </svg>
  )
}
