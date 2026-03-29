const performanceMetrics = [
  { label: '오늘의 일감', value: '5', detail: '건 예정' },
  { label: '나의 평점', value: '4.9', detail: '상위 5%' },
  { label: '이번 달 정산 예정', value: '1,200,000', detail: '상세보기' },
];

const pendingJobs = [
  {
    title: '창원시 성산구 상남동 아파트',
    meta: '현재 위치에서 0.8km',
    amount: '55,000원',
    tags: ['3시간', '반려동물', '거주청소'],
    badge: '긴급',
    helper: '마감 12분 전',
    urgent: true,
  },
  {
    title: '창원시 의창구 중동 원룸',
    meta: '현재 위치에서 1.5km',
    amount: '38,000원',
    tags: ['2시간', '이사청소'],
    badge: 'New',
    helper: '등록 5분 전',
  },
  {
    title: '마산회원구 양덕동 오피스텔',
    meta: '현재 위치에서 2.4km',
    amount: '42,000원',
    tags: ['2.5시간', '정기관리'],
    badge: '정기고객',
    helper: '',
  },
];

export default function CleanerHomePage() {
  return (
    <main className="min-h-screen bg-[#f8fafc] pb-24">
      <header className="fixed top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-xl shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="font-headline text-xl font-extrabold tracking-tight text-slate-900">창원클린</div>
          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-2 md:flex">
              <span className="rounded-full border border-green-100 bg-green-50 px-2 py-0.5 text-[11px] font-semibold text-status-success">
                신원인증 완료
              </span>
              <span className="rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-brand-primary">
                보험 활성
              </span>
            </div>
            <button type="button" aria-label="알림" className="h-10 w-10 rounded-full text-text-secondary">
              ○
            </button>
            <button type="button" aria-label="프로필" className="h-10 w-10 rounded-full text-text-secondary">
              ◎
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto mt-20 w-full max-w-7xl px-4 sm:px-6">
        <section className="mb-10 grid gap-4 md:grid-cols-3">
          {performanceMetrics.map((metric) => (
            <article key={metric.label} className="rounded-xl border border-slate-200 bg-white p-5">
              <p className="mb-2 text-[13px] font-medium text-text-secondary">{metric.label}</p>
              <div className="flex items-baseline gap-2">
                <span className="font-headline text-3xl font-bold tabular-nums text-text-primary">{metric.value}</span>
                <span className="text-sm font-medium text-text-tertiary">{metric.detail}</span>
              </div>
            </article>
          ))}
        </section>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-headline text-lg font-bold">수락 가능한 일감</h3>
            <p className="mt-1 text-sm text-text-secondary">판단에 필요한 거리, 수익, 긴급도를 한 카드에 모았습니다.</p>
          </div>
          <div className="rounded-lg bg-slate-100 p-1">
            <div className="flex">
              <button type="button" className="rounded-md bg-white px-4 py-1.5 text-[13px] font-bold shadow-sm">
                목록
              </button>
              <button type="button" className="px-4 py-1.5 text-[13px] font-medium text-text-secondary">
                지도
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {pendingJobs.map((job) => (
            <article
              key={job.title}
              className={`overflow-hidden rounded-lg border bg-white ${
                job.urgent ? 'border-slate-200 border-l-4 border-l-status-danger' : 'border-slate-200'
              }`}
            >
              <div className="px-6 py-5">
                <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="mb-2 flex items-center gap-2">
                      <span
                        className={`rounded border px-2 py-0.5 text-[10px] font-bold ${
                          job.urgent
                            ? 'border-red-100 bg-red-50 text-status-danger'
                            : job.badge === '정기고객'
                              ? 'border-green-100 bg-green-50 text-status-success'
                              : 'border-blue-100 bg-blue-50 text-brand-primary'
                        }`}
                      >
                        {job.badge}
                      </span>
                      {job.helper ? <span className="text-[11px] font-semibold text-text-secondary">{job.helper}</span> : null}
                    </div>
                    <h4 className="text-lg font-bold text-text-primary">{job.title}</h4>
                    <p className="text-[13px] text-text-secondary">{job.meta}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-headline text-2xl font-bold tabular-nums text-text-primary">{job.amount}</p>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-text-tertiary">Estimated Earning</p>
                  </div>
                </div>

                <div className="mb-6 flex flex-wrap gap-2">
                  {job.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded border border-slate-100 bg-slate-50 px-2.5 py-1 text-[12px] font-medium text-text-secondary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    className="flex-1 rounded bg-brand-primary py-3 text-sm font-bold text-white transition-colors hover:bg-brand-primary-hover"
                  >
                    일감 수락하기
                  </button>
                  <button
                    type="button"
                    className="rounded border border-slate-200 px-5 py-3 text-sm font-bold text-text-secondary transition-colors hover:bg-slate-50"
                  >
                    상세
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      <nav className="fixed bottom-0 z-50 w-full rounded-t-2xl border-t border-slate-100 bg-white/90 backdrop-blur-xl shadow-[0_-4px_20px_rgba(0,52,102,0.05)]">
        <div className="mx-auto flex h-20 max-w-md items-center justify-around px-4">
          {['홈', '내 일정', '정산', '마이'].map((label, index) => (
            <div
              key={label}
              className={`flex flex-col items-center justify-center rounded-xl px-4 py-1.5 text-[11px] ${
                index === 0 ? 'bg-brand-soft font-bold text-brand-primary' : 'font-medium text-text-secondary'
              }`}
            >
              <span className="mb-1 h-4 w-4 rounded-full border-2 border-current" />
              {label}
            </div>
          ))}
        </div>
      </nav>
    </main>
  );
}
