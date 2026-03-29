import Link from 'next/link';
import { UserPage } from '@/components/prototype/user-shell';
import { HighlightPill, StatusBadge } from '@/components/prototype/ui';

const quickActions = [
  { title: '빠른 예약하기', detail: '3분 만에 간편하게', href: '/customer/request', tone: 'bg-blue-50 text-brand-primary' },
  { title: '자주 쓰는 주소', detail: '집, 사무실 등 관리', href: '/customer/bookings', tone: 'bg-slate-50 text-text-secondary' },
  { title: '내 리뷰 보기', detail: '작성한 후기 12건', href: '/customer/bookings', tone: 'bg-slate-50 text-text-secondary' },
];

const assurances = [
  {
    title: '안심 보험 100% 가입 완료',
    body: '작업 중 파손 걱정 없이 창원클린이 책임집니다.',
  },
  {
    title: '검증된 파트너 500명 돌파',
    body: '신원 확인과 전문 교육을 통과한 전문가만 활동합니다.',
  },
];

const recommendations = [
  { title: '정기 가사 청소', body: '매주 깔끔하게 유지되는 공간', price: '34,000원~', accent: 'from-[#dcecff] to-[#edf6ff]' },
  { title: '이사/입주 청소', body: '새로운 시작을 위한 완벽한 첫인상', price: '12,000원/평~', accent: 'from-[#d7f5ee] to-[#effcf8]' },
  { title: '에어컨 정밀 분해', body: '곰팡이와 냄새를 한 번에 정리', price: '49,000원~', accent: 'from-[#eef2ff] to-[#f7f9ff]' },
  { title: '침대/매트리스 케어', body: '보이지 않는 먼지와 진드기 제거', price: '29,000원~', accent: 'from-[#f7f1e8] to-[#fdfaf5]' },
];

export default function CustomerHomePage() {
  return (
    <UserPage current="/customer">
      <section className="relative overflow-hidden rounded-[2rem] bg-brand-primary px-8 py-10 text-white shadow-xl shadow-brand-primary/10 md:px-12 md:py-12">
        <div className="relative z-10 max-w-2xl">
          <h1 className="font-headline text-3xl font-extrabold leading-tight tracking-tight md:text-5xl">
            안녕하세요, 김창원님.
            <br />
            기분 좋은 청소를 준비해 드릴게요.
          </h1>
          <p className="mt-4 text-lg font-medium text-white/80">
            Clean Assurance 전문 클리너들이 당신의 공간을 정돈합니다.
          </p>
        </div>
        <div className="pointer-events-none absolute -bottom-20 right-[-4rem] h-72 w-72 rounded-full border border-white/10 bg-white/5" />
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <div className="rounded-[1.8rem] border border-border/30 bg-white p-8 shadow-[0_4px_20px_rgba(21,101,216,0.04)] md:col-span-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-headline text-2xl font-bold tracking-tight text-text-primary">내 다음 예약</h2>
            </div>
            <Link href="/customer/bookings" className="text-sm font-bold text-brand-primary hover:underline">
              전체보기
            </Link>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-4">
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-text-tertiary">상태</p>
              <StatusBadge label="진행 중" tone="success" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-text-tertiary">일시</p>
              <p className="text-base font-bold text-text-primary">3월 30일(월) 10:00</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-text-tertiary">장소</p>
              <p className="truncate text-base font-bold text-text-primary">창원시 성산구 중앙동 101동</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-text-tertiary">결제금액</p>
              <p className="text-base font-bold text-brand-primary">34,000원</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 border-t border-border/30 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-muted text-sm font-bold text-brand-primary">
                4.9
              </div>
              <div>
                <p className="text-sm font-bold text-text-primary">이정희 파트너</p>
                <p className="text-[11px] font-bold text-brand-secondary">평점 4.9 · 후기 124개</p>
              </div>
            </div>
            <Link
              href="/customer/bookings"
              className="inline-flex h-12 items-center justify-center rounded-xl bg-brand-primary px-6 text-sm font-bold text-white transition-colors hover:bg-brand-primary-hover"
            >
              진행현황 확인
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-4 md:col-span-4">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className="group flex items-center justify-between rounded-[1.4rem] border border-border/30 bg-white p-5 shadow-sm transition-all hover:shadow-card"
            >
              <div className="flex items-center gap-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${action.tone}`}>
                  <span className="h-3 w-3 rounded-full bg-current" />
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary">{action.title}</p>
                  <p className="text-[11px] text-text-secondary">{action.detail}</p>
                </div>
              </div>
              <span className="text-text-tertiary transition-colors group-hover:text-brand-primary">→</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        {assurances.map((item) => (
          <article
            key={item.title}
            className="flex items-center gap-5 rounded-[1.5rem] border border-brand-primary/20 bg-white p-6"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand-primary">
              <span className="h-4 w-4 rounded-full bg-brand-primary/80" />
            </div>
            <div>
              <p className="text-base font-bold text-text-primary">{item.title}</p>
              <p className="mt-1 text-sm text-text-secondary">{item.body}</p>
            </div>
          </article>
        ))}
      </section>

      <section>
        <div className="mb-6">
          <h2 className="font-headline text-2xl font-bold tracking-tight text-text-primary">인기 서비스 추천</h2>
          <p className="mt-1 text-sm text-text-secondary">김창원님을 위한 맞춤 공간 케어 솔루션</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {recommendations.map((item) => (
            <article
              key={item.title}
              className="overflow-hidden rounded-[1.5rem] border border-border/30 bg-white transition-all duration-300 hover:border-brand-primary/30"
            >
              <div className={`h-44 bg-gradient-to-br ${item.accent} p-5`}>
                <HighlightPill tone="info" className="border-white/50 bg-white/70 text-brand-primary">
                  추천 서비스
                </HighlightPill>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-text-primary">{item.title}</h3>
                <p className="mt-1 text-xs text-text-secondary">{item.body}</p>
                <p className="mt-4 font-bold text-brand-primary">{item.price}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </UserPage>
  );
}
