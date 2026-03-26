import Link from 'next/link';

const securityRules = [
  '로그인 실패 5회 시 15분 동안 계정이 잠겨요.',
  '관리자 세션은 일정 시간 미사용 시 자동 만료돼요.',
  '접속 로그와 IP 이력은 운영 감사 용도로 기록돼요.',
];

const supportItems = [
  {
    label: '오늘 접수된 문의',
    value: '18건',
  },
  {
    label: '긴급 확인 예약',
    value: '7건',
  },
  {
    label: '평균 응답 시간',
    value: '12분',
  },
];

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative overflow-hidden rounded-[2rem] border border-border bg-slate-950 px-6 py-8 text-white shadow-elevated sm:px-8 sm:py-10">
          <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,_rgba(96,165,250,0.35),_transparent_58%)]" />
          <div className="relative flex h-full flex-col">
            <div className="inline-flex w-fit items-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-blue-100">
              Admin Console
            </div>
            <div className="mt-8 max-w-xl">
              <p className="text-sm font-medium uppercase tracking-[0.28em] text-blue-200">
                Cleaning Reservation System
              </p>
              <h1 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">
                운영팀이 예약 흐름과 분쟁 이슈를 한 화면에서 관리합니다.
              </h1>
              <p className="mt-5 max-w-lg text-base leading-7 text-slate-300 sm:text-lg">
                관리자 대시보드 전용 로그인 화면입니다. 일반 사용자는 `/login`에서 요청자 또는
                제공자 흐름으로 진입합니다.
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {supportItems.map((item) => (
                <article
                  key={item.label}
                  className="rounded-3xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur"
                >
                  <p className="text-sm text-slate-300">{item.label}</p>
                  <p className="mt-3 text-2xl font-semibold tabular-nums text-white">{item.value}</p>
                </article>
              ))}
            </div>

            <div className="mt-auto rounded-[1.75rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-100">
                Security Rules
              </p>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-200">
                {securityRules.map((rule) => (
                  <li key={rule} className="flex gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-300" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center rounded-[2rem] border border-border bg-white/90 p-4 shadow-card backdrop-blur sm:p-6">
          <div className="w-full max-w-lg rounded-[1.75rem] border border-border bg-surface-elevated p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-primary">
                  관리자 로그인
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-text-primary">운영 계정으로 접속</h2>
              </div>
              <span className="rounded-full border border-status-info/20 bg-status-info-soft px-3 py-1 text-xs font-medium text-status-info">
                Prototype
              </span>
            </div>

            <p className="mt-4 text-sm leading-6 text-text-secondary">
              이메일과 비밀번호 입력 흐름을 먼저 배치했습니다. 인증 연동 전 단계라서 아래 버튼은
              대시보드 미리보기로 이동합니다.
            </p>

            <form className="mt-8 space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-text-primary">이메일</span>
                <input
                  type="email"
                  placeholder="admin@cleaning-crs.co.kr"
                  className="h-12 w-full rounded-xl border border-border bg-surface-default px-4 text-text-primary placeholder:text-text-tertiary"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-text-primary">비밀번호</span>
                <div className="relative">
                  <input
                    type="password"
                    placeholder="비밀번호를 입력해 주세요"
                    className="h-12 w-full rounded-xl border border-border bg-surface-default px-4 pr-16 text-text-primary placeholder:text-text-tertiary"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-text-secondary">
                    표시
                  </span>
                </div>
              </label>

              <div className="rounded-2xl border border-status-warning/20 bg-status-warning-soft px-4 py-3 text-sm leading-6 text-amber-900">
                로그인 실패 시 원인을 함께 안내하도록 설계했습니다. 예: “비밀번호가 맞지 않아요.
                다시 입력해 주세요.”
              </div>

              <Link
                href="/admin"
                className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-brand-primary px-4 text-sm font-semibold text-text-onbrand transition hover:bg-brand-primary-hover"
              >
                관리자 로그인
              </Link>
            </form>

            <div className="mt-6 flex flex-col gap-3 text-sm text-text-secondary sm:flex-row sm:items-center sm:justify-between">
              <p>2단계 인증과 비밀번호 재설정은 Post-MVP 범위입니다.</p>
              <Link href="/login" className="font-semibold text-brand-primary">
                사용자 로그인 보기
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
