import Link from 'next/link';
import { StatusBadge, SurfaceCard, UserTopNav } from './prototype-ui';

const roleCards = [
  {
    title: '요청자',
    description: '주소와 일정, 요청사항을 입력해 청소 예약을 생성하고 상태를 추적합니다.',
    href: '/customer',
    cta: '요청자 화면 보기',
  },
  {
    title: '청소 제공자',
    description: '대기 중인 일감을 살펴보고 수락, 일정 관리, 완료 처리 흐름을 확인합니다.',
    href: '/cleaner',
    cta: '제공자 화면 보기',
  },
  {
    title: '운영자',
    description: '회원, 예약, 리뷰 현황을 웹 대시보드에서 한 번에 모니터링합니다.',
    href: '/admin',
    cta: '관리자 화면 보기',
  },
];

const serviceSteps = [
  '로그인 후 요청자 또는 제공자 역할을 선택합니다.',
  '요청자는 예약을 만들고, 제공자는 대기 일감을 검토합니다.',
  '예약 상태와 메시지, 리뷰 흐름을 웹에서 이어서 확인합니다.',
];

const exampleBookings = [
  {
    title: '이사 전 원룸 청소',
    meta: '2026.03.28 10:00 · 창원시 성산구',
    amount: '78,000원',
    status: '확정',
    tone: 'success' as const,
  },
  {
    title: '욕실 집중 청소',
    meta: '2026.03.29 15:30 · 창원시 의창구',
    amount: '52,000원',
    status: '요청됨',
    tone: 'info' as const,
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <UserTopNav current="/" />

      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <SurfaceCard className="overflow-hidden bg-[linear-gradient(135deg,#ffffff_0%,#f8fbff_48%,#eef6ff_100%)] p-6 sm:p-8">
            <div className="inline-flex items-center rounded-full border border-brand-primary/15 bg-brand-soft px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-brand-primary">
              User + Admin Web
            </div>
            <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-tight text-text-primary sm:text-5xl">
              청소 예약 서비스를 웹에서도 직접 사용하고, 운영팀은 별도 어드민으로 관리합니다.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-text-secondary sm:text-lg">
              기존 문서의 모바일 사용자 흐름을 웹으로 확장하고, 관리자 대시보드는 `/admin` 아래에
              독립적으로 유지하는 구조로 재정렬했습니다.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/login"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-brand-primary px-5 text-sm font-semibold text-text-onbrand transition hover:bg-brand-primary-hover"
              >
                사용자 로그인 보기
              </Link>
              <Link
                href="/customer/request"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-border px-5 text-sm font-semibold text-text-primary"
              >
                예약 생성 화면 보기
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {serviceSteps.map((step, index) => (
                <article key={step} className="rounded-3xl border border-border bg-white/90 px-4 py-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-primary">
                    Step {index + 1}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-text-secondary">{step}</p>
                </article>
              ))}
            </div>
          </SurfaceCard>

          <SurfaceCard className="bg-slate-950 p-6 text-white sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-blue-100">Live Preview</p>
            <h2 className="mt-4 text-2xl font-semibold leading-tight">
              웹 사용자 흐름에서 바로 확인할 수 있는 핵심 상태
            </h2>
            <div className="mt-6 space-y-4">
              {exampleBookings.map((booking) => (
                <article key={booking.title} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-base font-semibold text-white">{booking.title}</p>
                      <p className="mt-2 text-sm text-slate-300">{booking.meta}</p>
                    </div>
                    <StatusBadge label={booking.status} tone={booking.tone} />
                  </div>
                  <p className="mt-4 text-lg font-semibold tabular-nums text-white">{booking.amount}</p>
                </article>
              ))}
            </div>
            <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 px-4 py-4 text-sm leading-6 text-slate-300">
              요청자와 제공자 화면은 설계 검토용 프로토타입이며, 이후 실제 인증과 API를 붙이는
              단계로 이어질 수 있습니다.
            </div>
          </SurfaceCard>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          {roleCards.map((card) => (
            <SurfaceCard key={card.title} className="p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-primary">
                {card.title}
              </p>
              <h2 className="mt-4 text-2xl font-semibold text-text-primary">{card.title} 흐름</h2>
              <p className="mt-3 text-sm leading-7 text-text-secondary">{card.description}</p>
              <Link
                href={card.href}
                className="mt-6 inline-flex h-11 items-center justify-center rounded-xl border border-border px-4 text-sm font-semibold text-text-primary"
              >
                {card.cta}
              </Link>
            </SurfaceCard>
          ))}
        </section>
      </div>
    </main>
  );
}
