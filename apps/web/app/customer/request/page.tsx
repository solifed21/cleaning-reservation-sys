import { SurfaceCard, UserTopNav } from '../../prototype-ui';

const steps = [
  { label: '서비스', description: '기본 청소, 욕실, 주방, 입주 청소 등을 선택합니다.' },
  { label: '일정', description: '원하는 날짜와 시작 시간을 선택합니다.' },
  { label: '주소', description: '지역과 상세주소를 정확히 입력합니다.' },
  { label: '요청사항', description: '반려동물, 주차, 현관 비밀번호 등 참고 사항을 남깁니다.' },
  { label: '확인', description: '예상 금액과 요약 정보를 보고 최종 제출합니다.' },
];

export default function CustomerRequestPage() {
  return (
    <main className="min-h-screen">
      <UserTopNav current="/customer/request" />

      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <SurfaceCard className="p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-primary">Booking Request</p>
            <h1 className="mt-3 text-3xl font-semibold text-text-primary">예약 생성 Wizard</h1>
            <p className="mt-4 text-sm leading-6 text-text-secondary">
              모바일에서 정의한 5단계 입력 구조를 웹에서도 같은 순서로 유지합니다. 실제 구현 시에는 각
              단계를 분리한 스텝 라우트나 단일 폼 스텝퍼로 연결할 수 있습니다.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-text-primary">서비스 유형</span>
                <div className="rounded-2xl border border-border bg-surface-subtle px-4 py-3 text-sm text-text-secondary">
                  기본 청소, 욕실, 주방, 입주 청소
                </div>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-text-primary">평수</span>
                <div className="rounded-2xl border border-border bg-surface-subtle px-4 py-3 text-sm text-text-secondary">
                  예: 8평 원룸
                </div>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-text-primary">예약 날짜</span>
                <div className="rounded-2xl border border-border bg-surface-subtle px-4 py-3 text-sm text-text-secondary">
                  2026.03.28 (토)
                </div>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-text-primary">시작 시간</span>
                <div className="rounded-2xl border border-border bg-surface-subtle px-4 py-3 text-sm text-text-secondary">
                  10:00
                </div>
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-2 block text-sm font-medium text-text-primary">주소</span>
                <div className="rounded-2xl border border-border bg-surface-subtle px-4 py-3 text-sm text-text-secondary">
                  창원시 성산구 중앙동 00-0
                </div>
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-2 block text-sm font-medium text-text-primary">상세 주소</span>
                <div className="rounded-2xl border border-border bg-surface-subtle px-4 py-3 text-sm text-text-secondary">
                  101동 1203호, 공동현관 #1234
                </div>
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-2 block text-sm font-medium text-text-primary">요청사항</span>
                <div className="rounded-2xl border border-border bg-surface-subtle px-4 py-3 text-sm leading-6 text-text-secondary">
                  반려묘 1마리 있어요. 오전 방문 선호, 창틀 먼지도 함께 부탁드려요.
                </div>
              </label>
            </div>
          </SurfaceCard>

          <div className="space-y-6">
            <SurfaceCard className="p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-primary">Steps</p>
              <div className="mt-5 space-y-3">
                {steps.map((step, index) => (
                  <article key={step.label} className="flex gap-4 rounded-3xl border border-border bg-surface-subtle p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-sm font-semibold text-brand-primary">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-primary">{step.label}</p>
                      <p className="mt-1 text-sm leading-6 text-text-secondary">{step.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </SurfaceCard>

            <SurfaceCard className="p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-primary">Summary</p>
              <h2 className="mt-3 text-2xl font-semibold text-text-primary">예상 금액 요약</h2>
              <div className="mt-5 space-y-3 text-sm text-text-secondary">
                <div className="flex items-center justify-between">
                  <span>기본 청소</span>
                  <span className="font-semibold tabular-nums text-text-primary">42,000원</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>욕실 추가</span>
                  <span className="font-semibold tabular-nums text-text-primary">10,000원</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>이사 전 정리</span>
                  <span className="font-semibold tabular-nums text-text-primary">26,000원</span>
                </div>
                <div className="border-t border-border pt-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-text-primary">예상 금액</span>
                    <span className="text-lg font-semibold tabular-nums text-text-primary">78,000원</span>
                  </div>
                </div>
              </div>
              <button className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-xl bg-brand-primary px-4 text-sm font-semibold text-text-onbrand">
                예약 요청하기
              </button>
            </SurfaceCard>
          </div>
        </section>
      </div>
    </main>
  );
}
