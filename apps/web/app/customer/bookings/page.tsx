import Link from 'next/link';
import { UserPage } from '@/components/prototype/user-shell';
import { StatusBadge } from '@/components/prototype/ui';

const filters = ['전체', '진행 중', '완료', '취소'];

const bookings = [
  {
    title: '2026년 5월 24일 (금)',
    time: '오후 2:00',
    address: '경남 창원시 성산구 중앙대로 101',
    detail: '창원 아파트 102동 1504호',
    amount: '85,000원',
    status: '방문 대기',
    tone: 'success' as const,
    secondary: '취소/환불',
    primary: '상세보기',
  },
  {
    title: '2026년 5월 12일 (일)',
    time: '오전 10:00',
    address: '경남 창원시 의창구 원이대로 320',
    detail: '창원 더시티세븐 702호',
    amount: '120,000원',
    status: '완료',
    tone: 'neutral' as const,
    secondary: '상세보기',
    primary: '리뷰 작성',
  },
];

export default function CustomerBookingsPage() {
  return (
    <UserPage current="/customer/bookings">
      <section className="mx-auto w-full max-w-3xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-headline text-3xl font-extrabold tracking-tight text-brand-primary">내 예약 목록</h1>
            <p className="mt-2 text-sm text-text-secondary">진행 중인 예약과 과거 이용 내역을 확인하세요.</p>
          </div>
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-surface-muted px-4 text-sm font-medium text-text-primary"
          >
            최근 3개월
            <span className="text-text-tertiary">▾</span>
          </button>
        </div>

        <div className="mb-10 flex overflow-x-auto rounded-[1rem] bg-surface-muted p-1.5">
          {filters.map((filter, index) => (
            <button
              key={filter}
              type="button"
              className={`min-w-[88px] flex-1 whitespace-nowrap rounded-[0.8rem] py-2.5 text-sm ${
                index === 0
                  ? 'bg-white font-bold text-brand-primary shadow-sm'
                  : 'font-medium text-text-secondary'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {bookings.map((booking) => (
            <article key={`${booking.title}-${booking.time}`} className="rounded-[1.5rem] border border-border/20 bg-white p-6 shadow-[0_20px_40px_rgba(0,52,102,0.06)]">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1.5">
                  <StatusBadge label={booking.status} tone={booking.tone} />
                  <h3 className="font-headline text-xl font-bold tracking-tight text-text-primary">{booking.title}</h3>
                  <p className="text-lg font-bold text-brand-primary">{booking.time}</p>
                </div>
                <div className="text-right">
                  <p className="mb-1 text-[11px] uppercase tracking-[0.18em] text-text-tertiary">결제금액</p>
                  <p className="text-xl font-extrabold tabular-nums text-text-primary">{booking.amount}</p>
                </div>
              </div>

              <div className="mb-6 flex items-center gap-3 border-t border-dashed border-border/40 py-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-muted text-brand-primary">
                  <span className="h-3 w-3 rounded-full bg-brand-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">{booking.address}</p>
                  <p className="text-xs text-text-secondary">{booking.detail}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="inline-flex h-12 items-center justify-center rounded-xl bg-surface-muted text-sm font-semibold text-text-primary transition-colors hover:bg-slate-100"
                >
                  {booking.secondary}
                </button>
                <Link
                  href="/customer/request"
                  className={`inline-flex h-12 items-center justify-center rounded-xl text-sm font-semibold text-white ${
                    booking.status === '완료' ? 'bg-brand-secondary' : 'bg-brand-primary'
                  }`}
                >
                  {booking.primary}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </UserPage>
  );
}
