import Link from 'next/link';
import type { ReactNode } from 'react';
import { userMobileNav, userPrimaryNav } from '@/lib/prototype-navigation';
import { cx } from './ui';

function isActive(current: string, href: string) {
  if (href === '/') {
    return current === '/';
  }

  return current === href || current.startsWith(`${href}/`);
}

export function UserTopNav({ current }: { current: string }) {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-border bg-[#f7fafd]/92 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-headline text-xl font-extrabold tracking-tight text-brand-primary">
            Clean Assurance
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            {userPrimaryNav.map((item) => {
              const active = isActive(current, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cx(
                    'border-b-2 pb-1 text-sm font-semibold tracking-tight transition-colors',
                    active
                      ? 'border-brand-primary text-brand-primary'
                      : 'border-transparent text-text-secondary hover:text-brand-primary'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="알림"
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-text-secondary transition-colors hover:text-brand-primary"
          >
            <span className="h-4 w-4 rounded-full border-2 border-current" />
            <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-status-danger" />
          </button>
          <Link
            href="/customer"
            className="hidden items-center gap-3 rounded-full border border-border bg-white px-3 py-1.5 shadow-sm transition-colors hover:border-brand-primary/30 hover:bg-brand-soft sm:flex"
          >
            <span className="text-sm font-medium text-text-secondary">김창원 님</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-soft text-brand-primary">
              <span className="h-3 w-3 rounded-full bg-brand-primary" />
            </span>
          </Link>
          <Link
            href="/login"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-white px-4 text-sm font-semibold text-text-primary transition-colors hover:border-brand-primary/30 hover:bg-brand-soft sm:hidden"
          >
            로그인
          </Link>
        </div>
      </div>
    </header>
  );
}

function MobileDock({ current }: { current: string }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-white/92 backdrop-blur-xl lg:hidden">
      <div className="mx-auto flex h-20 max-w-md items-center justify-between px-4">
        {userMobileNav.map((item) => {
          const active = isActive(current, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={cx(
                'flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-2 py-2 text-[11px] font-medium transition',
                active ? 'bg-brand-soft text-brand-primary' : 'text-text-secondary'
              )}
            >
              <span
                className={cx(
                  'h-5 w-5 rounded-full border-2',
                  active ? 'border-brand-primary bg-brand-primary/15' : 'border-border-strong bg-transparent'
                )}
              />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function UserPage({
  current,
  children,
}: {
  current: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen pb-28 pt-24 lg:pb-12">
      <UserTopNav current={current} />
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-2 sm:px-6 lg:py-0">{children}</div>
      <MobileDock current={current} />
    </main>
  );
}
