import Link from 'next/link';
import type { ReactNode } from 'react';
import { adminNavGroups } from '@/lib/prototype-navigation';
import { cx } from './ui';

function isActive(current: string, href: string) {
  if (href === '#') {
    return false;
  }

  return current === href || current.startsWith(`${href}/`);
}

export function AdminShell({
  current,
  children,
}: {
  current: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#f7fafd]">
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col bg-[#001d3d] lg:flex">
        <div className="px-6 py-8">
          <h1 className="text-xl font-bold tracking-tight text-white">창원클린</h1>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-400">
            Operations Console
          </p>
        </div>

        <nav className="flex-1 px-3">
          <div className="space-y-1">
            {adminNavGroups.map((group) => (
              <div key={group.title} className="pt-4 first:pt-0">
                <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                  {group.title}
                </p>
                <ul className="space-y-0.5">
                  {group.items.map((item) => {
                    const active = isActive(current, item.href);

                    return (
                      <li key={item.label}>
                        <Link
                          href={item.href}
                          aria-current={active ? 'page' : undefined}
                          aria-disabled={item.disabled}
                          className={cx(
                            'flex items-center gap-3 rounded px-3 py-2.5 text-[13px] font-medium transition-all',
                            active
                              ? 'border-l-[3px] border-white bg-white/10 text-white'
                              : item.disabled
                                ? 'cursor-not-allowed text-slate-600'
                                : 'text-slate-400 hover:bg-white/5 hover:text-white'
                          )}
                        >
                          <span className="h-2 w-2 rounded-full bg-current" />
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </nav>

        <div className="border-t border-white/5 p-4">
          <div className="flex items-center gap-3 rounded p-2 transition-colors hover:bg-white/5">
            <span className="flex h-8 w-8 items-center justify-center rounded bg-brand-primary text-sm font-semibold text-white">
              A
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-white">최고관리자</p>
              <p className="truncate text-[10px] text-slate-400">admin_ops</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="px-4 py-4 sm:px-6 lg:ml-60 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-[1600px]">{children}</div>
      </div>

      <div className="fixed bottom-4 right-4 z-[60] lg:hidden">
        <button
          type="button"
          aria-label="운영 메뉴"
          className="flex h-12 w-12 items-center justify-center rounded bg-brand-primary text-white shadow-lg"
        >
          <span className="h-4 w-4 rounded-sm border-2 border-current" />
        </button>
      </div>
    </main>
  );
}
