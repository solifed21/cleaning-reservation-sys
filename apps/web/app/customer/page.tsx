import Link from 'next/link';
import { StatusBadge, SurfaceCard, UserTopNav } from '../prototype-ui';

const quickActions = [
  {
    title: '새 예약 만들기',
    description: '서비스 유형, 일정, 주소, 요청사항을 입력해 예약을 만듭니다.',
    href: '/customer/request',
  },
  {
    title: '내 예약 보기',
    description: '상태별 예약 목록을 보고 확정 대기, 진행중, 완료 이력을 확인합니다.',
    href: '/customer/bookings',
  },
  {
    title: '프로필 관리',
    description: '내 기본 정보와 자주 쓰는 주소, 알림 선호를 관리하는 화면으로 확장할 수 있습니다.',
    href: '/login',
  },
];

const recentBookings = [
  {
    title: '이사 전 전체 청소',
    when: '2026.03.28 (토) 10:00',
    where: '창원시 성산구 중앙동',
    amount: '78,000원',
    status: '확정',
    tone: 'success' as const,
  },
  {
    title: '주방 + 욕실 집중 청소',
    when: '2026.03.29 (일) 15:30',
    where: '창원시 의창구 팔용동',
    amount: '52,000원',
    status: '요청됨',
    tone: 'info' as const,
  },
  {
    title: '정기 청소 상담 요청',
    when: '2026.03.31 (화) 19:00',
    where: '창원시 진해구 이동',
    amount: '64,000원',
    status: '완료',
    tone: 'neutral' as const,
  },
];

const flowSteps = [
  '서비스와 평수를 먼저 선택합니다.',
  '원하는 날짜와 시간을 고릅니다.',
  '주소와 상세 위치를 입력합니다.',
  '요청사항과 예산을 확인합니다.',
  '최종 확인 후 예약을 제출합니다.',
];

export default function CustomerHomePage() {
  return (
    <main className="min-h-screen">
      <UserTopNav current="/customer" />

      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <SurfaceCard className="bg-[linear-gradient(135deg,#ffffff_0%,#f0f9ff_54%,#ecfeff_100%)] p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-primary">Customer Home</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-text-primary sm:text-5xl">
              예약 생성부터 완료 후 리뷰까지, 요청자 흐름을 웹 화면으로 옮겼습니다.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-text-secondary sm:text-lg">
              모바일 문서의 Wizard 구조를 그대로 가져오되, 웹에서는 최근 예약 요약과 빠른 액션을 한
              페이지에서 먼저 보여주는 방식으로 재배치했습니다.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/customer/request"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-brand-primary px-5 text-sm font-semibold text-text-onbrand transition hover:bg-brand-primary-hover"
              >
                예약 만들기
              </Link>
              <Link
                href="/customer/bookings"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-border px-5 text-sm font-semibold text-text-primary"
              >
                예약 목록 보기
              </Link>
            </div>
          </SurfaceCard>

          <SurfaceCard className="p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-primary">Quick Actions</p>
            <div className="mt-5 space-y-4">
              {quickActions.map((action) => (
                <article key={action.title} className="rounded-3xl border border-border bg-surface-subtle p-4">
                  <p className="text-lg font-semibold text-text-primary">{action.title}</p>
                  <p className="mt-2 text-sm leading-6 text-text-secondary">{action.description}</p>
                  <Link
                    href={action.href}
                    className="mt-4 inline-flex h-10 items-center justify-center rounded-xl border border-border px-4 text-sm font-semibold text-text-primary"
                  >
                    보기
                  </Link>
                </article>
              ))}
            </div>
          </SurfaceCard>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <SurfaceCard className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-primary">Recent Bookings</p>
                <h2 className="mt-3 text-2xl font-semibold text-text-primary">최근 예약 요약</h2>
              </div>
              <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-text-secondary">
                상태 우선 정렬
              </span>
            </div>

            <div className="mt-6 space-y-4">
              {recentBookings.map((booking) => (
                <article key={`${booking.title}-${booking.when}`} className="rounded-3xl border border-border bg-surface-subtle p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-lg font-semibold text-text-primary">{booking.title}</p>
                      <p className="mt-2 text-sm text-text-secondary">{booking.when}</p>
                      <p className="mt-1 text-sm text-text-secondary">{booking.where}</p>
                    </div>
                    <StatusBadge label={booking.status} tone={booking.tone} />
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-4">
                    <p className="text-lg font-semibold tabular-nums text-text-primary">{booking.amount}</p>
                    <Link href="/customer/bookings" className="text-sm font-semibold text-brand-primary">
                      상세 보기
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </SurfaceCard>

          <SurfaceCard className="p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-primary">Booking Wizard</p>
            <h2 className="mt-3 text-2xl font-semibold text-text-primary">예약 생성 5단계</h2>
            <div className="mt-6 space-y-3">
              {flowSteps.map((step, index) => (
                <article key={step} className="flex gap-4 rounded-3xl border border-border bg-surface-subtle p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-sm font-semibold text-brand-primary">
                    {index + 1}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text-primary">Step {index + 1}</p>
                    <p className="mt-1 text-sm leading-6 text-text-secondary">{step}</p>
                  </div>
                </article>
              ))}
            </div>
          </SurfaceCard>
        </section>
      </div>
    </main>
  );
}
