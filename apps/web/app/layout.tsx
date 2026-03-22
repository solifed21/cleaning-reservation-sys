import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '창원 원룸 청소 예약',
  description: '창원 지역 원룸 청소 예약을 위한 Next.js 기반 웹 서비스',
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
