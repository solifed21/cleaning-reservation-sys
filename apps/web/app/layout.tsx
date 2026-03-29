import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '창원 원룸 청소 예약 서비스',
  description: '한국형 홈서비스 UX를 반영한 요청자, 제공자, 관리자용 청소 예약 웹 프로토타입',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
