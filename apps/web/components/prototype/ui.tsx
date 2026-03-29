import type { ReactNode } from 'react';

export type Tone = 'info' | 'success' | 'warning' | 'danger' | 'neutral';

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export function toneClasses(tone: Tone) {
  const map: Record<Tone, string> = {
    info: 'border-status-info/20 bg-status-info-soft text-status-info',
    success: 'border-status-success/20 bg-status-success-soft text-status-success',
    warning: 'border-status-warning/20 bg-status-warning-soft text-amber-900',
    danger: 'border-status-danger/20 bg-status-danger-soft text-status-danger',
    neutral: 'border-border bg-surface-muted text-text-secondary',
  };

  return map[tone];
}

export function SurfaceCard({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cx(
        'rounded-[1.75rem] border border-border/80 bg-white/95 p-5 shadow-card backdrop-blur-sm',
        className
      )}
    >
      {children}
    </section>
  );
}

export function HighlightPill({
  children,
  tone = 'info',
  className = '',
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span className={cx('inline-flex rounded-full border px-3 py-1 text-xs font-semibold', toneClasses(tone), className)}>
      {children}
    </span>
  );
}

export function StatusBadge({ label, tone }: { label: string; tone: Tone }) {
  return <HighlightPill tone={tone}>{label}</HighlightPill>;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  className = '',
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx('flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between', className)}>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-primary">{eyebrow}</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-text-primary sm:text-3xl">{title}</h2>
        {description ? <p className="mt-3 max-w-3xl text-sm leading-6 text-text-secondary sm:text-base">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function MetricTile({
  label,
  value,
  detail,
  tone = 'neutral',
  className = '',
}: {
  label: string;
  value: string;
  detail?: string;
  tone?: Tone;
  className?: string;
}) {
  return (
    <article className={cx('rounded-[1.5rem] border border-border/80 bg-surface-muted/80 p-4', className)}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-text-secondary">{label}</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums text-text-primary">{value}</p>
        </div>
        <HighlightPill tone={tone}>{tone === 'neutral' ? '지표' : '실시간'}</HighlightPill>
      </div>
      {detail ? <p className="mt-3 text-sm leading-6 text-text-secondary">{detail}</p> : null}
    </article>
  );
}

export function FilterChip({
  label,
  active = false,
}: {
  label: string;
  active?: boolean;
}) {
  return (
    <button
      className={cx(
        'inline-flex h-10 items-center justify-center rounded-full border px-4 text-sm font-medium transition',
        active
          ? 'border-brand-primary bg-brand-primary text-text-onbrand shadow-card'
          : 'border-border bg-white text-text-secondary hover:border-brand-primary/30 hover:bg-brand-soft hover:text-brand-primary'
      )}
    >
      {label}
    </button>
  );
}

export function InfoRow({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-text-secondary">{label}</span>
      <span className={cx('tabular-nums text-right text-text-primary', strong && 'text-base font-semibold')}>
        {value}
      </span>
    </div>
  );
}
