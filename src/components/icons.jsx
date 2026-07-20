const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  viewBox: '0 0 24 24',
}

export function SearchIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} {...base}>
      <circle cx="11" cy="11" r="7" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

export function AlertTriangleIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} {...base}>
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

export function FileSearchIcon({ className = 'w-10 h-10' }) {
  return (
    <svg className={className} {...base}>
      <path d="M14 3v4a1 1 0 0 0 1 1h4" />
      <path d="M17 21H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8l5 5v3" />
      <circle cx="12" cy="16.5" r="3" />
      <line x1="14.3" y1="18.8" x2="16.5" y2="21" />
    </svg>
  )
}

export function IdCardIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} {...base}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <circle cx="8" cy="11" r="2" />
      <line x1="5" y1="17" x2="11" y2="17" />
      <line x1="14" y1="9" x2="19" y2="9" />
      <line x1="14" y1="13" x2="19" y2="13" />
    </svg>
  )
}

export function TagIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} {...base}>
      <path d="M12.59 2.59 20 10l-8 8-9-9V2.59Z" />
      <circle cx="7" cy="7" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function CalendarIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} {...base}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

export function ScaleIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} {...base}>
      <line x1="12" y1="3" x2="12" y2="21" />
      <line x1="5" y1="7" x2="19" y2="7" />
      <path d="M5 7 2 14a3.5 3.5 0 0 0 6 0Z" />
      <path d="M19 7l-3 7a3.5 3.5 0 0 0 6 0Z" />
    </svg>
  )
}

export function DollarIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} {...base}>
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5.5C17 4 15.2 3 12 3S7 4.3 7 6.2 9 9 12 9.8s5 1.9 5 3.9-2 3.3-5 3.3-5-1-5-2.5" />
    </svg>
  )
}

export function BriefcaseIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} {...base}>
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  )
}

export function MapPinIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} {...base}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

export function PhoneIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} {...base}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
    </svg>
  )
}

export function MailIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} {...base}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 6-10 7L2 6" />
    </svg>
  )
}

export function UsersIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} {...base}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

export function ChevronDownIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} {...base}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

export function CodeIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} {...base}>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  )
}

export function ListIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} {...base}>
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  )
}

export function XIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} {...base}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

export function DownloadIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} {...base}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  )
}
