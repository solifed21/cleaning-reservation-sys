import { StatusBadge, SurfaceCard, UserTopNav } from '../prototype-ui';

const pendingJobs = [
  {
    title: '이사 전 원룸 청소',
    meta: '2026.03.28 (토) 10:00 · 창원시 성산구 중앙동',
    detail: '8평 원룸 · 욕실 포함 · 고객 예산 78,000원',
    tone: 'info' as const,
  },
  {
    title: '주방 집중 청소',
    meta: '2026.03.29 (일) 15:30 · 창원시 마산회원구 합성동',
    detail: '주방 + 창문 · 고객 예산 55,000원',
    tone: 'warning' as const,
  },
];

const activeSchedule = [
  { label: '오늘 진행 예정', value: '3건' },
  { label: '확정된 예약', value: '12건' },
  { label: '완료율', value: '98%' },
];

export default function CleanerHomePage() {
  return (
    <main className="min-h-screen">
      <UserTopNav current="/cleaner" />

      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <SurfaceCard className="bg-[linear-gradient(135deg,#ffffff_0%,#f0fdf4_52%,#ecfeff_100%)] p-6 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-primary">Cleaner Home</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-text-primary sm:text-5xl">
              제공자는 웹에서 대기 일감을 보고 수락, 일정 관리, 완료 처리 흐름을 확인합니다.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-text-secondary sm:text-lg">
              문서의 예약 상태 전이 흐름을 중심으로, 일감 탐색과 일정 관리를 한 화면에 묶었습니다.
            </p>
          </SurfaceCard>

          <SurfaceCard className="p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-primary">Schedule Summary</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {activeSchedule.map((item) => (
                <article key={item.label} className="rounded-3xl border border-border bg-surface-subtle px-4 py-4">
                  <p className="text-sm text-text-secondary">{item.label}</p>
                  <p className="mt-3 text-2xl font-semibold tabular-nums text-text-primary">{item.value}</p>
                </article>
              ))}
            </div>
          </SurfaceCard>
        </section>

        <SurfaceCard className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-primary">Pending Jobs</p>
              <h2 className="mt-3 text-2xl font-semibold text-text-primary">수락 가능한 일감</h2>
            </div>
            <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-text-secondary">
              CONFLICT 대응 필요
            </span>
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-2">
            {pendingJobs.map((job) => (
              <article key={job.title} className="rounded-3xl border border-border bg-surface-subtle p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-text-primary">{job.title}</p>
                    <p className="mt-2 text-sm text-text-secondary">{job.meta}</p>
                  </div>
                  <StatusBadge label="요청됨" tone={job.tone} />
                </div>
                <p className="mt-4 text-sm leading-6 text-text-secondary">{job.detail}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <button className="inline-flex h-10 items-center justify-center rounded-xl bg-brand-primary px-4 text-sm font-semibold text-text-onbrand">
                    수락하기
                  </button>
                  <button className="inline-flex h-10 items-center justify-center rounded-xl border border-border px-4 text-sm font-semibold text-text-primary">
                    상세 보기
                  </button>
                </div>
              </article>
            ))}
          </div>
        </SurfaceCard>
      </div>
    </main>
  );
}
