import Link from 'next/link';

export default function AdminLoginPage() {
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-[radial-gradient(circle_at_top_left,#1a4b84_0%,#001c3b_100%)]">
      <div className="absolute right-[-5%] top-[-10%] h-96 w-96 rounded-full bg-brand-primary/20 blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-5%] h-80 w-80 rounded-full bg-brand-secondary/10 blur-[100px]" />

      <section className="flex flex-1 items-center justify-center p-6">
        <div className="z-10 w-full max-w-md">
          <div className="mb-10 text-center">
            <div className="mb-4 inline-flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-xl">
                <span className="h-5 w-5 rounded-sm border-[3px] border-brand-primary" />
              </div>
              <div className="flex flex-col items-start">
                <div className="flex items-center gap-2">
                  <span className="font-headline text-2xl font-extrabold tracking-tight text-white">창원클린</span>
                  <span className="rounded border border-white/20 bg-brand-primary/50 px-2 py-0.5 text-[10px] font-bold tracking-[0.18em] text-white">
                    ADMIN
                  </span>
                </div>
              </div>
            </div>
            <h1 className="font-headline text-xl font-bold tracking-tight text-blue-100">창원클린 통합 관리 콘솔</h1>
            <p className="mt-1 text-sm text-blue-200/70">Admin Console v2.4.0</p>
          </div>

          <div className="overflow-hidden rounded-[1.4rem] border border-white/10 bg-brand-primary/20 shadow-[0_32px_64px_rgba(0,0,0,0.4)] backdrop-blur-3xl">
            <div className="space-y-6 p-8">
              <div className="space-y-4">
                <label className="block">
                  <span className="mb-1.5 ml-1 block text-xs font-semibold text-blue-100/60">ADMIN ID</span>
                  <input
                    type="text"
                    placeholder="관리자 아이디를 입력하세요"
                    className="h-14 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-white placeholder:text-white/25 focus:border-blue-200/40 focus:bg-white/10"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 ml-1 block text-xs font-semibold text-blue-100/60">PASSWORD</span>
                  <input
                    type="password"
                    placeholder="비밀번호"
                    className="h-14 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-white placeholder:text-white/25 focus:border-blue-200/40 focus:bg-white/10"
                  />
                </label>
              </div>

              <div className="pt-2">
                <div className="mb-2 flex items-center justify-between px-1">
                  <label className="text-xs font-semibold text-brand-secondary-soft">2-STEP VERIFICATION</label>
                  <span className="text-[10px] text-white/40">OTP Required</span>
                </div>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="OTP 6자리 숫자 입력"
                  className="h-14 w-full rounded-xl border border-brand-secondary/20 bg-brand-secondary/5 px-4 text-center font-mono tracking-[0.35em] text-brand-secondary-soft placeholder:tracking-normal placeholder:text-white/25 focus:border-brand-secondary/40 focus:bg-brand-secondary/10"
                />
              </div>

              <Link
                href="/admin"
                className="inline-flex h-14 w-full items-center justify-center rounded-xl bg-gradient-to-r from-[#d5e3ff] to-[#a6c8ff] text-sm font-bold text-[#001c3b] transition-transform hover:scale-[1.01]"
              >
                콘솔 로그인
              </Link>

              <div className="flex items-center justify-between px-1 text-[11px] text-white/40">
                <span>접속 권한 요청</span>
                <span>인증 수단 초기화</span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-black/20 px-8 py-3">
              <span className="h-3 w-3 rounded-full bg-brand-secondary/70" />
              <span className="text-[11px] text-white/40">보안 정책에 따라 모든 접속 로그가 기록됩니다.</span>
            </div>
          </div>

          <div className="mt-8 text-center text-xs text-white/30">
            <p>© 2024 창원클린. All rights reserved.</p>
            <Link href="/login" className="mt-2 inline-block font-semibold text-blue-100/70">
              사용자 로그인 보기
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
