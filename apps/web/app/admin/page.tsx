import Link from 'next/link';
import { AdminShell } from '@/components/prototype/admin-shell';
import { Tone } from '@/components/prototype/ui';

const metrics = [
  {
    label: '총 사용자 수',
    value: '12,480',
    detail: '요청자 8,460명 · 제공자 4,020명',
    tone: 'info' as const,
  },
  {
    label: '오늘의 예약',
    value: '184',
    detail: '대기 38 · 확정 92 · 진행중 21 · 완료 33',
    tone: 'success' as const,
  },
  {
    label: '이번 달 거래액',
    value: '₩28.4M',
    detail: '확정 24.9M · 예상 3.5M',
    tone: 'neutral' as const,
  },
  {
    label: '미처리 문의',
    value: '27',
    detail: '긴급 대응 4건 포함',
    tone: 'warning' as const,
  },
];

const signupTrend = [12, 17, 19, 15, 21, 24, 23, 28, 31, 27, 34, 38, 36, 42];

const statusDistribution: Array<{ label: string; value: number; tone: Tone }> = [
  { label: '요청됨', value: 38, tone: 'info' },
  { label: '확정', value: 92, tone: 'success' },
  { label: '진행중', value: 21, tone: 'warning' },
  { label: '완료', value: 33, tone: 'neutral' },
  { label: '취소됨', value: 11, tone: 'danger' },
];

const recentBookings: Array<{
  id: string;
  customer: string;
  cleaner: string;
  schedule: string;
  area: string;
  amount: string;
  status: string;
  tone: Tone;
}> = [
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
];

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
];

const operationBoard = [
  { title: '신규 제공자 승인', value: '6건', detail: '평균 대기 42분' },
  { title: '강제 취소 검토', value: '3건', detail: '환불 검토 필요' },
  { title: '신고 리뷰 검토', value: '8건', detail: '블라인드 후보 2건' },
];

const heatmap = [
  { label: '성산구', value: 84 },
  { label: '의창구', value: 67 },
  { label: '마산회원구', value: 58 },
  { label: '마산합포구', value: 46 },
  { label: '진해구', value: 39 },
];

export default function AdminDashboardPage() {
  return (
    <AdminShell current="/admin">
      <header className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">운영 대시보드</h2>
          <p className="mt-1 text-[13px] text-text-secondary">실시간 서비스 현황 및 주요 지표 분석</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex rounded border border-border bg-white p-0.5">
            <button type="button" className="rounded bg-surface-muted px-3 py-1 text-[11px] font-bold text-brand-primary shadow-sm">
              실시간
            </button>
            <button type="button" className="px-3 py-1 text-[11px] font-medium text-text-secondary">
              시간별
            </button>
            <button type="button" className="ml-1 border-l border-border pl-4 pr-3 py-1 text-[11px] font-medium text-text-secondary">
              일별
            </button>
          </div>
          <button type="button" className="relative flex h-9 w-9 items-center justify-center rounded border border-border bg-white">
            <span className="h-4 w-4 rounded-full border-2 border-text-tertiary" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-status-danger" />
          </button>
        </div>
      </header>

      <section className="mb-8 grid gap-4 xl:grid-cols-4">
        {metrics.map((metric, index) => (
          <article
            key={metric.label}
            className={`rounded border bg-white p-5 ${
              index === 1 ? 'border-l-4 border-l-status-danger border-border' : 'border-border'
            }`}
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <span className={`text-[12px] ${index === 1 ? 'font-bold text-status-danger' : 'font-medium text-text-secondary'}`}>
                {metric.label}
              </span>
              <span className={`text-[11px] font-bold ${index === 1 ? 'text-status-danger' : 'text-status-success'}`}>
                {index === 1 ? 'Action Needed' : '정상'}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <h3 className={`text-2xl font-bold tabular-nums ${index === 1 ? 'text-status-danger' : 'text-text-primary'}`}>
                {metric.value}
              </h3>
              <span className={`text-[12px] ${index === 1 ? 'text-status-danger/70' : 'text-text-secondary'}`}>
                {metric.detail}
              </span>
            </div>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-12">
        <section className="xl:col-span-8">
          <div className="overflow-hidden rounded border border-border bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-border bg-white px-6 py-4">
              <h4 className="text-[14px] font-bold text-text-primary">최근 예약 내역</h4>
              <Link href="/admin/login" className="text-[11px] font-bold text-brand-primary">
                전체 내역 보기 →
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-border bg-surface-muted">
                    <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-text-secondary">Booking ID</th>
                    <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-text-secondary">예약 일시</th>
                    <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-text-secondary">고객명</th>
                    <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-text-secondary">담당 파트너</th>
                    <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-text-secondary">진행 상태</th>
                    <th className="px-6 py-3 text-right text-[11px] font-bold uppercase tracking-[0.18em] text-text-secondary">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentBookings.map((booking) => (
                    <tr key={booking.id} className="transition-colors hover:bg-surface-muted/60">
                      <td className="px-6 py-4 text-[12px] font-bold text-text-primary tabular-nums">{booking.id}</td>
                      <td className="px-4 py-4 text-[12px] text-text-secondary tabular-nums">{booking.schedule}</td>
                      <td className="px-4 py-4 text-[12px] font-medium text-text-primary">{booking.customer}</td>
                      <td className="px-4 py-4 text-[12px] text-text-primary">{booking.cleaner}</td>
                      <td className="px-4 py-4">
                        <span
                          className={`rounded-sm px-2 py-1 text-[10px] font-bold ${
                            booking.tone === 'success'
                              ? 'bg-status-success-soft text-status-success'
                              : booking.tone === 'info'
                                ? 'bg-status-info-soft text-brand-primary'
                                : booking.tone === 'warning'
                                  ? 'bg-status-warning-soft text-status-warning'
                                  : booking.tone === 'danger'
                                    ? 'bg-status-danger-soft text-status-danger'
                                    : 'bg-surface-muted text-text-secondary'
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button type="button" className="inline-flex h-7 w-7 items-center justify-center rounded border border-border">
                          ○
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="space-y-6 xl:col-span-4">
          <div className="overflow-hidden rounded border border-border bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-border bg-white px-5 py-4">
              <h4 className="flex items-center gap-1.5 text-[13px] font-bold text-status-danger">
                <span className="h-3 w-3 rounded-full bg-status-danger" />
                긴급 처리 대기
              </h4>
              <span className="rounded-sm bg-status-danger-soft px-1.5 py-0.5 text-[10px] font-bold text-status-danger tabular-nums">
                2
              </span>
            </div>
            <div className="space-y-3 p-4">
              <article className="border border-border bg-surface-muted p-3">
                <div className="mb-1.5 flex items-start justify-between">
                  <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-status-danger">Cancel Request</span>
                  <span className="text-[9px] text-text-secondary tabular-nums">12분 전</span>
                </div>
                <h5 className="mb-1 text-[12px] font-bold text-text-primary">#CW-239982 취소 요청</h5>
                <p className="mb-3 text-[11px] leading-relaxed text-text-secondary">
                  고객 측에서 클리너 노쇼를 주장하며 환불 요청 중입니다.
                </p>
                <div className="flex gap-1.5">
                  <button type="button" className="flex-1 rounded bg-status-danger py-1.5 text-[10px] font-bold text-white">
                    상담 연결
                  </button>
                  <button type="button" className="flex-1 rounded border border-border bg-white py-1.5 text-[10px] font-bold text-text-primary">
                    상세 보기
                  </button>
                </div>
              </article>

              <article className="border border-border bg-surface-muted p-3">
                <div className="mb-1.5 flex items-start justify-between">
                  <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-status-warning">Dispute 접수</span>
                  <span className="text-[9px] text-text-secondary tabular-nums">45분 전</span>
                </div>
                <h5 className="mb-1 text-[12px] font-bold text-text-primary">파손 신고: 이지은 고객</h5>
                <p className="mb-3 text-[11px] leading-relaxed text-text-secondary">
                  서비스 중 화분 파손 클레임이 접수되어 현장 사진 확인이 필요합니다.
                </p>
                <div className="flex gap-1.5">
                  <button type="button" className="flex-1 rounded bg-text-primary py-1.5 text-[10px] font-bold text-white">
                    배상 검토
                  </button>
                  <button type="button" className="flex-1 rounded border border-border bg-white py-1.5 text-[10px] font-bold text-text-secondary">
                    보류
                  </button>
                </div>
              </article>
            </div>
          </div>

          <div className="relative h-48 cursor-pointer overflow-hidden rounded border border-border bg-white shadow-sm">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(20,184,106,0.15),transparent_20%),radial-gradient(circle_at_70%_35%,rgba(21,101,216,0.18),transparent_22%),radial-gradient(circle_at_45%_70%,rgba(21,101,216,0.1),transparent_24%),linear-gradient(180deg,#dce8f5_0%,#c7d6e6_100%)]" />
            <div className="absolute inset-0 bg-gradient-to-t from-text-primary/80 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="mb-1 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-status-success" />
                <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/80">Active Zone</span>
              </div>
              <h4 className="text-[14px] font-bold">실시간 클리너 위치</h4>
              <p className="text-[11px] text-white/70">
                현재 <span className="font-bold tabular-nums text-white">14</span>명 파트너 서비스 가동 중
              </p>
            </div>
          </div>

          <div className="rounded border border-border bg-white p-6 shadow-sm">
            <h4 className="mb-4 text-[14px] font-bold text-text-primary">최근 14일 신규 가입</h4>
            <div className="flex h-40 items-end gap-2">
              {signupTrend.map((value, index) => {
                const height = `${(value / 42) * 100}%`;
                const isPeak = index >= signupTrend.length - 3;

                return (
                  <div key={`${value}-${index}`} className="flex flex-1 flex-col items-center gap-2">
                    <div className="text-[10px] font-medium tabular-nums text-text-tertiary">{value}</div>
                    <div className="flex h-full w-full items-end rounded-full bg-surface-muted px-1 pb-1">
                      <div
                        className={`w-full rounded-full ${isPeak ? 'bg-brand-primary' : 'bg-slate-300'}`}
                        style={{ height }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 space-y-3">
              {statusDistribution.map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-text-primary">{item.label}</span>
                    <span className="tabular-nums text-text-secondary">{item.value}건</span>
                  </div>
                  <div className="h-3 rounded-full bg-surface-muted">
                    <div
                      className={`h-full rounded-full ${
                        item.tone === 'success'
                          ? 'bg-status-success'
                          : item.tone === 'info'
                            ? 'bg-brand-primary'
                            : item.tone === 'warning'
                              ? 'bg-status-warning'
                              : item.tone === 'danger'
                                ? 'bg-status-danger'
                                : 'bg-slate-400'
                      }`}
                      style={{ width: `${(item.value / 92) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded border border-border bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-[14px] font-bold text-text-primary">최근 활동</h4>
              <Link href="/admin/login" className="text-sm font-semibold text-brand-primary">
                권한 관리
              </Link>
            </div>
            <div className="space-y-4">
              {activities.map((activity) => (
                <article key={activity.title} className="rounded border border-border bg-surface-muted p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-text-primary">{activity.title}</p>
                    <span className="text-xs font-medium text-text-tertiary">{activity.time}</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-text-secondary">{activity.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </section>
    </AdminShell>
  );
}
