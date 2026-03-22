const pillars = [
  {
    title: '예약 흐름 정리',
    description: '요청 등록부터 완료 리뷰까지의 상태 전이를 한 화면 구조에 맞게 다시 정리합니다.',
  },
  {
    title: '운영 대시보드 준비',
    description: '관리자 화면과 API를 Next.js App Router와 Route Handlers 기준으로 분리합니다.',
  },
  {
    title: 'DB 레이어 재사용',
    description: '기존 Drizzle 스키마는 유지하고 Next.js 서버 레이어에서 그대로 연결합니다.',
  },
];

const milestones = [
  '요청자와 청소 제공자용 핵심 플로우 정의',
  '예약, 메시지, 리뷰, 알림 스키마 초안 작성',
  'Next.js App Router 기반 웹 엔트리 포인트 생성',
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(215,238,252,0.9),_transparent_38%),linear-gradient(180deg,#f8fbfd_0%,#eef6fb_100%)] text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-10 sm:px-10 lg:px-12">
        <header className="rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-card backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-700">
            Cleaning Reservation System
          </p>
          <div className="mt-6 grid gap-8 lg:grid-cols-[1.4fr_0.9fr]">
            <div>
              <h1 className="max-w-3xl font-serif text-4xl leading-tight text-slate-950 sm:text-5xl">
                창원 원룸 청소 예약 플랫폼을 Next.js 중심 구조로 전환했습니다.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                웹 앱은 Next.js App Router를 기준으로 재구성하고, 기존 Drizzle 스키마는 그대로 살려서
                예약 도메인부터 다시 확장할 수 있게 잡아두었습니다.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <span className="rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-medium text-cyan-900">
                  Next.js App Router
                </span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
                  Route Handlers
                </span>
                <span className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
                  Drizzle ORM
                </span>
              </div>
            </div>

            <section className="rounded-[1.5rem] bg-slate-950 p-6 text-white">
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-200">Current focus</p>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-200">
                {milestones.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-cyan-300" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
                `/api/health` Route Handler를 함께 추가해 Next.js 서버 레이어 진입점도 바로 확인할 수 있습니다.
              </p>
            </section>
          </div>
        </header>

        <section className="mt-8 grid gap-5 md:grid-cols-3">
          {pillars.map((pillar) => (
            <article
              key={pillar.title}
              className="rounded-[1.5rem] border border-white/70 bg-white/75 p-6 shadow-card backdrop-blur"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700">Pillar</p>
              <h2 className="mt-4 text-2xl font-semibold text-slate-950">{pillar.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">{pillar.description}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
