# 04. 모바일 앱 화면 설계 (Expo Router)

- 문서 버전: **v3**
- 마지막 업데이트: **2026-02-11**

> 목표: **Expo + Expo Router** 기반으로, 요청자(Customer) / 제공자(Cleaner) 2개 역할을 지원하는 MVP 모바일 앱의 **화면 구조(라우팅) / 플로우 / 컴포넌트 구조 / 데이터 요구사항**을 정의합니다.

- 앱(예정): `apps/mobile` (Expo React Native)
- 라우팅: **Expo Router** (파일 기반)
- 데이터/서버 상태: **TanStack Query**
- 폼: React Hook Form + Zod(권장)
- 스타일: **NativeWind** + 공통 토큰(Plan 06)

참고:
- PRD/아키텍처: `docs/plans/01-prd-architecture.md`
- API: `docs/plans/03-api-endpoints.md`

---

## 0) 범위 (MVP)

### 포함
- 인증/로그인 + 최초 역할 선택
- 예약(booking) 생성(요청자)
- 예약 목록/상세/상태 변경(요청자/제공자)
- 예약 기반 메시지(폴링)
- 리뷰 작성/조회
- 프로필/설정(최소)

### 제외 (Post‑MVP)
- 결제
- 실시간 채팅(WebSocket)
- 푸시 알림
- 지도/거리 기반 정렬
- 정기 예약

### 용어
- 구현/API/DB는 `bookings`를 사용
- UI에서는 “예약(booking)” 표기

---

## 1) 네비게이션/라우팅 설계 원칙

### 1.1 Auth Gate (진입 라우팅)
- 앱 최초 진입은 `app/index.tsx`에서 **세션 + role** 확인 후 redirect

권장 분기:
- 미인증 → `(auth)/login`
- 인증됨 + role 없음 → `(auth)/role-select`
- 인증됨 + role=customer → `(customer)`
- 인증됨 + role=cleaner → `(cleaner)`

> role은 서버 세션에서 파생된 값을 기준으로 하며, 클라이언트 단독 저장값만으로 확정하지 않습니다.

### 1.2 레이아웃 전략 (Tabs + Stack)
- Root `_layout.tsx`
  - `QueryClientProvider`
  - `Auth/SessionProvider`
  - Theme/token provider
  - Global toast, error boundary
- Role 영역은 **Tabs(허브) + Stack(상세/작성)** 혼합
  - 목록/홈: Tabs
  - 상세/작성/위저드: Stack push

### 1.3 공통 화면(shared) 우선
- 예약 상세/채팅/리뷰/설정 등은 `(shared)`로 배치해 역할 간 중복 최소화
- Customer/Cleaner 모두 `(shared)` 라우트를 push 가능

### 1.4 라우팅 키
- 핵심 식별자: `bookingId`
- 딥링크 예: `myapp://booking/booking_123` → `(shared)/booking/[id]`

---

## 2) Expo Router 파일 구조(권장)

> 실제 구현 기준 경로: `apps/mobile/app/*`

```text
apps/mobile/app/
├── _layout.tsx
├── index.tsx                      # Splash/Entry (Auth Gate)
├── +not-found.tsx
│
├── (auth)/
│   ├── _layout.tsx                # Stack
│   ├── login.tsx
│   └── role-select.tsx
│
├── (customer)/
│   ├── _layout.tsx                # Tabs container
│   ├── (tabs)/
│   │   ├── index.tsx              # 홈
│   │   ├── bookings.tsx           # 내 예약 목록
│   │   └── profile.tsx            # 내 프로필/설정
│   └── request/                   # 예약 생성 Wizard (Stack)
│       ├── service.tsx
│       ├── datetime.tsx
│       ├── address.tsx
│       ├── details.tsx
│       └── confirm.tsx
│
├── (cleaner)/
│   ├── _layout.tsx                # Tabs container
│   ├── (tabs)/
│   │   ├── index.tsx              # 일감 목록(pending)
│   │   ├── schedule.tsx           # 내 일정
│   │   └── profile.tsx            # 제공자 프로필/설정
│   └── job/
│       └── [id].tsx               # 일감 상세/액션
│
└── (shared)/
    ├── booking/
    │   └── [id].tsx               # 공통 예약 상세(읽기 중심)
    ├── chat/
    │   └── [bookingId].tsx        # 채팅방(예약 기반)
    ├── reviews/
    │   ├── write.tsx              # 리뷰 작성
    │   └── cleaner-[id].tsx       # 청소부 리뷰 목록
    └── settings/
        ├── index.tsx              # 설정
        └── account.tsx            # 계정(로그아웃/탈퇴)
```

권장 규칙:
- Tabs는 `(tabs)` 그룹 내부에만 둔다(탭 바 구성 명확)
- 상세/작성은 탭 바와 분리된 stack route로 push

---

## 3) 역할별 플로우(사용자 여정)

### 3.1 요청자(Customer) 플로우

```text
앱 시작
  → Auth Gate
  → 로그인
  → 역할 선택(customer)
  → 홈
  → 예약 생성 Wizard
     1) 서비스/평수
     2) 날짜/시간
     3) 주소(지역 선택 + 상세주소)
     4) 요청사항/예산
     5) 최종 확인
  → 예약 생성 완료
  → 내 예약 목록/상세
  → (confirmed 이후) 채팅
  → 완료(completed)
  → 리뷰 작성
```

핵심 UX 포인트:
- Wizard는 왕복 이동이 잦음 → **draft 상태 저장** 필수(zustand 또는 context)
- 예약 생성 submit은 중복 방지(button disable + loading)
- `pending` 상태에서 취소 CTA 제공

### 3.2 제공자(Cleaner) 플로우

```text
앱 시작
  → Auth Gate
  → 로그인
  → 역할 선택(cleaner)
  → 일감 목록(pending)
  → 일감 상세
     - 수락(confirmed) 또는 거절
     - 시작(in_progress)
     - 완료(completed)
  → 내 일정(schedule)에서 상태별 관리
  → (필요 시) 채팅
  → 완료 후 리뷰(정책 확정에 따라 상호)
```

핵심 UX 포인트:
- 수락은 경합 가능 → 서버 `CONFLICT` 시 토스트 + 목록 refetch
- 상태 변경 버튼은 현재 status에 따라 노출/비활성 제어

---

## 4) Screen Inventory (화면별 목적/네비/데이터)

> 포맷: **화면 / 목적 / 진입 경로 / API / 상태(로딩·에러·빈화면) / 주요 컴포넌트**

### 4.1 (auth)

#### (auth)/login
- 목적: OAuth 로그인 시작/복귀
- 진입: 앱 최초(Auth Gate) 또는 로그아웃 후
- API:
  - `GET /api/auth/session`(옵션: 이미 로그인 여부 확인)
  - provider sign-in flow
- 상태:
  - 로딩: 로그인 버튼 disabled
  - 에러: OAuth 실패 토스트 + 재시도
- 컴포넌트:
  - `OAuthButton(provider)`

#### (auth)/role-select
- 목적: 최초 1회 역할 선택(customer/cleaner)
- 진입: 로그인 후 role 미설정
- API(정책 중 하나로 확정 필요):
  - A) `PATCH /api/v1/me { role }`
  - B) cleaner 선택 시 `PATCH /api/v1/cleaners/me` 생성/업데이트로 role 확정
- 상태:
  - 제출 로딩, 실패 시 안내/재시도
- 컴포넌트:
  - `RoleCard(customer|cleaner)`

### 4.2 (customer)

#### (customer)/(tabs)/index (홈)
- 목적: 새 예약 생성 진입 + 최근 예약 요약
- 진입: Auth Gate 후 customer 기본 탭
- API: `GET /api/v1/bookings?roleView=customer&limit=20`
- 상태:
  - 빈화면: “첫 예약 만들기” CTA
- 컴포넌트:
  - `QuickActionCard`
  - `BookingSummaryCard`

#### (customer)/(tabs)/bookings (내 예약 목록)
- 목적: 상태별 목록 + 상세 진입
- API: `GET /api/v1/bookings?roleView=customer&status=...`
- 상태:
  - 로딩 스켈레톤
  - 빈화면(상태 필터별)
- 컴포넌트:
  - `FilterChips(status)`
  - `BookingCard`

#### (customer)/request/* (예약 생성 Wizard)
- 목적: 단계별 입력 수집 → confirm에서 생성
- API:
  - 지역: `GET /api/v1/areas`, `GET /api/v1/areas/:areaId/sub-areas`
  - 생성: `POST /api/v1/bookings`
- 상태:
  - validation error(필드 단위)
  - submit 로딩/중복 방지
- 컴포넌트(단계별 공통):
  - `WizardHeader(step/total)`
  - `FormField`, `SelectField`, `DateTimePickerField`

#### (customer)/(tabs)/profile
- 목적: 내 정보 + 설정 진입
- API: `GET/PATCH /api/v1/me`

### 4.3 (cleaner)

#### (cleaner)/(tabs)/index (일감 목록)
- 목적: 대기(pending) 예약 탐색
- API: `GET /api/v1/bookings?roleView=cleaner&status=pending`
- 상태:
  - 빈화면: “새 일감 없음” 안내
- 컴포넌트:
  - `BookingCard`, `EmptyState`

#### (cleaner)/job/[id] (일감 상세/액션)
- 목적: 상세 확인 후 수락/거절/시작/완료
- API:
  - 상세: `GET /api/v1/bookings/:id`
  - 수락: `POST /api/v1/bookings/:id/accept`
  - 거절: `POST /api/v1/bookings/:id/reject`
  - 시작: `POST /api/v1/bookings/:id/start`
  - 완료: `POST /api/v1/bookings/:id/complete`
- 상태:
  - CONFLICT: “다른 제공자가 먼저 수락했습니다” 등 메시지
- 컴포넌트:
  - `BookingDetailView`
  - `PrimaryButton`(상태별 CTA)

#### (cleaner)/(tabs)/schedule
- 목적: confirmed/in_progress/completed 목록
- API: `GET /api/v1/bookings?roleView=cleaner&status=confirmed|in_progress|completed`

#### (cleaner)/(tabs)/profile
- 목적: 제공자 프로필 관리(가격/소개 등)
- API: `GET/PATCH /api/v1/cleaners/me`

### 4.4 (shared)

#### (shared)/booking/[id] (공통 예약 상세)
- 목적: 예약 정보 조회 + 상태에 따른 CTA + 채팅/리뷰 진입
- API:
  - `GET /api/v1/bookings/:id`
  - 취소: `POST /api/v1/bookings/:id/cancel`
- 권한:
  - booking 참여자(customer/cleaner)만 접근

#### (shared)/chat/[bookingId] (채팅)
- 목적: 예약 기반 메시지(폴링)
- API: `GET/POST /api/v1/bookings/:id/messages`
- 폴링: 3~5초(앱 background 시 중단)

#### (shared)/reviews/write (리뷰 작성)
- 목적: 완료된 예약에 리뷰 작성
- API: `POST /api/v1/bookings/:id/reviews`
- 정책(권장):
  - `completed`에서만 노출
  - 1회 작성 후 수정은 `PATCH /api/v1/reviews/:id`

#### (shared)/reviews/cleaner-[id] (리뷰 목록)
- 목적: 청소부 리뷰 공개 목록
- API: `GET /api/v1/cleaners/:id/reviews`

#### (shared)/settings/*
- 목적: 로그아웃/탈퇴 등
- API: `POST /api/auth/sign-out`(또는 Better Auth 제공 경로)

---

## 5) 상태(Status)별 UI/CTA 가이드

권장 상태 머신(Plan 03):
- `pending` → `confirmed` → `in_progress` → `completed`
- 취소: `cancelled`

### CTA 매트릭스(요약)
- `pending`
  - Customer: 취소, “수락 대기” 안내
  - Cleaner: 수락/거절
- `confirmed`
  - 양측: 채팅, 일정/주소 확인
- `in_progress`
  - Cleaner: 완료 처리
  - Customer: 상태 표시 + 채팅
- `completed`
  - 양측: 리뷰 CTA(정책 확정 필요)
- `cancelled`
  - 양측: 취소 사유/취소자 표시

---

## 6) 컴포넌트/폴더 구조 설계

### 6.1 폴더 구조(권장)

```text
apps/mobile/
├── app/                       # expo-router routes
├── components/
│   ├── atoms/                 # Button, Input, Badge...
│   ├── molecules/             # FormField, RatingStars...
│   ├── organisms/             # BookingCard, BookingDetail, MessageList...
│   └── layouts/               # ScreenLayout, KeyboardAvoidLayout...
├── features/
│   ├── auth/
│   ├── bookings/
│   ├── chat/
│   ├── reviews/
│   └── profile/
├── lib/
│   ├── api/                   # fetcher, typed client wrappers
│   ├── query/                 # query keys, hooks
│   ├── navigation/            # role routing helpers
│   └── constants/             # status label/color, service types...
└── store/                     # wizard 임시 상태(zustand 등)
```

### 6.2 재사용 컴포넌트 후보(우선순위)

- Layout
  - `ScreenLayout` (safe area + padding + header)
  - `KeyboardAvoidLayout`
- Booking
  - `BookingCard`
  - `BookingStatusPill` (status → label/color)
  - `BookingMetaRow` (날짜/시간/주소/서비스)
  - `BookingDetailView`
- Chat
  - `MessageBubble`
  - `MessageList`
  - `MessageComposer`
- Form
  - `FormField` (label + input + error)
  - `DateTimePickerField`
  - `SelectField` (지역/서비스)
- Common
  - `PrimaryButton`, `SecondaryButton`, `TextButton`
  - `EmptyState`, `LoadingView`, `ErrorView`

---

## 7) 데이터 패턴 (TanStack Query)

### 7.1 Query Key 규칙(예)
- `['me']`
- `['bookings', { roleView, status, from, to, cursor, limit }]`
- `['booking', bookingId]`
- `['messages', bookingId]`
- `['cleanerReviews', cleanerId]`

### 7.2 Mutation 이후 invalidate(권장)
- 예약 생성 성공 → `invalidate(['bookings', { roleView: 'customer' }])`
- 수락/거절/시작/완료 → `invalidate(['booking', id])` + 목록 쿼리 invalidate
- 메시지 전송 → `invalidate(['messages', bookingId])` 또는 optimistic update

### 7.3 에러 처리
- `UNAUTHORIZED` → 로그인 화면 redirect
- `FORBIDDEN`/`NOT_FOUND` → NotFound/권한 안내 화면
- `CONFLICT`(수락 경합) → 토스트 + 목록 refetch

---

## 8) 구현 체크리스트(다음 단계)

- [ ] `app/index.tsx`에서 role 기반 redirect 유틸 작성
- [ ] 예약 생성 wizard draft store(zustand) 도입
- [ ] 예약 status enum/라벨/색상 매핑 상수화
- [ ] 채팅 폴링 주기/백오프 정책 정의
- [ ] 리뷰 작성 가능 조건(완료 후, 1회) 정책 확정
- [ ] `apps/mobile/app/` 라우팅 스캐폴딩 생성(구현 단계)
