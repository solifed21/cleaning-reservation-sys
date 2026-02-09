# 01. PRD & 아키텍처

## 📋 제품 개요

### 비전
창원 지역 원룸 거주자와 청소 서비스 제공자를 연결하는 간편한 C2C 플랫폼

### 타겟 유저

**청소 요청자 (Customer)**
- 창원 지역 원룸 거주자
- 바쁜 직장인, 학생
- 이사 전후 청소가 필요한 사람

**청소 제공자 (Cleaner)**
- 프리랜서 청소 전문가
- 부업을 원하는 사람
- 청소 서비스 업체 소속 직원

### 핵심 가치
- **간편함**: 몇 번의 탭으로 예약 완료
- **신뢰**: 리뷰 시스템으로 품질 보장
- **유연함**: 원하는 시간에 원하는 청소

---

## 🎯 MVP 기능 범위

### Must Have (MVP)
1. **회원가입/로그인**
   - 소셜 로그인 (카카오, 네이버)
   - 역할 선택 (요청자/제공자)

2. **프로필 관리**
   - 요청자: 기본 정보, 주소
   - 제공자: 기본 정보, 서비스 가능 지역, 가격, 소개

3. **예약 시스템**
   - 요청자: 청소 요청 등록 (날짜, 시간, 주소, 요구사항)
   - 제공자: 요청 목록 조회, 수락/거절
   - 예약 상태 관리 (대기/확정/완료/취소)

4. **메시지 시스템**
   - 예약 기반 메시지 (booking_messages)
   - 폴링 방식 (MVP)

5. **리뷰 시스템**
   - 청소 완료 후 상호 리뷰
   - 별점 + 텍스트

### Nice to Have (Post-MVP)
- 실시간 채팅 (WebSocket)
- 결제 연동 (토스페이먼츠)
- 푸시 알림
- 청소 진행 상태 실시간 추적
- 정기 예약

---

## 🏗️ 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
├─────────────────────────────┬───────────────────────────────┤
│     Expo React Native       │      TanStack Start Web       │
│     (iOS / Android)         │      (관리자 대시보드)          │
└─────────────────────────────┴───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      TanStack Start                          │
│                    (Full-stack Server)                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Routes    │  │   Actions   │  │   Server Functions  │  │
│  │  (Pages)    │  │  (Mutations)│  │   (API Logic)       │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                       Data Layer                             │
├───────────────────────┬─────────────────────────────────────┤
│     PostgreSQL        │          File Storage               │
│   (Neon / Supabase)   │    (Cloudflare R2 / S3)            │
└───────────────────────┴─────────────────────────────────────┘
```

### 기술 스택 상세

| Layer | Technology | 선택 이유 |
|-------|------------|-----------|
| Mobile | Expo React Native | 웹과 코드 공유, 빠른 개발 |
| Web | TanStack Start | React 기반 풀스택, 타입 안전 |
| Styling | Tailwind CSS + NativeWind | 웹/앱 스타일 통일 |
| State | TanStack Query | 서버 상태 관리 |
| DB | PostgreSQL (Neon) | 무료 티어, Serverless |
| ORM | Drizzle ORM | 타입 안전, 경량 |
| Auth | Better Auth | OAuth 간편 설정 |
| Storage | Cloudflare R2 | S3 호환, 무료 티어 넉넉 |

---

## 📱 화면 흐름 (User Flow)

### 요청자 플로우
```
앱 시작 → 로그인 → 홈(요청 목록)
                    ↓
              새 청소 요청
                    ↓
         날짜/시간/주소/요구사항 입력
                    ↓
              요청 등록 완료
                    ↓
         제공자 수락 대기 → 알림 수신
                    ↓
              예약 확정 → 메시지
                    ↓
              청소 완료 → 리뷰 작성
```

### 제공자 플로우
```
앱 시작 → 로그인 → 홈(수락 가능한 요청)
                    ↓
              요청 상세 확인
                    ↓
           수락 or 거절
                    ↓
         수락 시 → 예약 확정 → 메시지
                    ↓
              청소 진행
                    ↓
              완료 처리 → 리뷰 작성
```

---

## 📁 프로젝트 구조 (상세)

```
cleaning-reservation-sys/
├── apps/
│   ├── mobile/                    # Expo React Native
│   │   ├── app/                   # Expo Router (파일 기반 라우팅)
│   │   │   ├── (auth)/           # 인증 관련 화면
│   │   │   ├── (customer)/       # 요청자 화면
│   │   │   ├── (cleaner)/        # 제공자 화면
│   │   │   └── _layout.tsx
│   │   ├── components/
│   │   ├── hooks/
│   │   └── package.json
│   │
│   └── web/                       # TanStack Start
│       ├── app/
│       │   ├── routes/           # 페이지 라우트
│       │   ├── components/
│       │   └── routeTree.gen.ts
│       ├── server/
│       │   ├── db/               # Drizzle 스키마, 마이그레이션
│       │   ├── actions/          # Server Actions
│       │   └── functions/        # Server Functions
│       └── package.json
│
├── packages/
│   ├── shared/                    # 공유 코드
│   │   ├── types/                # TypeScript 타입
│   │   ├── constants/            # 상수
│   │   ├── utils/                # 유틸리티 함수
│   │   └── validators/           # Zod 스키마
│   │
│   └── ui/                        # 공유 UI (선택적)
│       └── components/
│
├── docs/
│   └── plans/
│
├── package.json                   # 루트 (pnpm workspace)
├── pnpm-workspace.yaml
└── turbo.json                     # Turborepo 설정
```

---

## ✅ 다음 단계

- [ ] 02. DB 스키마 & 데이터 모델 설계
- [ ] 03. API 엔드포인트 정의
- [ ] 04. 모바일 앱 화면 설계
- [ ] 05. 웹 대시보드 설계
- [ ] 06. UI/UX 테마 & 디자인 시스템
