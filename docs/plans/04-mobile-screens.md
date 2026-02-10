# 04. 모바일 앱 화면 설계 (Expo Router)

- 문서 버전: **v2**
- 마지막 업데이트: **2026-02-11**

> 목표: **Expo + Expo Router** 기반으로, 요청자(Customer) / 제공자(Cleaner) 2개 역할을 지원하는 MVP 모바일 앱의 **화면 구조/플로우/컴포넌트/데이터 요구사항**을 정의합니다.

- 앱(예정): `apps/mobile` (Expo React Native)
- 라우팅: **Expo Router** (파일 기반)
- 데이터/서버상태: **TanStack Query**
- 폼 검증: Zod(권장)
- 스타일: **NativeWind** + 공통 토큰(Plan 06)

참고:
- PRD/아키텍처: `docs/plans/01-prd-architecture.md`
- API: `docs/plans/03-api-endpoints.md`

---

## 0) 범위 (MVP)

### 포함
- 인증/역할선택
- 예약 생성(요청자)
- 예약 목록/상세/상태 변경(요청자/제공자)
- 예약 기반 메시지(폴링)
- 리뷰 작성/조회
- 프로필/설정

### 제외 (Post‑MVP)
- 결제, 실시간 채팅(WebSocket), 푸시 알림, 지도/거리 기반 정렬, 정기 예약

### 용어
- DB/구현/API는 `bookings`를 사용
- UI 문맥에서는 “예약(booking)”으로 표기

---

## 1) 네비게이션 설계 원칙

### 1.1 Auth Gate (진입 라우팅)
- 앱 최초 진입: `app/index.tsx`에서 **세션 + role** 확인 후 redirect

권장 분기:
- 미인증 → `(auth)/login`
- 인증됨 + role 없음 → `(auth)/role-select`
- 인증됨 + role=customer → `(customer)`
- 인증됨 + role=cleaner → `(cleaner)`

> role은 서버 세션(예: `/api/auth/session` 또는 `GET /api/v1/me`)과 동기화되는 값을 사용.

### 1.2 레이아웃 전략 (Tabs + Stack 혼합)
- Root `_layout.tsx`
  - QueryClientProvider
  - Session/Auth Provider
  - Theme/Token provider(또는 NativeWind config)
  - Global Toast, ErrorBoundary
- Role 영역
  - **Tabs(허브)** + **Stack(상세/작성 플로우)**

### 1.3 공통 화면(shared) 우선
- 예약 상세, 채팅방, 리뷰, 설정은 `(shared)`로 배치
- Customer/Cleaner에서 동일 라우트를 push하여 UI/로직 중복 최소화

### 1.4 딥링크/내비게이션 규칙
- 기본적으로 `bookingId`가 핵심 키
- 딥링크(예시): `myapp://booking/booking_123` → `(shared)/booking/[id]`

---

## 2) Expo Router 라우팅 구조(권장)

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
│   │   ├── index.tsx              # 홈(요청자)
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
│   │   ├── schedule.tsx           # 내 일정(confirmed/in_progress/completed)
│   │   └── profile.tsx            # 제공자 프로필/설정
│   └── job/
│       └── [id].tsx               # 예약 상세(수락/거절/상태 변경)
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

> `chat` 탭은 MVP에서 “예약 상세 → 채팅” 진입만으로도 충분하여 기본 탭에서는 제외(필요 시 추가).

---

## 3) 화면 카탈로그 (Screen Inventory)

> 목적: 구현 단계에서 “무슨 화면이 있고, 어떤 API/상태를 가지는지”를 일관된 포맷으로 확인.

### 3.1 인증/공통

- **(auth)/login**
  - 목적: OAuth 로그인 시작/복귀
  - 데이터/API: `GET /api/auth/session`(옵션), provider sign-in
  - 주요 상태: loading, error

- **(auth)/role-select**
  - 목적: 최초 1회 역할 선택(customer/cleaner)
  - 데이터/API: (정책 확정 필요)
    - 옵션 A: `PATCH /api/v1/me { role }`
    - 옵션 B: cleaner는 `PATCH /api/v1/cleaners/me` 생성/업데이트로 role 확정

### 3.2 요청자(Customer)

- **(customer)/(tabs)/index (홈)**
  - 목적: 빠른 “새 예약 생성” 진입 + 최근 예약 요약
  - API: `GET /api/v1/bookings?roleView=customer&limit=20`
  - 컴포넌트: `QuickActionCard`, `BookingSummaryCard`, `StatusBadge`

- **(customer)/(tabs)/bookings (내 예약 목록)**
  - 목적: 상태별 목록 + 상세 진입
  - API: `GET /api/v1/bookings?roleView=customer&status=...`
  - 컴포넌트: `BookingCard`, `FilterChips`, `EmptyState`

- **(customer)/request/* (예약 생성 Wizard)**
  - 목적: 단계별 입력 수집, confirm에서 생성
  - API:
    - 지역 목록: `GET /api/v1/areas`, `GET /api/v1/areas/:areaId/sub-areas` (address 단계에서 사용)
    - 생성: `POST /api/v1/bookings`
  - 상태: draft 저장(zustand 등), 입력 검증, submit loading

- **(customer)/(tabs)/profile**
  - 목적: 내 정보/설정 진입
  - API: `GET/PATCH /api/v1/me`

### 3.3 제공자(Cleaner)

- **(cleaner)/(tabs)/index (일감 목록)**
  - 목적: 대기(pending) 예약 탐색
  - API: `GET /api/v1/bookings?roleView=cleaner&status=pending`
  - 컴포넌트: `BookingCard`, `SortDropdown`(옵션), `EmptyState`

- **(cleaner)/job/[id] (일감 상세/액션)**
  - 목적: 상세 확인 후 수락/거절/시작/완료
  - API:
    - 상세: `GET /api/v1/bookings/:id`
    - 수락: `POST /api/v1/bookings/:id/accept`
    - 거절: `POST /api/v1/bookings/:id/reject`
    - 시작: `POST /api/v1/bookings/:id/start`
    - 완료: `POST /api/v1/bookings/:id/complete`
  - 상태: action loading, CONFLICT 처리

- **(cleaner)/(tabs)/schedule (내 일정)**
  - 목적: confirmed/in_progress/completed 관리
  - API: `GET /api/v1/bookings?roleView=cleaner&status=confirmed|in_progress|completed`

- **(cleaner)/(tabs)/profile**
  - 목적: 제공자 프로필 관리(가격/소개 등)
  - API: `GET/PATCH /api/v1/cleaners/me`

### 3.4 공통(Shared)

- **(shared)/booking/[id] (예약 상세)**
  - 목적: 예약 정보 조회 + 상태에 따른 CTA + 채팅/리뷰 진입
  - API: `GET /api/v1/bookings/:id`, 취소: `POST /api/v1/bookings/:id/cancel`

- **(shared)/chat/[bookingId] (채팅방)**
  - 목적: 예약 기반 메시지(폴링)
  - API: `GET/POST /api/v1/bookings/:id/messages`

- **(shared)/reviews/write (리뷰 작성)**
  - 목적: 완료된 예약에 대한 리뷰 작성
  - API: `POST /api/v1/bookings/:id/reviews`

- **(shared)/reviews/cleaner-[id] (리뷰 목록)**
  - 목적: 청소부 리뷰 목록
  - API: `GET /api/v1/cleaners/:id/reviews`

- **(shared)/settings/* (설정/계정)**
  - 목적: 로그아웃/탈퇴 등
  - API: `POST /api/auth/sign-out`(또는 프레임워크 제공 로그아웃)

---

## 4) 역할별 플로우 정의

### 4.1 요청자(Customer) 플로우

```text
앱 시작
  → (Auth Gate)
  → 로그인
  → 역할 선택(customer)
  → 홈
  → 예약 생성 Wizard
     - 서비스/평수
     - 날짜/시간
     - 주소(지역 선택 + 상세주소)
     - 요청사항/예산
     - 최종 확인
  → 예약 생성 완료
  → 내 예약/예약 상세
  → (confirmed 이후) 채팅
  → 완료(completed)
  → 리뷰 작성
```

핵심 UX 포인트:
- Wizard는 “뒤로/앞으로” 이동이 잦으므로 **draft 상태 저장** 필수
- 예약 생성 submit은 중복 클릭 방지(버튼 disable + 로딩)

### 4.2 제공자(Cleaner) 플로우

```text
앱 시작
  → (Auth Gate)
  → 로그인
  → 역할 선택(cleaner)
  → 일감 목록(pending)
  → 일감 상세
     - 수락(confirmed) 또는 거절
     - 시작(in_progress)
     - 완료(completed)
  → 내 일정(schedule)에서 상태별 관리
  → (필요 시) 채팅
  → 완료 후 리뷰(정책에 따라 상호)
```

핵심 UX 포인트:
- 수락은 경합 가능 → 서버에서 `CONFLICT` 시 토스트 + 목록 refetch
- 상태 변경 버튼은 현재 status에 따라 노출/비활성 제어

---

## 5) 상태(Status)별 UI/CTA 가이드

권장 상태 머신(Plan 03):
- `pending` → `confirmed` → `in_progress` → `completed`
- 취소: `cancelled`

### 5.1 CTA 매트릭스(요약)
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
  - 양측: 취소 사유/취소자(있다면) 표시

---

## 6) 컴포넌트 구조 설계

### 6.1 앱 폴더 구조(권장)

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
- `['bookings', { roleView, status, from, to, cursor }]`
- `['booking', id]`
- `['messages', bookingId]`
- `['cleanerReviews', cleanerId]`

### 7.2 채팅 폴링 정책(MVP)
- fetch interval: 3~5초
- 앱 background 시 polling 정지
- 전송 성공 시 optimistic update(또는 invalidate)

---

## 8) 구현 체크리스트(다음 단계)

- [ ] `app/index.tsx` role 기반 redirect 유틸 작성
- [ ] 예약 생성 wizard 임시 상태 저장(zustand or context)
- [ ] 예약 status enum/라벨/색상 매핑 상수화
- [ ] 메시지 폴링 주기/백오프 정책 정의
- [ ] 리뷰 작성 가능 조건(완료 후, 1회) 정책 확정
- [ ] `apps/mobile/app/` 스캐폴딩 생성(구현 단계)
