import Link from 'next/link';

const metrics = [
  { value: '5분', label: '평균 매칭 시간' },
  { value: '4.9/5', label: '이용자 만족도' },
  { value: '12,408+', label: '누적 서비스 건수' },
  { value: '100%', label: 'AS 책임 보장' },
];

const categories = [
  {
    title: '원룸/투룸 거주청소',
    body: '창원 1인 가구를 위한 맞춤형 패키지. 주방 기름때부터 욕실 물때까지 집중 케어합니다.',
  },
  {
    title: '이사/입주 청소',
    body: '새로운 시작을 위한 살균 중심 청소. 전 세입자의 흔적과 먼지를 꼼꼼하게 정리합니다.',
  },
  {
    title: '정기 청소 구독',
    body: '주 1회 또는 격주 방문으로 생활 리듬에 맞는 쾌적한 주거 환경을 유지할 수 있습니다.',
  },
];

const entryCards = [
  {
    title: '서비스가 필요하신 고객님',
    description: '검증된 청소 매니저를 쉽고 빠르게 만나고, 예약부터 고객센터 도움까지 한 흐름으로 관리합니다.',
    items: ['간편한 예약 요청과 상태 확인', '불만족 시 100% 재청소 보장'],
    href: '/customer/request',
    cta: '서비스 요청하기',
    tone: 'secondary',
  },
  {
    title: '창원클린 파트너 가입',
    description: '원하는 시간에 일하고, 일감 확인부터 수락과 수익 관리까지 파트너 대시보드에서 빠르게 처리합니다.',
    items: ['창원 권역 중심 오더 우선 제공', '주 단위 정산 시스템 운영'],
    href: '/cleaner',
    cta: '파트너 시작하기',
    tone: 'primary',
  },
];

const principles = [
  {
    title: '투명한 정찰제',
    body: '현장에서의 부당한 추가 비용 요구가 없도록 예상 금액과 옵션을 예약 전에 먼저 고정합니다.',
  },
  {
    title: '신원 검증 시스템',
    body: '신원 확인과 기본 검증을 통과한 파트너만 매칭 대상으로 노출합니다.',
  },
  {
    title: '100% 만족 보장',
    body: '청소 완료 후 불만족이 발생하면 24시간 이내 재청소 정책으로 대응합니다.',
  },
];

const footerServices = ['원룸 청소', '이사 청소', '정기 구독', '기업 제휴'];
const footerSupport = ['공지사항', '자주 묻는 질문', '개인정보처리방침', '이용약관'];

const mobileNav = [
  { label: '홈', href: '/' },
  { label: '내예약', href: '/customer/bookings' },
  { label: '문의', href: '/login' },
  { label: '마이', href: '/customer' },
];

export default function HomePage() {
  return (
    <>
      <header className="fixed top-0 z-50 w-full border-b border-border bg-white/90 backdrop-blur-md">
        <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold tracking-tight text-brand-primary">
              창원클린
            </Link>
            <div className="hidden items-center gap-6 md:flex">
              <Link href="/customer/request" className="text-sm font-semibold text-brand-primary">
                서비스
              </Link>
              <Link
                href="/customer/bookings"
                className="text-sm font-medium text-text-secondary transition-colors hover:text-brand-primary"
              >
                이용안내
              </Link>
              <Link
                href="/login"
                className="text-sm font-medium text-text-secondary transition-colors hover:text-brand-primary"
              >
                고객센터
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login" className="px-3 py-1 text-sm font-medium text-text-secondary">
              로그인
            </Link>
            <Link
              href="/customer/request"
              className="rounded bg-brand-primary px-4 py-2 text-sm font-bold text-white"
            >
              시작하기
            </Link>
          </div>
        </nav>
      </header>

      <main className="bg-white pt-14 text-text-primary">
        <section className="relative overflow-hidden border-b border-border bg-[radial-gradient(circle_at_top_right,rgba(21,101,216,0.06),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(21,101,216,0.03),transparent_30%),linear-gradient(180deg,#ffffff_0%,#fbfdff_100%)]">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-24">
            <div>
              <div className="mb-6 inline-flex rounded border border-brand-primary/20 bg-brand-soft px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-brand-primary">
                Changwon Professional Service
              </div>

              <h1 className="font-headline text-4xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                신뢰할 수 있는
                <br />
                <span className="text-brand-primary">창원 원룸 전문 청소</span>
              </h1>

              <p className="mt-6 max-w-md text-lg leading-relaxed text-text-secondary">
                숨은 비용 없는 투명한 정찰제, 100% 만족 보장.
                <br />
                검증된 파트너가 당신의 공간을 책임집니다.
              </p>

              <div className="mt-10 flex max-w-sm flex-col gap-4">
                <Link
                  href="/customer/request"
                  className="flex w-full items-center justify-center gap-2 rounded bg-brand-primary px-8 py-4 text-sm font-bold text-white shadow-sm transition-all hover:bg-brand-primary-hover"
                >
                  실시간 예약 가능 여부 확인
                  <span aria-hidden="true">→</span>
                </Link>

                <div className="flex items-center gap-3 rounded border border-border bg-white px-4 py-3">
                  <div className="flex -space-x-2">
                    <div className="h-6 w-6 rounded-full border-2 border-white bg-slate-200" />
                    <div className="h-6 w-6 rounded-full border-2 border-white bg-slate-300" />
                    <div className="h-6 w-6 rounded-full border-2 border-white bg-slate-400" />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                      </span>
                      <span className="text-[13px] font-bold text-slate-950">
                        현재 14명의 전문가 배정 가능
                      </span>
                    </div>
                    <span className="text-[11px] text-text-secondary">성산구·의창구·진해구 전 지역</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="rounded-lg border border-border bg-white p-2 shadow-sm">
                <img
                  alt="Service Professional"
                  className="h-[500px] w-full rounded object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcUaef_tr7mf3wug6N0qeUfr1fmP4L_ejbit7ScLjk199gSykxjo2FXe3EFRmaJjaTrXp8fyEcpGz7S7-0h_6nkfQ2zQzDurB7B4i_4SZNMT_t5akP9rora2BXvDg5_oEdmjM2e4tPR4jUEJB_HpxAsI4mzbrSpx1rwJf2xRZNAL7cscYm2LA6tuBUYA0Mykj66hTmdPE-czFiQtLBXT1sUqK5w087byJkqeQZUZWVxwUSk5hsyYI6TdDIUn8Hl6gdVXU75wG5SA"
                />
                <div className="mt-4 rounded-b bg-surface-muted p-4">
                  <div className="flex items-center justify-between gap-4 border-t border-border pt-4">
                    <div className="flex flex-col">
                      <span className="mb-1 text-xs text-text-secondary">매니저 실명제 운영</span>
                      <span className="text-sm font-bold text-slate-950">
                        현대해상 1억원 배상책임보험 가입 완료
                      </span>
                    </div>
                    <span className="text-brand-primary">인증됨</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
            <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
              {metrics.map((metric, index) => (
                <div
                  key={metric.label}
                  className={`flex flex-col items-center text-center ${index > 0 ? 'lg:border-l lg:border-border' : ''}`}
                >
                  <span className="font-headline text-3xl font-extrabold text-slate-950 tabular-nums">
                    {metric.value}
                  </span>
                  <span className="mt-1 text-xs font-medium uppercase tracking-tight text-text-secondary">
                    {metric.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-surface-muted py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-950">공간에 맞춘 전문 카테고리</h2>
                <p className="mt-2 text-text-secondary">
                  용도별 최적화된 청소 매뉴얼을 적용합니다.
                </p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {categories.map((category) => (
                <article
                  key={category.title}
                  className="border border-border bg-white p-8 transition-colors hover:border-brand-primary"
                >
                  <span className="mb-6 block text-3xl text-brand-primary">■</span>
                  <h3 className="text-xl font-bold text-slate-950">{category.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-text-secondary">{category.body}</p>
                  <Link
                    href="/customer/request"
                    className="mt-6 inline-flex items-center gap-1 text-xs font-bold text-brand-primary"
                  >
                    상세보기 <span aria-hidden="true">›</span>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-white py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid gap-12 md:grid-cols-2">
              {entryCards.map((card) => (
                <article
                  key={card.title}
                  className="flex flex-col justify-between rounded-lg border border-border p-10"
                >
                  <div>
                    <h4 className="text-xl font-bold text-slate-950">{card.title}</h4>
                    <p className="mb-8 mt-2 text-sm text-text-secondary">{card.description}</p>
                    <ul className="mb-10 space-y-3">
                      {card.items.map((item) => (
                        <li key={item} className="flex items-center gap-3 text-sm text-text-primary">
                          <span className="text-brand-primary">●</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    href={card.href}
                    className={`inline-flex w-full items-center justify-center rounded px-4 py-4 text-sm font-bold transition-all ${
                      card.tone === 'secondary'
                        ? 'border border-slate-950 text-slate-950 hover:bg-slate-950 hover:text-white'
                        : 'border border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white'
                    }`}
                  >
                    {card.cta}
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-surface-muted py-20">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
            <h2 className="text-2xl font-bold text-slate-950">창원클린의 3대 안심 원칙</h2>
            <div className="mt-12 grid gap-12 md:grid-cols-3">
              {principles.map((item) => (
                <article key={item.title} className="flex flex-col items-center">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-white text-brand-primary">
                    ●
                  </div>
                  <h5 className="text-sm font-bold text-slate-950">{item.title}</h5>
                  <p className="mt-2 text-xs leading-relaxed text-text-secondary">{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border bg-white py-24">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-950">
              지금 바로 깨끗한 공간을 예약하세요
            </h2>
            <p className="mb-10 mt-6 text-text-secondary">
              첫 예약 시 5,000원 즉시 할인 혜택을 드립니다.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/customer/request"
                className="rounded bg-brand-primary px-10 py-4 text-sm font-bold text-white shadow-sm transition-all hover:bg-brand-primary-hover"
              >
                예약 시작하기
              </Link>
              <Link
                href="/login"
                className="rounded border border-border bg-white px-10 py-4 text-sm font-bold text-text-primary transition-all hover:bg-surface-muted"
              >
                카톡으로 1:1 상담
              </Link>
            </div>
          </div>
        </section>
      </main>

      <div className="fixed bottom-6 right-6 z-50 hidden flex-col gap-3 md:flex">
        <button className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-white text-text-primary shadow-card transition-colors hover:text-brand-primary">
          ☎
        </button>
        <Link
          href="/customer/request"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-primary text-xl text-white shadow-card transition-transform hover:scale-105"
        >
          +
        </Link>
      </div>

      <footer className="border-t border-border bg-white px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 grid gap-12 md:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-2">
              <span className="mb-6 block text-lg font-bold text-brand-primary">창원클린</span>
              <p className="text-[13px] leading-loose text-text-secondary">
                (주)창원클린네트웍스 | 대표자: 홍길동 | 사업자번호: 123-45-67890
                <br />
                주소: 경상남도 창원시 성산구 중앙대로 123, 405호
                <br />
                고객센터: 1588-0000 (평일 09:00 - 18:00)
                <br />
                이메일: support@cwclean.kr
              </p>
            </div>

            <div>
              <h6 className="mb-4 text-sm font-bold text-slate-950">서비스</h6>
              <ul className="space-y-2 text-[13px] text-text-secondary">
                {footerServices.map((item) => (
                  <li key={item}>
                    <Link href="/customer/request" className="hover:text-brand-primary">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h6 className="mb-4 text-sm font-bold text-slate-950">고객지원</h6>
              <ul className="space-y-2 text-[13px] text-text-secondary">
                {footerSupport.map((item) => (
                  <li key={item}>
                    <Link
                      href="/login"
                      className={item === '개인정보처리방침' ? 'font-bold text-brand-primary' : 'hover:text-brand-primary'}
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
            <p className="text-[11px] text-text-secondary">
              © 2024 Changwon Clean Networks. All rights reserved.
            </p>
            <div className="flex gap-4 text-text-secondary">
              <span>공유</span>
              <span>언어</span>
            </div>
          </div>
        </div>
      </footer>

      <nav className="fixed bottom-0 z-50 flex h-16 w-full items-center justify-around border-t border-border bg-white/95 px-2 backdrop-blur-md md:hidden">
        {mobileNav.map((item, index) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex w-1/4 flex-col items-center justify-center ${
              index === 0 ? 'text-brand-primary' : 'text-text-secondary'
            }`}
          >
            <span className="text-sm">{index === 0 ? '●' : '○'}</span>
            <span className={`mt-1 text-[10px] ${index === 0 ? 'font-bold' : 'font-medium'}`}>
              {item.label}
            </span>
          </Link>
        ))}
      </nav>
    </>
  );
}
