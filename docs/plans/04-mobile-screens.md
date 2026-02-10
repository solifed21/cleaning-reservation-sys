# 04. 모바일 앱 화면 설계 (Expo Router)

> 목표: **Expo + Expo Router** 기반으로, 요청자(Customer) / 제공자(Cleaner) 2개 역할을 지원하는 MVP 모바일 앱의 화면/네비게이션/컴포넌트/데이터 요구사항을 정의합니다.

- 앱(예정): `apps/mobile` (Expo React Native)
- 라우팅: **Expo Router** (파일 기반)
- 상태/데이터: **TanStack Query** (서버 상태)
- 폼 검증: Zod(권장)
- 스타일: **NativeWind** + 공통 토큰(Plan 06)

---

## 0) 범위 (MVP)
- 인증/역할선택
- 예약 생성(요청자)
- 예약 목록/상세/상태 변경(요청자/제공자)
- 예약 기반 메시지(폴링)
- 리뷰 작성/조회
- 프로필/설정

> 용어 정리(문서 간 차이 흡수)
> - DB 문서(02): `bookings`
> - API 문서(03): `reservations`
> - 본 문서: **예약 = reservation(=booking)** 으로 병기합니다.

> Post‑MVP
> - 결제, 실시간 채팅(WebSocket), 푸시 알림, 지도/거리 기반 정렬

---

## 1) 네비게이션 원칙

### 1.1 Auth Gate (진입 라우팅)
- 앱 최초 진입: `app/index.tsx`에서 **세션 + role** 확인 후 redirect

권장 분기:
- 미인증 → `(auth)/login`
- 인증됨 + role 없음 → `(auth)/role-select`
- 인증됨 + role=customer → `(customer)`
- 인증됨 + role=cleaner → `(cleaner)`

### 1.2 레이아웃 전략
- Root `_layout.tsx`
  - QueryClientProvider, ThemeProvider, Auth(Session)Provider
  - Toast, ErrorBoundary
- Role 영역
  - **Tabs(허브)** + **Stack(상세/작성 플로우)** 혼합

### 1.3 “공통 화면(shared) 우선”
- 예약 상세(읽기), 채팅방, 리뷰 작성/조회, 설정은 `(shared)`에 배치
- Customer/Cleaner에서 동일 라우트를 push하여 UI/로직 중복을 최소화

---

## 2) Expo Router 라우팅 구조
> 실제 구현 기준 경로: `apps/mobile/app/*`

```text
apps/mobile/app/
├── _layout.tsx                    # Root Providers
├── index.tsx                      # Splash/Entry (Auth Gate)
├── +not-found.tsx
│
├── (auth)/
│   ├── _layout.tsx                # Stack
│   ├── login.tsx                  # 소셜/이메일 로그인
│   ├── signup.tsx                 # (선택) 이메일 회원가입
│   └── role-select.tsx            # 최초 1회 역할 선택
│
├── (customer)/
│   ├── _layout.tsx                # Tabs container
│   ├── (tabs)/
│   │   ├── index.tsx              # 홈(요청자)
│   │   ├── reservations.tsx       # 내 예약 목록
│   │   ├── chat.tsx               # 채팅 목록(옵션, MVP는 예약에서 진입 가능)
│   │   └── profile.tsx            # 내 프로필/설정
│   └── request/                   # 예약 생성 Wizard (Stack)
│       ├── service.tsx            # 서비스 타입/평수
│       ├── datetime.tsx           # 날짜/시간 선택
│       ├── address.tsx            # 주소 입력
│       ├── details.tsx            # 요청사항 입력
│       └── confirm.tsx            # 최종 확인/생성
│
├── (cleaner)/
│   ├── _layout.tsx                # Tabs container
│   ├── (tabs)/
│   │   ├── index.tsx              # 일감 목록(pending)
│   │   ├── schedule.tsx           # 내 일정(confirmed/completed)
│   │   ├── chat.tsx               # 채팅 목록(옵션)
│   │   └── profile.tsx            # 제공자 프로필
│   └── job/
│       └── [id].tsx               # 예약 상세(수락/거절/상태 변경)
│
└── (shared)/
    ├── reservation/
    │   └── [id].tsx               # 공통 예약 상세(읽기 중심)
    ├── chat/
    │   └── [bookingId].tsx        # 채팅방(예약 기반)
    ├── reviews/
    │   ├── write.tsx              # 리뷰 작성
    │   └── [targetId].tsx         # 리뷰 목록(대상별)
    └── settings/
        ├── index.tsx              # 설정
        └── account.tsx            # 계정(로그아웃/탈퇴)
```

---

## 3) 요청자(Customer) 화면 플로우

### 3.1 핵심 사용자 여정
로그인/역할 선택 → 홈 → 예약 생성(요청) → 상태 추적/메시지 → 완료 → 리뷰

### 3.2 화면별 목적/데이터(엔드포인트 매핑)

#### A) 홈 `(customer)/(tabs)/index`
- 목적: 빠른 예약 생성 + 최근 예약 1건 요약
- 데이터:
  - `GET /reservations` (최근/예정 1건 client filter)

#### B) 예약 생성 Wizard `(customer)/request/*`
- 목적: 입력을 단계별로 수집, 최종 confirm에서 생성
- 입력(초안): `service_type`, `area_size`, `scheduled_at`, `address`, `notes`
- 최종 생성:
  - `POST /reservations`

#### C) 내 예약 `(customer)/(tabs)/reservations`
- 목적: 내 예약 목록(상태 필터) + 상세 진입
- 데이터:
  - `GET /reservations`
  - 취소:
    - `DELETE /reservations/{id}` 또는 정책에 따라 status 변경

#### D) 예약 상세 `(shared)/reservation/[id]`
- 데이터:
  - `GET /reservations/{id}`
- 상태별 CTA 예시:
  - pending: 취소
  - confirmed: 채팅
  - completed: 리뷰

#### E) 채팅 `(shared)/chat/[bookingId]`
- MVP: 폴링 기반

#### F) 프로필 `(customer)/(tabs)/profile`
- 데이터:
  - `GET /profiles`
  - `PATCH /profiles`

---

## 4) 제공자(Cleaner) 화면 플로우

### 4.1 핵심 사용자 여정
로그인/역할 선택 → 일감 목록 → 예약 상세 → 수락/거절 → 일정/상태 변경 → 완료/리뷰

### 4.2 화면별 목적/데이터(엔드포인트 매핑)

#### A) 일감 목록 `(cleaner)/(tabs)/index`
- 목적: 대기(pending) 예약 탐색
- 데이터:
  - `GET /reservations` (pending만 필터)

#### B) 예약 상세/수락 `(cleaner)/job/[id]`
- 데이터:
  - `GET /reservations/{id}`
  - 상태 변경:
    - `PATCH /reservations/{id}/status` (pending→confirmed 등)
- UX 메모:
  - 고객 연락처/주소 노출 정책은 추후 확정(최소한 채팅 기반으로 대체 가능)

#### C) 내 일정 `(cleaner)/(tabs)/schedule`
- 목적: 확정/완료 예약 관리
- 데이터:
  - `GET /reservations` (confirmed/completed)
  - 완료 처리:
    - `PATCH /reservations/{id}/status` (confirmed→completed)

#### D) 프로필 `(cleaner)/(tabs)/profile`
- 목적: 소개/가격/가용지역(확장) 관리
- 데이터:
  - `GET /profiles`
  - `PATCH /profiles`

---

## 5) 공통(Shared) 화면 정책

### 5.1 예약 상세 `(shared)/reservation/[id]`
- 포함:
  - 상태, 예정일시, 주소, 요청사항, 서비스 타입/면적
  - 조건부 CTA:
    - 채팅: 예약이 존재하고 참여자일 때
    - 리뷰: completed 이후 + 아직 작성 전

### 5.2 채팅방 `(shared)/chat/[bookingId]`
- MVP: 폴링 기반
- 권장 UX:
  - fetch interval: 3~5초
  - 앱 background 시 polling 정지
  - 전송 성공 시 optimistic update

### 5.3 리뷰
- 작성 `(shared)/reviews/write`
  - `POST /reviews`
- 조회 `(shared)/reviews/[targetId]`
  - API 문서(03) 기준: `GET /reviews?service_id={id}`
  - 다만 UI는 “대상별(청소부/요청자)” 조회를 원할 수 있으므로, 파라미터는 추후 확정 필요

---

## 6) 컴포넌트/폴더 구조 설계

### 6.1 권장 디렉토리(모바일 앱 내부)
```text
apps/mobile/
├── app/                       # expo-router routes
├── components/
│   ├── atoms/                 # Button, Input, Badge...
│   ├── molecules/             # FormField, RatingStars...
│   ├── organisms/             # ReservationCard, MessageList...
│   └── layouts/               # ScreenLayout, KeyboardAvoidLayout...
├── features/
│   ├── auth/
│   ├── reservations/
│   ├── chat/
│   ├── reviews/
│   └── profile/
├── lib/
│   ├── api/                   # fetcher, client wrappers
│   ├── query/                 # query keys, hooks
│   ├── navigation/            # role routing helpers
│   └── constants/             # status label/color, service types...
└── store/                     # wizard 임시 상태(zustand 등)
```

### 6.2 공통 UI 컴포넌트 후보
- `AppHeader`, `ScreenLayout`, `KeyboardAvoidLayout`
- `PrimaryButton`, `SecondaryButton`, `TextButton`
- `Card`, `Divider`, `Avatar`
- `StatusBadge` / `ReservationStatusPill`
- `EmptyState`, `LoadingView`, `ErrorView`
- `FormField` (label + input + error)
- `BottomSheet`/`Modal` (필터/확인 다이얼로그)

---

## 7) 상태/데이터 패턴 (TanStack Query)

### 7.1 Query Key 규칙(예)
- `['profile', 'me']`
- `['reservations', { scope: 'me', status }]`
- `['reservation', id]`
- `['messages', bookingId]`

### 7.2 화면-API 매핑(요약)
- 프로필: `GET/PATCH /profiles`
- 예약 목록/상세: `GET /reservations`, `GET /reservations/{id}`
- 예약 생성: `POST /reservations`
- 예약 상태 변경: `PATCH /reservations/{id}/status`
- 리뷰: `POST /reviews`, `GET /reviews?...`

---

## 8) 예약 상태(Status)별 UI 가이드(초안)

> 실제 enum은 DB/API에 맞춰 확정. 문서/예시는 아래와 같이 매핑해 사용.

- `pending` (또는 `WAITING`)
  - Customer: “취소”, “대기 안내(제공자 수락 대기)”
  - Cleaner: “수락/거절”
- `confirmed`
  - 양측: “메시지”, 일정/주소 확인
  - Customer 취소 정책(시간 제한) 필요
- `completed`
  - 양측: 리뷰 CTA
- `cancelled` / `canceled`
  - 취소 사유 표시(있다면)

---

## 9) 에러/로딩/엣지케이스
- 네트워크 실패: 재시도 버튼 + “마지막 업데이트 시각” 표시
- 중복 제출 방지: 예약 생성/수락/완료 버튼 disable + (가능하면) 서버 idempotency
- 경합 상황:
  - 이미 다른 Cleaner가 수락한 경우 → 수락 실패 토스트 + 목록 갱신
- 권한:
  - 위치 권한은 MVP에서 필수 아님(거리 정렬은 옵션)
  - 알림 권한도 선택(거부해도 사용 가능)

---

## 10) 분석 이벤트(선택)
- `signup_complete(role)`
- `reservation_create_start` / `reservation_create_submit`
- `reservation_accept`
- `message_send`
- `review_submit`

---

## 11) 구현 체크리스트
- [ ] `index.tsx` role 기반 redirect 유틸 작성
- [ ] 예약 생성 wizard 임시 상태 저장(zustand or context)
- [ ] 예약 상태 enum/라벨/색상 매핑 상수화
- [ ] 메시지 폴링 주기/백오프 정책 정의
- [ ] 리뷰 작성 가능 조건(완료 후, 1회) 정책 확정
- [ ] 실제 `apps/mobile/app/` 스캐폴딩 생성(구현 단계)
