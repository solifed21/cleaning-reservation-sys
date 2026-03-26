import Link from 'next/link';
import { StatusBadge, SurfaceCard, UserTopNav } from '../../prototype-ui';

const filters = ['전체', '요청됨', '확정', '진행중', '완료', '취소됨'];

const bookings = [
  {
    id: '#C-1038',
    title: '이사 전 전체 청소',
    schedule: '2026.03.28 (토) 10:00',
    address: '창원시 성산구 중앙동',
    amount: '78,000원',
    status: '확정',
    tone: 'success' as const,
  },
  {
    id: '#C-1037',
    title: '주방 + 욕실 집중 청소',
    schedule: '2026.03.29 (일) 15:30',
    address: '창원시 의창구 팔용동',
    amount: '52,000원',
    status: '요청됨',
    tone: 'info' as const,
  },
  {
    id: '#C-1036',
    title: '원룸 기본 청소',
    schedule: '2026.03.31 (화) 19:00',
    address: '창원시 진해구 이동',
    amount: '64,000원',
    status: '완료',
    tone: 'neutral' as const,
  },
];

const timeline = [
  '요청됨: 제공자 수락 대기',
  '확정: 일정과 주소 다시 확인',
  '진행중: 채팅으로 현장 조율',
  '완료: 리뷰 작성 가능',
];

export default function CustomerBookingsPage() {
  return (
    <main className="min-h-screen">
      <UserTopNav current="/customer/bookings" />

      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <SurfaceCard className="p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-primary">Bookings</p>
            <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-3xl font-semibold text-text-primary">내 예약 목록</h1>
                <p className="mt-3 text-sm leading-6 text-text-secondary">
                  모바일 문서의 상태별 목록 구조를 웹 카드 리스트로 바꿔, 일정과 주소, 금액을 빠르게
                  비교할 수 있게 했습니다.
                </p>
              </div>
              <Link
                href="/customer/request"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-brand-primary px-4 text-sm font-semibold text-text-onbrand"
              >
                새 예약 만들기
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {filters.map((filter, index) => (
                <button
                  key={filter}
                  className={`inline-flex h-10 items-center justify-center rounded-full px-4 text-sm font-medium ${
                    index === 0
                      ? 'bg-brand-primary text-text-onbrand'
                      : 'border border-border bg-white text-text-secondary'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <div className="mt-6 space-y-4">
              {bookings.map((booking) => (
                <article key={booking.id} className="rounded-3xl border border-border bg-surface-subtle p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-text-tertiary">
                        {booking.id}
                      </p>
                      <h2 className="mt-2 text-xl font-semibold text-text-primary">{booking.title}</h2>
                      <p className="mt-3 text-sm text-text-secondary">{booking.schedule}</p>
                      <p className="mt-1 text-sm text-text-secondary">{booking.address}</p>
                    </div>
                    <StatusBadge label={booking.status} tone={booking.tone} />
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-lg font-semibold tabular-nums text-text-primary">{booking.amount}</p>
                    <div className="flex flex-wrap gap-3">
                      <button className="inline-flex h-10 items-center justify-center rounded-xl border border-border px-4 text-sm font-semibold text-text-primary">
                        채팅 보기
                      </button>
                      <button className="inline-flex h-10 items-center justify-center rounded-xl border border-border px-4 text-sm font-semibold text-text-primary">
                        상세 보기
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </SurfaceCard>

          <SurfaceCard className="p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-primary">Status Guide</p>
            <h2 className="mt-3 text-2xl font-semibold text-text-primary">예약 상태에 따른 행동</h2>
            <div className="mt-6 space-y-3">
              {timeline.map((item, index) => (
                <article key={item} className="flex gap-4 rounded-3xl border border-border bg-surface-subtle p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-sm font-semibold text-brand-primary">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-6 text-text-secondary">{item}</p>
                </article>
              ))}
            </div>
          </SurfaceCard>
        </section>
      </div>
    </main>
  );
}
