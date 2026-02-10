# 04. 모바일 앱 화면 설계 (Expo Router)

- 문서 버전: **v2**
- 마지막 업데이트: **2026-02-11**

> 목표: **Expo + Expo Router** 기반으로, 요청자(Customer) / 제공자(Cleaner) 2개 역할을 지원하는 MVP 모바일 앱의 **화면/네비게이션/데이터 요구사항**을 정의합니다.
>
> 구현 기준: `apps/mobile` (Expo React Native)

- 라우팅: **Expo Router** (파일 기반)
- 상태/데이터: **TanStack Query** (서버 상태)
- 폼: React Hook Form + Zod(권장)
- 스타일: **NativeWind** + 토큰(Plan 06)

---

## 0) 범위 (MVP)

### 포함
- 인증(로그인) + 역할 선택(최초 1회)
- 요청자
  - 예약(booking) 생성
  - 내 예약 목록/상세
  - 취소
- 제공자
  - 일감(대기 예약) 목록
  - 수락/거절
  - 진행/완료 처리
- 예약 기반 메시지(폴링)
- 리뷰 작성/조회
- 설정(로그아웃)

### 제외(Post‑MVP)
- 결제/정산
- 실시간 채팅(WebSocket)
- 푸시 알림(FCM/APNs)
- 지도/거리 기반 정렬
- 정기예약/반복 스케줄

### 용어(문서 정합)
- DB(02) 및 API(03) 기준 **예약 = booking**
- 과거 문서/대화에서 `reservation` 표기가 섞일 수 있으나, **모바일 구현에서는 booking으로 통일**

---

## 1) 네비게이션 원칙

### 1.1 Auth Gate (앱 진입 분기)
- 진입점: `app/index.tsx`
- 분기 기준: `session` + `user.role`

권장 분기:
- 세션 없음 → `(auth)/login`
- 세션 있음 + role 없음(또는 미설정) → `(auth)/role-select`
- role=customer → `(customer)`
- role=cleaner → `(cleaner)`

> 역할(role)은 서버의 `users.role`(Plan 02) 기반. role-select에서 서버에 반영 후 다음 실행부터는 자동 분기.

### 1.2 레이아웃 전략
- Root: QueryClientProvider / ThemeProvider / SessionProvider / Toast / ErrorBoundary
- 역할별 영역: **Tabs(허브) + Stack(상세/플로우)** 혼합
- 공통 화면: `(shared)`로 분리해 중복 최소화

### 1.3 딥링크/공유 규칙
- 공통 상세 화면은 URL param(bookingId 등) 기반으로 진입 가능하게 설계
- 외부 공유(링크 공유)는 Post‑MVP로 두되, 내부 라우팅은 동일한 형태로 유지

---

## 2) Expo Router 파일 구조 (권장)

> 실제 구현 기준: `apps/mobile/app/*`

```text
apps/mobile/app/
├── _layout.tsx
├── index.tsx                      # Auth Gate
├── +not-found.tsx
│
├── (auth)/
│   ├── _layout.tsx                # Stack
│   ├── login.tsx
│   └── role-select.tsx
│
├── (customer)/
│   ├── _layout.tsx                # Tabs
│   ├── (tabs)/
│   │   ├── index.tsx              # 홈
│   │   ├── bookings.tsx           # 내 예약 목록
│   │   └── profile.tsx            # 내 정보/설정 진입
│   └── request/                   # 예약 생성 Wizard (Stack)
│       ├── service.tsx
│       ├── datetime.tsx
│       ├── address.tsx
│       ├── details.tsx
│       └── confirm.tsx
│
├── (cleaner)/
│   ├── _layout.tsx                # Tabs
│   ├── (tabs)/
│   │   ├── index.tsx              # 일감(대기) 목록
│   │   ├── schedule.tsx           # 내 일정(확정/진행/완료)
│   │   └── profile.tsx            # 제공자 프로필
│   └── job/
│       └── [id].tsx               # 제공자 관점 상세(수락/상태 변경)
│
└── (shared)/
    ├── booking/
    │   └── [id].tsx               # 공통 예약 상세(읽기 중심)
    ├── chat/
    │   └── [bookingId].tsx        # 예약 기반 채팅방
    ├── reviews/
    │   ├── write.tsx              # 리뷰 작성
    │   └── cleaner/
    │       └── [cleanerId].tsx    # 청소부 리뷰 목록
    └── settings/
        └── index.tsx              # 설정(로그아웃)
```

> NOTE: API(03)의 리소스는 `/api/v1/bookings`로 정의되어 있으므로, 화면/컴포넌트 네이밍도 booking을 사용합니다.

---

## 3) 화면 목록 (요약)

### 3.1 인증/Auth
- Login
- Role Select

### 3.2 요청자(Customer)
- 홈
- 내 예약 목록
- 예약 생성 Wizard (서비스 → 일정 → 주소 → 요청사항 → 확인)
- (shared) 예약 상세
- (shared) 채팅
- 프로필/설정

### 3.3 제공자(Cleaner)
- 일감 목록(pending)
- 내 일정(confirmed/in_progress/completed)
- (cleaner) 예약 상세(수락/상태 변경)
- (shared) 채팅
- 프로필/설정

---

## 4) API 매핑 (Plan 03 기준)

모바일은 **API v1**을 기준으로 호출합니다.

- Booking
  - 생성: `POST /api/v1/bookings`
  - 목록: `GET /api/v1/bookings?status=...`
  - 상세: `GET /api/v1/bookings/:id`
  - 취소: `POST /api/v1/bookings/:id/cancel`
  - 수락/거절: `POST /api/v1/bookings/:id/accept`, `POST /api/v1/bookings/:id/reject`
  - 시작/완료: `POST /api/v1/bookings/:id/start`, `POST /api/v1/bookings/:id/complete`

- Messages
  - 목록: `GET /api/v1/bookings/:id/messages`
  - 전송: `POST /api/v1/bookings/:id/messages`

- Reviews
  - 작성: `POST /api/v1/bookings/:id/reviews`
  - 조회(청소부): `GET /api/v1/cleaners/:id/reviews`

- Auth/Me
  - 세션: `GET /api/auth/session`
  - 내 정보: `GET/PATCH /api/v1/me`

---

## 5) TanStack Query 설계

### 5.1 Query Key 규칙(권장)
- `['session']`
- `['me']`
- `['bookings', { scope: 'me', status, roleView }]`
- `['booking', bookingId]`
- `['messages', bookingId]`
- `['cleanerReviews', cleanerId]`

### 5.2 Invalidation 규칙(예)
- booking 상태 변경/취소/수락/완료 성공 시
  - invalidate: `['booking', id]`
  - invalidate: `['bookings']` (리스트 갱신)
- 메시지 전송 성공 시
  - optimistic update + invalidate: `['messages', bookingId]`

### 5.3 에러 표준 처리(권장)
- 401: 세션 만료 → 로그인으로
- 403: 권한 없음 → 토스트 + back
- 404: 리소스 없음 → NotFoundView
- 409(CONFLICT): 경합(수락 경쟁 등) → 토스트 + 관련 목록/상세 invalidate

---

## 6) 요청자(Customer) 상세 설계

### 6.1 홈 `(customer)/(tabs)/index`
**목적**
- “예약 만들기” 진입
- 최근 예약 1건 요약(있으면)

**데이터**
- `GET /api/v1/bookings?limit=1&status=pending|confirmed|in_progress` (서버 지원에 맞게)

**UI**
- Primary CTA: “청소 예약하기” → `(customer)/request/service`
- 최근 예약 카드 → `(shared)/booking/[id]`

**Empty State**
- “최근 예약이 없어요. 예약을 만들어볼까요?”

---

### 6.2 내 예약 목록 `(customer)/(tabs)/bookings`
**목적**
- 내 예약을 상태 필터로 탐색

**데이터**
- `GET /api/v1/bookings?status=...` (status optional)

**상태 필터(칩)**
- 전체 / 대기 / 확정 / 진행 / 완료 / 취소

**리스트 아이템(권장 필드)**
- 날짜/시간, 지역(동), 상태 배지, 서비스 요약(방 타입/평수/서비스)

**Empty State**
- “예약이 없어요. 지금 예약을 만들어볼까요?”

---

### 6.3 예약 생성 Wizard `(customer)/request/*`
**원칙**
- step별 입력은 로컬 상태(zustand 또는 context)에 저장
- confirm에서 단 1회 `POST /api/v1/bookings`
- 뒤로가기 시 입력 유지
- 서버 오류 시: 입력 유지 + 재시도 가능

#### Step 1: 서비스 `(customer)/request/service`
- 입력: `roomType`, `roomSize`, `services[]`, `durationHours`
- 검증(예):
  - `durationHours` 1~8
  - `roomSize` 양수

#### Step 2: 일정 `(customer)/request/datetime`
- 입력: `scheduledDate`, `scheduledTime`
- UX: 가능한 날짜/시간 제한은 MVP에선 최소(검증은 서버에서도 수행)

#### Step 3: 주소 `(customer)/request/address`
- 입력: `subAreaId`, `address`, `addressDetail`
- MVP: 주소 검색 없이 텍스트 입력(추후 카카오 주소 API 등 연결)

#### Step 4: 요청사항 `(customer)/request/details`
- 입력: `description`, `budget(optional)`

#### Step 5: 확인 `(customer)/request/confirm`
- 서버 호출: `POST /api/v1/bookings`
- 성공 시:
  - 생성된 `bookingId`로 `(shared)/booking/[id]` 이동
  - `['bookings']` invalidate

---

### 6.4 예약 상세(공통) `(shared)/booking/[id]`
**목적**
- 상태/일정/주소/요청사항 확인
- 상태별 CTA 제공(요청자/제공자에게 노출되는 버튼은 서버 권한 모델과 일치)

**데이터**
- `GET /api/v1/bookings/:id`

**CTA(요청자 관점)**
- `pending`: “취소” → `POST /api/v1/bookings/:id/cancel`
- `confirmed | in_progress`: “채팅하기” → `(shared)/chat/[bookingId]`
- `completed`: “리뷰 작성” → `(shared)/reviews/write?bookingId=...`

**표시(권장 섹션)**
- 예약 상태 타임라인(대기→확정→진행→완료/취소)
- 서비스/시간/지역/주소
- 요청사항
- 상대(청소부) 정보(확정 이후에만)

**권한/보안**
- 상세는 booking 참여자만 조회 가능(서버에서 강제)

---

### 6.5 프로필 `(customer)/(tabs)/profile` + 설정 `(shared)/settings/index`
- `GET/PATCH /api/v1/me`
- 설정: 로그아웃

---

## 7) 제공자(Cleaner) 상세 설계

### 7.1 일감 목록 `(cleaner)/(tabs)/index`
**목적**
- 대기(pending) 예약을 탐색하고 상세로 진입

**데이터**
- `GET /api/v1/bookings?status=pending` (서버에서 cleaner view 지원 시 추가)

**카드 표시**
- 지역(동), 날짜/시간, 예상 duration, roomType/roomSize, services

**CTA**
- 카드 탭 → `(cleaner)/job/[id]`

**Empty State**
- “대기 중인 일감이 없습니다.”

---

### 7.2 제공자 상세(수락/상태 변경) `(cleaner)/job/[id]`
**목적**
- 수락/거절 + 진행/완료 상태 변경

**데이터**
- `GET /api/v1/bookings/:id`

**CTA**
- `pending`:
  - “수락” → `POST /api/v1/bookings/:id/accept`
  - “거절” → `POST /api/v1/bookings/:id/reject` (사유 optional)
- `confirmed`:
  - “시작” → `POST /api/v1/bookings/:id/start`
  - “채팅” → `(shared)/chat/[bookingId]`
- `in_progress`:
  - “완료” → `POST /api/v1/bookings/:id/complete`

**경합 처리(중요)**
- 이미 다른 cleaner가 수락했다면 `409(CONFLICT)` 표준 처리:
  - 토스트: “이미 다른 제공자가 수락한 예약입니다.”
  - 목록/상세 invalidate 후 뒤로가기 유도

---

### 7.3 내 일정 `(cleaner)/(tabs)/schedule`
**목적**
- 확정/진행/완료 예약을 리스트 형태로 관리

**데이터**
- `GET /api/v1/bookings?status=confirmed|in_progress|completed`

**UI**
- 섹션: 오늘 / 예정 / 완료
- 카드 탭:
  - 읽기 중심은 `(shared)/booking/[id]`
  - 상태 변경이 필요하면 `(cleaner)/job/[id]`로 이동

---

### 7.4 제공자 프로필 `(cleaner)/(tabs)/profile`
- MVP는 최소(소개/가격 표시)로 시작
- `GET /api/v1/cleaners/me`, `PATCH /api/v1/cleaners/me` (Plan 03)

---

## 8) 채팅(Shared)

### 8.1 채팅방 `(shared)/chat/[bookingId]`
**MVP 방식**: 폴링

- 목록 조회: `GET /api/v1/bookings/:id/messages`
- 전송: `POST /api/v1/bookings/:id/messages`

**권장 UX**
- polling interval: 3~5초
- 앱 background 시 polling 중지(AppState 연동)
- 전송은 optimistic update
- 이미지 메시지는 Post‑MVP

**Empty State**
- “첫 메시지를 보내보세요.”

---

## 9) 리뷰(Shared)

### 9.1 리뷰 작성 `(shared)/reviews/write`
**진입 조건**
- booking 상태가 `completed`
- 아직 리뷰가 없을 때(서버에서 1:1 제약이면 중복 작성 차단)

**API**
- `POST /api/v1/bookings/:id/reviews`

**UI 요소**
- 별점(1~5)
- 코멘트
- 태그(선택) (Plan 02 `review_tag` 참고)

### 9.2 청소부 리뷰 목록 `(shared)/reviews/cleaner/[cleanerId]`
- `GET /api/v1/cleaners/:id/reviews`

---

## 10) 컴포넌트/폴더 구조(모바일 앱 내부)

```text
apps/mobile/
├── app/                       # expo-router routes
├── components/
│   ├── atoms/                 # Button, Input, Badge...
│   ├── molecules/             # FormField, RatingStars...
│   ├── organisms/             # BookingCard, MessageList...
│   └── layouts/               # ScreenLayout, KeyboardAvoidLayout...
├── features/
│   ├── auth/
│   ├── bookings/
│   ├── chat/
│   ├── reviews/
│   └── profile/
├── lib/
│   ├── api/                   # fetcher, typed client
│   ├── query/                 # query keys, hooks
│   ├── navigation/            # role routing helpers
│   └── constants/             # status label/color, service types...
└── store/                     # wizard state (zustand)
```

---

## 11) 상태(Status)별 UI 가이드

> DB enum(Plan 02): `pending | confirmed | in_progress | completed | cancelled`

- `pending`
  - Customer: “대기중”(취소 가능)
  - Cleaner: “수락/거절”
- `confirmed`
  - 양측: 일정/주소 확인, 채팅 가능
  - Cleaner: 시작 처리 가능
- `in_progress`
  - Cleaner: 완료 처리 가능
- `completed`
  - 양측: 리뷰 CTA(정책에 따라)
- `cancelled`
  - 취소자/사유/시각 표시

---

## 12) 접근성/디자인 품질(최소 기준)

- 터치 타겟 최소 44px
- 주요 버튼은 색상 + 텍스트로 상태를 중복 표현(색약 대응)
- 폼 에러는 필드 근처에 명시 + 스크린리더 읽힘
- 날짜/시간 표기는 로케일 `ko-KR` 기준

---

## 13) 구현 체크리스트

- [ ] `app/index.tsx` Auth Gate 구현(세션/role redirect)
- [ ] booking query/mutation hooks 작성(`useBookings`, `useBooking`, `useAcceptBooking`...)
- [ ] 예약 생성 wizard 상태 저장(zustand)
- [ ] status 라벨/색상/CTA 매핑 상수화
- [ ] 채팅 폴링 + optimistic send
- [ ] 리뷰 작성 조건(완료 후 1회) 서버/클라 동기화
