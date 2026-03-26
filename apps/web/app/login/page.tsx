import Link from 'next/link';
import { SurfaceCard, UserTopNav } from '../prototype-ui';

const roleCards = [
  {
    title: '요청자 로그인',
    description: '청소 예약 생성, 예약 상태 추적, 메시지와 리뷰 확인 흐름으로 이동합니다.',
    href: '/customer',
    cta: '요청자로 둘러보기',
  },
  {
    title: '청소 제공자 로그인',
    description: '대기 중인 일감 확인, 수락/완료 처리, 일정 관리 화면으로 이동합니다.',
    href: '/cleaner',
    cta: '제공자로 둘러보기',
  },
];

export default function LoginPage() {
  return (
    <main className="min-h-screen">
      <UserTopNav current="/login" />

      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <SurfaceCard className="overflow-hidden bg-[linear-gradient(145deg,#0f172a_0%,#1e293b_52%,#0f172a_100%)] p-6 text-white sm:p-8">
            <div className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-blue-100">
              Unified Entry
            </div>
            <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl">
              웹에서도 요청자와 제공자 모두 같은 서비스 흐름으로 진입합니다.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
              소셜 로그인 이후 역할에 따라 다른 홈으로 보내는 구조를 기준으로, 현재는 설계 검토용
              데모 진입 버튼을 함께 두었습니다.
            </p>

            <div className="mt-8 space-y-4">
              <article className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-100">OAuth</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <button className="inline-flex h-12 items-center justify-center rounded-xl bg-[#FEE500] px-4 text-sm font-semibold text-slate-950">
                    카카오로 계속
                  </button>
                  <button className="inline-flex h-12 items-center justify-center rounded-xl bg-[#03C75A] px-4 text-sm font-semibold text-white">
                    네이버로 계속
                  </button>
                </div>
              </article>

              <article className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm leading-6 text-slate-300">
                  실제 구현 시 로그인 후 `role`에 따라 요청자 홈 또는 제공자 홈으로 자동 분기됩니다.
                </p>
              </article>
            </div>
          </SurfaceCard>

          <SurfaceCard className="p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-primary">로그인 프로토타입</p>
            <h2 className="mt-3 text-3xl font-semibold text-text-primary">역할별 진입 경로 확인</h2>
            <p className="mt-4 text-sm leading-6 text-text-secondary">
              인증이 붙기 전이므로 아래 버튼은 역할별 사용자 화면으로 이동합니다. 이후 Better Auth와
              세션을 붙이면 이 구조를 그대로 실제 로그인 흐름으로 바꿀 수 있습니다.
            </p>

            <div className="mt-8 grid gap-4">
              {roleCards.map((card) => (
                <article key={card.title} className="rounded-3xl border border-border bg-surface-subtle p-5">
                  <p className="text-lg font-semibold text-text-primary">{card.title}</p>
                  <p className="mt-2 text-sm leading-6 text-text-secondary">{card.description}</p>
                  <Link
                    href={card.href}
                    className="mt-5 inline-flex h-11 items-center justify-center rounded-xl bg-brand-primary px-4 text-sm font-semibold text-text-onbrand transition hover:bg-brand-primary-hover"
                  >
                    {card.cta}
                  </Link>
                </article>
              ))}
            </div>

            <div className="mt-6 rounded-3xl border border-border bg-white px-4 py-4 text-sm leading-6 text-text-secondary">
              관리자용 로그인은 별도 경로로 분리했습니다.
              <Link href="/admin/login" className="ml-2 font-semibold text-brand-primary">
                /admin/login 보기
              </Link>
            </div>
          </SurfaceCard>
        </section>
      </div>
    </main>
  );
}
