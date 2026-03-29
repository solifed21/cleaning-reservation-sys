export type AppNavItem = {
  label: string;
  href: string;
};

export type AdminNavItem = AppNavItem & {
  disabled?: boolean;
};

export const userPrimaryNav: AppNavItem[] = [
  { label: '홈', href: '/' },
  { label: '예약', href: '/customer/bookings' },
  { label: '예약 요청', href: '/customer/request' },
  { label: '클리너', href: '/cleaner' },
];

export const userMobileNav: AppNavItem[] = [
  { label: '홈', href: '/' },
  { label: '내 예약', href: '/customer/bookings' },
  { label: '요청하기', href: '/customer/request' },
  { label: '클리너', href: '/cleaner' },
];

export const adminNavGroups: Array<{ title: string; items: AdminNavItem[] }> = [
  {
    title: 'Overview',
    items: [
      { label: '대시보드 홈', href: '/admin' },
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
