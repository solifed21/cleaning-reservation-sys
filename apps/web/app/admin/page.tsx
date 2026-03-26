import Link from 'next/link';

type Tone = 'info' | 'success' | 'warning' | 'danger' | 'neutral';

type NavItem = {
  label: string;
  href: string;
  active?: boolean;
  disabled?: boolean;
};

const navGroups: Array<{ title: string; items: NavItem[] }> = [
  {
    title: 'Overview',
    items: [
      { label: '대시보드 홈', href: '/admin', active: true },
      { label: '회원 관리', href: '#' },
      { label: '예약 관리', href: '#' },
      { label: '리뷰 관리', href: '#' },
    ],
  },
  {
    title: 'Operations',
    items: [
      { label: '공지사항', href: '#' },
      { label: '설정', href: '#', disabled: true },
    ],
  },
];

const metrics = [
  {
    label: '총 사용자 수',
    value: '12,480',
    detail: '요청자 8,460명 · 제공자 4,020명',
    change: '+12.4% 지난 30일',
    tone: 'info',
  },
  {
    label: '오늘의 예약',
    value: '184',
    detail: '대기 38 · 확정 92 · 진행중 21 · 완료 33',
    change: '+16건 전일 대비',
    tone: 'success',
  },
  {
    label: '이번 달 거래액',
    value: '₩28.4M',
    detail: '확정 24.9M · 예상 3.5M',
    change: '+8.1% 지난달 대비',
    tone: 'neutral',
  },
  {
    label: '미처리 문의',
    value: '27',
    detail: '긴급 대응 4건 포함',
    change: '평균 응답 12분',
    tone: 'warning',
  },
] as const;

const signupTrend = [12, 17, 19, 15, 21, 24, 23, 28, 31, 27, 34, 38, 36, 42];

const monthlyRevenue = [
  { label: '10월', value: 31 },
  { label: '11월', value: 42 },
  { label: '12월', value: 48 },
  { label: '1월', value: 55 },
  { label: '2월', value: 63 },
  { label: '3월', value: 71 },
] as const;

const statusDistribution = [
  { label: '요청됨', value: 38, tone: 'info' },
  { label: '확정', value: 92, tone: 'success' },
  { label: '진행중', value: 21, tone: 'warning' },
  { label: '완료', value: 33, tone: 'neutral' },
  { label: '취소됨', value: 11, tone: 'danger' },
] as const;

const recentBookings = [
  {
    id: '#B-2038',
    customer: '김민지',
    cleaner: '이수현',
    schedule: '2026.03.26 14:00',
    area: '창원시 성산구',
    amount: '78,000원',
    status: '확정',
    tone: 'success',
  },
  {
    id: '#B-2037',
    customer: '박도윤',
    cleaner: '-',
    schedule: '2026.03.26 16:00',
    area: '창원시 마산합포구',
    amount: '64,000원',
    status: '요청됨',
    tone: 'info',
  },
  {
    id: '#B-2036',
    customer: '정하은',
    cleaner: '윤태경',
    schedule: '2026.03.26 10:00',
    area: '창원시 의창구',
    amount: '92,000원',
    status: '진행중',
    tone: 'warning',
  },
  {
    id: '#B-2035',
    customer: '장예준',
    cleaner: '송하린',
    schedule: '2026.03.25 19:30',
    area: '창원시 진해구',
    amount: '56,000원',
    status: '완료',
    tone: 'neutral',
  },
] as const;

const activities = [
  {
    time: '5분 전',
    title: '새 회원 가입',
    body: 'cleaner.sun@example.com 계정이 청소 제공자로 승인 대기 중입니다.',
  },
  {
    time: '18분 전',
    title: '예약 #B-2038 확정',
    body: '이수현 제공자가 김민지 고객의 이사 청소 요청을 수락했습니다.',
  },
  {
    time: '31분 전',
    title: '리뷰 신고 접수',
    body: '리뷰 #R-0412에 부적절 표현 신고 3건이 누적됐습니다.',
  },
  {
    time: '47분 전',
    title: 'CS 티켓 업데이트',
    body: '환불 문의 티켓 #CS-188이 긴급 우선순위로 상향됐습니다.',
  },
] as const;

const heatmap = [
  { label: '성산구', value: 84 },
  { label: '의창구', value: 67 },
  { label: '마산회원구', value: 58 },
  { label: '마산합포구', value: 46 },
  { label: '진해구', value: 39 },
] as const;

const responseBoard = [
  { title: '신규 제공자 승인', value: '6건', detail: '평균 대기 42분' },
  { title: '강제 취소 검토', value: '3건', detail: '환불 검토 필요' },
  { title: '신고 리뷰 검토', value: '8건', detail: '블라인드 후보 2건' },
] as const;

function toneClasses(tone: Tone) {
  const map: Record<Tone, string> = {
    info: 'border-status-info/20 bg-status-info-soft text-status-info',
    success: 'border-status-success/20 bg-status-success-soft text-status-success',
    warning: 'border-status-warning/20 bg-status-warning-soft text-amber-900',
    danger: 'border-status-danger/20 bg-status-danger-soft text-status-danger',
    neutral: 'border-border bg-surface-subtle text-text-secondary',
  };

  return map[tone];
}

function MetricCard({
  label,
  value,
  detail,
  change,
  tone,
}: {
  label: string;
  value: string;
  detail: string;
  change: string;
  tone: Tone;
}) {
  return (
    <article className="rounded-[1.5rem] border border-border bg-white p-5 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-text-secondary">{label}</p>
          <p className="mt-3 text-3xl font-semibold tabular-nums text-text-primary">{value}</p>
        </div>
        <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${toneClasses(tone)}`}>
          실시간
        </span>
      </div>
      <p className="mt-4 text-sm leading-6 text-text-secondary">{detail}</p>
      <p className="mt-2 text-sm font-medium text-text-primary">{change}</p>
    </article>
  );
}

function StatusBadge({ label, tone }: { label: string; tone: Tone }) {
  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${toneClasses(tone)}`}>
      {label}
    </span>
  );
}

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[248px_minmax(0,1fr)]">
        <aside className="rounded-[2rem] border border-border bg-white p-4 shadow-card lg:sticky lg:top-4 lg:h-[calc(100vh-2rem)]">
          <div className="rounded-[1.5rem] bg-slate-950 p-5 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-100">Admin</p>
            <h1 className="mt-3 text-xl font-semibold">청소 예약 운영실</h1>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              예약, 회원, 리뷰 상태를 하나의 운영 흐름으로 묶은 관리자 홈입니다.
            </p>
          </div>

          <nav className="mt-6 space-y-6">
            {navGroups.map((group) => (
              <div key={group.title}>
                <p className="px-3 text-xs font-semibold uppercase tracking-[0.24em] text-text-tertiary">
                  {group.title}
                </p>
                <ul className="mt-3 space-y-2">
                  {group.items.map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        aria-disabled={item.disabled}
                        className={`flex items-center justify-between rounded-2xl px-3 py-3 text-sm font-medium transition ${
                          item.active
                            ? 'bg-brand-soft text-brand-primary'
                            : item.disabled
                              ? 'cursor-not-allowed text-text-tertiary'
                              : 'text-text-secondary hover:bg-surface-subtle hover:text-text-primary'
                        }`}
                      >
                        <span>{item.label}</span>
                        <span className="text-xs">{item.active ? '현재' : '→'}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          <div className="mt-6 rounded-[1.5rem] border border-border bg-surface-subtle p-4">
            <p className="text-sm font-semibold text-text-primary">운영자 안내</p>
            <p className="mt-2 text-sm leading-6 text-text-secondary">
              실데이터 연결 전이라서 모든 숫자는 문서 기반 목업입니다. 이후 TanStack Query와 Route
              Handler로 교체할 수 있게 구조를 맞췄습니다.
            </p>
            <Link
              href="/admin/login"
              className="mt-4 inline-flex h-10 items-center justify-center rounded-xl border border-border px-4 text-sm font-semibold text-text-primary"
            >
              로그인 화면 보기
            </Link>
          </div>
        </aside>

        <div className="space-y-4">
          <header className="overflow-hidden rounded-[2rem] border border-border bg-white shadow-card">
            <div className="border-b border-border px-5 py-4 sm:px-6">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm font-medium text-text-secondary">Admin / Dashboard</p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-tight text-text-primary sm:text-[2.25rem]">
                    오늘 운영 상태를 먼저 확인하세요.
                  </h2>
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-text-secondary sm:text-base">
                    상태, 날짜, 지역, 금액 순으로 정보를 정렬해 문서에서 정의한 “Clean × Trust”
                    원칙을 화면 전체에 반영했습니다.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button className="inline-flex h-11 items-center justify-center rounded-xl border border-border px-4 text-sm font-semibold text-text-primary">
                    데이터 새로고침
                  </button>
                  <button className="inline-flex h-11 items-center justify-center rounded-xl bg-brand-primary px-4 text-sm font-semibold text-text-onbrand transition hover:bg-brand-primary-hover">
                    긴급 예약 확인
                  </button>
                </div>
              </div>
            </div>

            <div className="grid gap-4 px-5 py-5 sm:grid-cols-2 xl:grid-cols-4 sm:px-6">
              {metrics.map((metric) => (
                <MetricCard key={metric.label} {...metric} />
              ))}
            </div>
          </header>

          <section className="grid gap-4 xl:grid-cols-[1.45fr_0.95fr]">
            <div className="space-y-4">
              <article className="rounded-[2rem] border border-border bg-white p-5 shadow-card sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-primary">
                      가입자 추이
                    </p>
                    <h3 className="mt-3 text-xl font-semibold text-text-primary">
                      최근 14일 신규 가입 흐름
                    </h3>
                  </div>
                  <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-text-secondary">
                    요청자 / 제공자 합산
                  </span>
                </div>

                <div className="mt-8 flex h-56 items-end gap-2">
                  {signupTrend.map((value, index) => {
                    const height = `${(value / 42) * 100}%`;
                    const isPeak = index >= signupTrend.length - 3;

                    return (
                      <div key={`${value}-${index}`} className="flex flex-1 flex-col items-center gap-3">
                        <div className="text-xs font-medium tabular-nums text-text-tertiary">{value}</div>
                        <div className="flex h-full w-full items-end rounded-full bg-surface-subtle px-1 pb-1">
                          <div
                            className={`w-full rounded-full ${
                              isPeak ? 'bg-brand-primary' : 'bg-slate-300'
                            }`}
                            style={{ height }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-border bg-surface-subtle px-4 py-3">
                    <p className="text-sm text-text-secondary">누적 가입자</p>
                    <p className="mt-2 text-xl font-semibold tabular-nums text-text-primary">12,480명</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-surface-subtle px-4 py-3">
                    <p className="text-sm text-text-secondary">제공자 비율</p>
                    <p className="mt-2 text-xl font-semibold tabular-nums text-text-primary">32.2%</p>
                  </div>
                  <div className="rounded-2xl border border-border bg-surface-subtle px-4 py-3">
                    <p className="text-sm text-text-secondary">당일 승인 대기</p>
                    <p className="mt-2 text-xl font-semibold tabular-nums text-text-primary">6건</p>
                  </div>
                </div>
              </article>

              <article className="rounded-[2rem] border border-border bg-white p-5 shadow-card sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-primary">
                      예약 상태 분포
                    </p>
                    <h3 className="mt-3 text-xl font-semibold text-text-primary">
                      상태와 개입 우선순위를 동시에 확인
                    </h3>
                  </div>
                  <div className="rounded-2xl border border-border bg-surface-subtle px-4 py-3 text-sm text-text-secondary">
                    오늘 전체 예약 <span className="font-semibold tabular-nums text-text-primary">184건</span>
                  </div>
                </div>

                <div className="mt-8 overflow-hidden rounded-full bg-surface-subtle">
                  <div className="flex h-4 w-full">
                    {statusDistribution.map((item) => (
                      <div
                        key={item.label}
                        className={
                          item.tone === 'success'
                            ? 'bg-status-success'
                            : item.tone === 'warning'
                              ? 'bg-status-warning'
                              : item.tone === 'danger'
                                ? 'bg-status-danger'
                                : item.tone === 'neutral'
                                  ? 'bg-slate-400'
                                  : 'bg-status-info'
                        }
                        style={{
                          width: `${(item.value / 195) * 100}%`,
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {statusDistribution.map((item) => (
                    <article
                      key={item.label}
                      className="flex items-center justify-between rounded-2xl border border-border bg-surface-subtle px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <StatusBadge label={item.label} tone={item.tone} />
                      </div>
                      <span className="text-sm font-semibold tabular-nums text-text-primary">
                        {item.value}건
                      </span>
                    </article>
                  ))}
                </div>
              </article>
            </div>

            <div className="space-y-4">
              <article className="rounded-[2rem] border border-border bg-white p-5 shadow-card sm:p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-primary">
                  거래액 추이
                </p>
                <h3 className="mt-3 text-xl font-semibold text-text-primary">
                  최근 6개월 월별 거래액
                </h3>

                <div className="mt-8 space-y-4">
                  {monthlyRevenue.map((item) => (
                    <div key={item.label}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-text-secondary">{item.label}</span>
                        <span className="font-semibold tabular-nums text-text-primary">
                          {item.value}M
                        </span>
                      </div>
                      <div className="mt-2 h-3 overflow-hidden rounded-full bg-surface-subtle">
                        <div
                          className="h-full rounded-full bg-brand-primary"
                          style={{ width: `${(item.value / 71) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-[2rem] border border-border bg-white p-5 shadow-card sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-primary">
                      운영 보드
                    </p>
                    <h3 className="mt-3 text-xl font-semibold text-text-primary">
                      CS와 중재 이슈 우선순위
                    </h3>
                  </div>
                  <StatusBadge label="미처리 27건" tone="warning" />
                </div>

                <div className="mt-6 space-y-3">
                  {responseBoard.map((item) => (
                    <article
                      key={item.title}
                      className="rounded-2xl border border-border bg-surface-subtle px-4 py-4"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-sm font-medium text-text-primary">{item.title}</p>
                        <span className="text-lg font-semibold tabular-nums text-text-primary">
                          {item.value}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-text-secondary">{item.detail}</p>
                    </article>
                  ))}
                </div>
              </article>

              <article className="rounded-[2rem] border border-border bg-white p-5 shadow-card sm:p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-primary">
                  지역별 활동
                </p>
                <h3 className="mt-3 text-xl font-semibold text-text-primary">
                  창원 주요 지역 예약 빈도
                </h3>
                <div className="mt-6 grid gap-3">
                  {heatmap.map((item) => (
                    <div key={item.label} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-text-secondary">{item.label}</span>
                        <span className="font-semibold tabular-nums text-text-primary">
                          {item.value}건
                        </span>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-surface-subtle">
                        <div
                          className="h-full rounded-full bg-[linear-gradient(90deg,#bfdbfe_0%,#2563eb_100%)]"
                          style={{ width: `${(item.value / 84) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-[1.35fr_0.95fr]">
            <article className="rounded-[2rem] border border-border bg-white p-5 shadow-card sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-primary">
                    최근 예약
                  </p>
                  <h3 className="mt-3 text-xl font-semibold text-text-primary">
                    상태, 일정, 지역 순으로 정렬한 운영 테이블
                  </h3>
                </div>
                <button className="inline-flex h-10 items-center justify-center rounded-xl border border-border px-4 text-sm font-semibold text-text-primary">
                  전체 예약 보기
                </button>
              </div>

              <div className="mt-6 overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-y-3">
                  <thead>
                    <tr className="text-left text-sm text-text-secondary">
                      <th className="px-4 pb-1 font-medium">예약 ID</th>
                      <th className="px-4 pb-1 font-medium">요청자</th>
                      <th className="px-4 pb-1 font-medium">제공자</th>
                      <th className="px-4 pb-1 font-medium">일시</th>
                      <th className="px-4 pb-1 font-medium">지역</th>
                      <th className="px-4 pb-1 font-medium text-right">금액</th>
                      <th className="px-4 pb-1 font-medium text-right">상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((booking) => (
                      <tr key={booking.id} className="rounded-2xl bg-surface-subtle text-sm">
                        <td className="rounded-l-2xl px-4 py-4 font-semibold text-text-primary">
                          {booking.id}
                        </td>
                        <td className="px-4 py-4 text-text-primary">{booking.customer}</td>
                        <td className="px-4 py-4 text-text-secondary">{booking.cleaner}</td>
                        <td className="px-4 py-4 text-text-secondary">{booking.schedule}</td>
                        <td className="px-4 py-4 text-text-secondary">{booking.area}</td>
                        <td className="px-4 py-4 text-right font-semibold tabular-nums text-text-primary">
                          {booking.amount}
                        </td>
                        <td className="rounded-r-2xl px-4 py-4 text-right">
                          <StatusBadge label={booking.status} tone={booking.tone} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>

            <article className="rounded-[2rem] border border-border bg-white p-5 shadow-card sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-primary">
                    최근 활동
                  </p>
                  <h3 className="mt-3 text-xl font-semibold text-text-primary">
                    실시간 운영 로그 피드
                  </h3>
                </div>
                <span className="rounded-full border border-status-info/20 bg-status-info-soft px-3 py-1 text-xs font-medium text-status-info">
                  최근 20건 중 일부
                </span>
              </div>

              <div className="mt-6 space-y-4">
                {activities.map((item) => (
                  <article
                    key={`${item.time}-${item.title}`}
                    className="rounded-2xl border border-border bg-surface-subtle px-4 py-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm font-semibold text-text-primary">{item.title}</p>
                      <span className="text-xs font-medium text-text-tertiary">{item.time}</span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-text-secondary">{item.body}</p>
                  </article>
                ))}
              </div>
            </article>
          </section>
        </div>
      </div>
    </main>
  );
}
