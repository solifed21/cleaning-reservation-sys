import { UserPage } from '@/components/prototype/user-shell';
import { InfoRow } from '@/components/prototype/ui';

const steps = ['서비스', '일정', '주소', '요청사항', '확인'];
const days = [
  { day: '28', state: 'disabled' },
  { day: '29', state: 'disabled' },
  { day: '30', state: 'disabled' },
  { day: '1', state: 'available' },
  { day: '2', state: 'selected' },
  { day: '3', state: 'available' },
  { day: '4', state: 'available' },
  { day: '5', state: 'available' },
  { day: '6', state: 'available' },
  { day: '7', state: 'available' },
  { day: '8', state: 'available' },
  { day: '9', state: 'available' },
  { day: '10', state: 'available' },
  { day: '11', state: 'available' },
];

const timeSlots = [
  { label: '오전 세션', time: '09:00', selected: true },
  { label: '오전 세션', time: '10:30', helper: '인기' },
  { label: '오후 세션', time: '14:00' },
  { label: '오후 세션', time: '16:30' },
];

const assuranceItems = [
  '추가금 없는 정찰제 보장',
  '24시간 전까지 무료 취소 가능',
  '도움이 필요하면 운영팀이 바로 개입',
];

export default function CustomerRequestPage() {
  return (
    <UserPage current="/customer/request">
      <div className="mb-6">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-2">
          {steps.map((step, index) => {
            const state =
              index === 0 ? 'done' : index === 1 ? 'active' : 'idle';

            return (
              <div key={step} className="flex flex-1 items-center gap-2">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                      state === 'done'
                        ? 'bg-brand-secondary text-white'
                        : state === 'active'
                          ? 'bg-brand-primary text-white'
                          : 'bg-surface-muted text-text-tertiary'
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span
                    className={`text-[11px] font-semibold uppercase tracking-[0.22em] ${
                      state === 'idle' ? 'text-text-tertiary' : 'text-brand-primary'
                    }`}
                  >
                    {step}
                  </span>
                </div>
                {index < steps.length - 1 ? (
                  <div className={`h-[2px] flex-1 ${index === 0 ? 'bg-brand-primary' : 'bg-border'}`} />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      <section className="grid gap-8 lg:grid-cols-12 lg:items-start">
        <div className="space-y-8 lg:col-span-8">
          <section className="rounded-[1.2rem] border border-border bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight text-text-primary">방문 날짜 선택</h2>
              <p className="text-sm font-medium text-text-secondary">2026년 5월</p>
            </div>
            <div className="mb-4 grid grid-cols-7 gap-2 text-center text-[11px] font-bold uppercase tracking-[0.14em] text-text-tertiary">
              {['일', '월', '화', '수', '목', '금', '토'].map((label) => (
                <div key={label}>{label}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {days.map((item) => (
                <button
                  key={item.day}
                  type="button"
                  className={`flex h-20 flex-col items-center justify-center rounded-[0.9rem] border text-sm font-bold tabular-nums ${
                    item.state === 'selected'
                      ? 'border-2 border-brand-primary bg-brand-soft text-brand-primary'
                      : item.state === 'available'
                        ? 'border-border bg-surface-muted text-text-primary transition-colors hover:bg-white'
                        : 'border-transparent text-text-tertiary/40'
                  }`}
                >
                  <span>{item.day}</span>
                  {item.state === 'selected' ? (
                    <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em]">선택됨</span>
                  ) : item.state === 'available' ? (
                    <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-brand-secondary">
                      가능
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-[1.2rem] border border-border bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight text-text-primary">도착 시간 선택</h2>
              <span className="rounded-full bg-brand-secondary-soft px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-brand-secondary">
                추천
              </span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {timeSlots.map((slot) => (
                <button
                  key={slot.time}
                  type="button"
                  className={`flex items-center justify-between rounded-[0.9rem] border p-4 text-left ${
                    slot.selected
                      ? 'border-2 border-brand-primary bg-brand-soft'
                      : 'border-border bg-surface-muted hover:bg-white'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-bold uppercase tracking-[0.18em] text-text-tertiary">
                      {slot.label}
                    </span>
                    <span className="mt-1 text-xl font-bold tabular-nums text-text-primary">{slot.time}</span>
                  </div>
                  {slot.selected ? (
                    <span className="text-sm font-bold text-brand-primary">선택</span>
                  ) : slot.helper ? (
                    <span className="rounded bg-brand-secondary px-2 py-0.5 text-[10px] font-bold text-white">
                      {slot.helper}
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
          </section>

          <div className="flex flex-wrap items-center justify-center gap-6 rounded-[1.2rem] border border-dashed border-border bg-white px-6 py-5">
            {assuranceItems.map((item) => (
              <div key={item} className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-brand-secondary" />
                <span className="text-sm font-medium text-text-primary">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <aside className="lg:col-span-4 lg:sticky lg:top-24">
          <div className="overflow-hidden rounded-[1.2rem] border border-border bg-white">
            <div className="h-1.5 w-full bg-brand-primary" />
            <div className="p-6">
              <h3 className="text-lg font-bold tracking-tight text-text-primary">예약 요약</h3>
              <div className="mb-8 mt-6 space-y-4">
                <InfoRow label="서비스" value="원룸 기본 청소" />
                <InfoRow label="패키지" value="딥클린 패키지" />
                <InfoRow label="날짜" value="2026.05.02 (목)" />
                <InfoRow label="도착 시간" value="09:00" />
              </div>

              <div className="mb-8 space-y-2 border-t border-border pt-4">
                <InfoRow label="기본 요금" value="85,000원" />
                <InfoRow label="옵션 추가" value="+15,000원" />
                <InfoRow label="신규 할인" value="-5,000원" />
              </div>

              <div className="mb-8 rounded-[0.9rem] bg-surface-muted p-4">
                <div className="flex items-end justify-between gap-4">
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-text-secondary">
                    총 결제 금액
                  </span>
                  <span className="text-2xl font-black tracking-tight text-brand-primary tabular-nums">
                    95,000원
                  </span>
                </div>
                <p className="mt-2 text-[11px] leading-relaxed text-text-tertiary">
                  VAT와 기본 청소 용품 비용이 모두 포함되어 있습니다.
                </p>
              </div>

              <button
                type="button"
                className="inline-flex h-14 w-full items-center justify-center rounded-[0.9rem] bg-brand-primary text-sm font-bold text-white transition-colors hover:bg-brand-primary-hover"
              >
                다음 단계로 이동
              </button>

              <div className="mt-6 space-y-3">
                <p className="text-xs leading-5 text-text-secondary">
                  친환경 세제와 전문 장비 사용이 검증된 파트너만 배정됩니다.
                </p>
                <p className="text-xs leading-5 text-text-secondary">
                  서비스 기준에 미달하면 재청소 정책으로 대응합니다.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </section>
    </UserPage>
  );
}
