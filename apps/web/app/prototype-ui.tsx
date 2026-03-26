import Link from 'next/link';
import type { ReactNode } from 'react';

export type Tone = 'info' | 'success' | 'warning' | 'danger' | 'neutral';

const navItems = [
  { label: '홈', href: '/' },
  { label: '요청자 홈', href: '/customer' },
  { label: '예약 목록', href: '/customer/bookings' },
  { label: '예약 만들기', href: '/customer/request' },
  { label: '제공자 홈', href: '/cleaner' },
];

function isActive(current: string, href: string) {
  return current === href || current.startsWith(`${href}/`);
}

export function toneClasses(tone: Tone) {
  const map: Record<Tone, string> = {
    info: 'border-status-info/20 bg-status-info-soft text-status-info',
    success: 'border-status-success/20 bg-status-success-soft text-status-success',
    warning: 'border-status-warning/20 bg-status-warning-soft text-amber-900',
    danger: 'border-status-danger/20 bg-status-danger-soft text-status-danger',
    neutral: 'border-border bg-surface-subtle text-text-secondary',
  };

  return map[tone];
}

export function StatusBadge({ label, tone }: { label: string; tone: Tone }) {
  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${toneClasses(tone)}`}>
      {label}
    </span>
  );
}

export function UserTopNav({ current }: { current: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/70 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white">
            CRS
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-primary">
              Web Prototype
            </p>
            <p className="text-sm font-medium text-text-primary">청소 예약 서비스</p>
          </div>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-2 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                isActive(current, item.href)
                  ? 'bg-brand-soft text-brand-primary'
                  : 'text-text-secondary hover:bg-surface-subtle hover:text-text-primary'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/login"
            className="inline-flex h-10 items-center justify-center rounded-xl border border-border px-4 text-sm font-semibold text-text-primary"
          >
            로그인
          </Link>
          <Link
            href="/admin"
            className="inline-flex h-10 items-center justify-center rounded-xl bg-slate-950 px-4 text-sm font-semibold text-white"
          >
            관리자
          </Link>
        </div>
      </div>
    </header>
  );
}

export function SurfaceCard({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={`rounded-[1.75rem] border border-border bg-white p-5 shadow-card ${className}`}>{children}</section>;
}
