import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col bg-[#f8fbff]">
      <section className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-[440px]">
          <div className="mb-8 text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-brand-primary">창원클린</h1>
            <p className="mt-3 text-lg font-medium text-text-secondary">다시 태어나는 당신의 공간</p>
          </div>

          <div className="rounded-[1.4rem] border border-border/40 bg-white p-8 shadow-[0_10px_25px_-5px_rgba(21,101,216,0.1)]">
            <div className="mb-10 flex rounded-[1rem] bg-surface-muted p-1.5">
              <button
                type="button"
                className="flex-1 rounded-[0.8rem] bg-white py-3 text-base font-bold text-brand-primary shadow-sm ring-1 ring-black/5"
              >
                고객님
              </button>
              <button
                type="button"
                className="flex-1 rounded-[0.8rem] py-3 text-base font-semibold text-text-secondary transition-colors hover:text-text-primary"
              >
                클리너님
              </button>
            </div>

            <form className="space-y-5">
              <label className="block space-y-2">
                <span className="block text-sm font-bold text-text-primary">이메일 주소</span>
                <input
                  type="email"
                  placeholder="example@clean.com"
                  className="h-14 w-full rounded-[0.9rem] border border-border bg-white px-4 text-sm text-text-primary placeholder:text-text-tertiary focus:border-brand-primary"
                />
              </label>

              <label className="block space-y-2">
                <span className="flex items-center justify-between text-sm font-bold text-text-primary">
                  비밀번호
                  <span className="text-xs font-semibold text-brand-primary/80">비밀번호 찾기</span>
                </span>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="h-14 w-full rounded-[0.9rem] border border-border bg-white px-4 text-sm text-text-primary placeholder:text-text-tertiary focus:border-brand-primary"
                />
              </label>

              <Link
                href="/customer"
                className="inline-flex h-14 w-full items-center justify-center rounded-[0.9rem] bg-brand-primary text-sm font-bold text-white shadow-lg shadow-brand-primary/20 transition-colors hover:bg-brand-primary-hover"
              >
                로그인
              </Link>
              <p className="text-center text-[11px] leading-relaxed text-text-tertiary">
                개인정보 보호를 위해 안전하게 관리되며,
                <br />
                서비스 이용을 위해 약관에 동의하게 됩니다.
              </p>
            </form>

            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-xs font-medium text-text-tertiary">간편 로그인</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                className="flex h-12 w-full items-center justify-center rounded-[0.9rem] bg-[#FEE500] text-sm font-bold text-slate-900 transition-all hover:brightness-95"
              >
                카카오로 시작하기
              </button>
              <button
                type="button"
                className="flex h-12 w-full items-center justify-center rounded-[0.9rem] bg-[#03C75A] text-sm font-bold text-white transition-all hover:brightness-95"
              >
                네이버로 시작하기
              </button>
            </div>

            <div className="mt-10 border-t border-border/20 pt-8 text-center text-sm text-text-secondary">
              아직 회원이 아니신가요?
              <span className="ml-1.5 font-bold text-brand-primary">회원가입</span>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center gap-3">
            <div className="flex items-center gap-2.5 rounded-full border border-brand-secondary/10 bg-brand-secondary/5 px-4 py-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-secondary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-secondary" />
              </span>
              <p className="text-[13px] font-bold text-brand-secondary">지금 창원 지역 24명의 전문가가 활동 중</p>
            </div>
            <p className="text-xs text-text-tertiary">30초 만에 가입하고 바로 견적을 받아보세요</p>
            <Link href="/admin/login" className="text-xs font-semibold text-brand-primary">
              관리자 로그인 보기
            </Link>
          </div>
        </div>
      </section>

      <footer className="px-6 py-10 text-center">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 text-xs text-text-tertiary">
          <div className="flex gap-6">
            <span>이용약관</span>
            <span className="font-bold text-text-secondary">개인정보처리방침</span>
            <span>고객센터</span>
          </div>
          <span>© 2024 Changwon Clean Service. All rights reserved.</span>
        </div>
      </footer>
    </main>
  );
}
