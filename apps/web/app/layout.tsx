import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '청소 예약 서비스 웹 프로토타입',
  description: '일반 사용자와 관리자 모두를 위한 청소 예약 서비스 웹 프로토타입',
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
