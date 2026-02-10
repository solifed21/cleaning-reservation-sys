# 04. 모바일 앱 화면 설계 (Mobile Screens)

> 목표: **Expo + Expo Router** 기반으로, 요청자(Customer) / 제공자(Cleaner) 2개 역할을 지원하는 MVP 모바일 앱의 화면, 네비게이션, 화면별 데이터 요구사항을 정의한다.

- 앱: `apps/mobile` (Expo React Native)
- 라우팅: **Expo Router** (파일 기반)
- 상태/데이터: **TanStack Query** (서버 상태), Zod(폼 검증)
- 스타일: **NativeWind** + 공통 토큰(Plan 06)

---

## 1) 역할 & 전제

### 역할
- **Customer(요청자)**: 청소 예약 생성/조회, 메시지, 리뷰 작성
- **Cleaner(제공자)**: 수락 가능한 요청 탐색, 수락/거절, 일정 관리, 완료 처리, 메시지, 리뷰

### MVP 범위(모바일)
- 인증/온보딩
- 예약 생성/상태 조회
- 제공자: 요청 수락/일정
- 예약 기반 메시지(폴링)
- 리뷰(상호)

> 결제/실시간 채팅/푸시알림은 Post-MVP로 분리(placeholder UI만 고려).

---

## 2) 네비게이션 구조

### 전역 원칙
- **(auth)**, **(customer)**, **(cleaner)** 라우트 그룹 분리
- 로그인 후 `users.role` 또는 `profiles` 존재 여부로 **역할별 탭 진입점**을 다르게 라우팅
- 예약 상세/프로필 편집 등은 탭 위에 **stack push**

### 권장 라우트 트리(초안)

```txt
app/
  _layout.tsx
  (auth)/
    login.tsx
    role-select.tsx
    profile-setup.tsx
  (customer)/
    _layout.tsx              # customer tabs
    home.tsx
    bookings.tsx
    profile.tsx
    booking/
      new.tsx
      [bookingId].tsx
      [bookingId].chat.tsx
      [bookingId].review.tsx
  (cleaner)/
    _layout.tsx              # cleaner tabs
    dashboard.tsx
    requests.tsx
    schedule.tsx
    messages.tsx
    profile.tsx
    booking/
      [bookingId].tsx
      [bookingId].chat.tsx
      [bookingId].complete.tsx
      [bookingId].review.tsx
  (shared)/
    settings.tsx
    terms.tsx
    privacy.tsx
    not-found.tsx
```

### 탭 구성(MVP)

**Customer Tabs**
- 홈(Home)
- 예약(Bookings)
- 마이(Profile)

**Cleaner Tabs**
- 대시보드(Dashboard)
- 요청(Requests)
- 일정(Schedule)
- 메시지(Messages)
- 프로필(Profile)

---

## 3) 공통 UI 컴포넌트(권장)

- `AppHeader`: 타이틀 + 뒤로가기 + 액션(필터/저장 등)
- `PrimaryButton`, `SecondaryButton`, `TextButton`
- `Card`: 예약/요청/메시지 프리뷰
- `StatusBadge`: `WAITING|CONFIRMED|COMPLETED|CANCELED`
- `EmptyState`: 빈 목록 안내
- `BottomSheet` 또는 `Modal`: 날짜/시간 선택, 필터, 확인 다이얼로그
- `FormField`: label + input + error

---

## 4) 화면 정의 (Auth / Onboarding)

### A1. 로그인 (Login)
- 목적: OAuth/소셜 로그인 진입
- 주요 액션: 카카오/네이버/Apple(옵션)
- 성공 후 분기:
  - role 미설정 → A2 역할 선택
  - role 설정됨 → 해당 역할 탭 루트

### A2. 역할 선택 (Role Select)
- 목적: 신규 유저의 역할 선택(Customer/Cleaner)
- 데이터: `PATCH /me` 또는 `POST /profiles` 계열(Plan 03)
- UX: 역할 변경은 마이페이지에서 가능(단, Cleaner 프로필 필수 정보 있으면 유지)

### A3. 프로필 초기 설정 (Profile Setup)
- Customer: 연락처, 기본 주소(선택), 알림 동의
- Cleaner: 닉네임/소개, 서비스 지역, 기본 단가/옵션(정책 확정 전까지 placeholder)

---

## 5) 화면 정의 (Customer)

### C1. 홈 (Home)
- 목적: 현재 예약 요약 + 빠른 예약 생성
- 구성:
  - 진행 중 예약(가장 최근의 `WAITING/CONFIRMED`) 카드
  - CTA: “새 청소 요청하기”
  - (옵션) 최근 이용한 Cleaner 목록
- API(예):
  - `GET /bookings?role=customer&status=WAITING,CONFIRMED&limit=1`

### C2. 예약 생성 (Create Booking) — `booking/new`
- 목적: 단계형 예약 폼
- 단계(권장):
  1) 서비스 지역 선택(행정동/서브지역)
  2) 날짜 선택(캘린더)
  3) 시간 선택(슬롯)
  4) 주소/연락처/요청사항
  5) 요약 확인 → 제출
- 입력 필드(초안):
  - `subAreaId` (필수)
  - `scheduledAt` (필수)
  - `addressLine1/2`, `buildingType`(옵션)
  - `pets: boolean`, `note: string`(옵션)
- 검증:
  - 과거 시간 선택 불가
  - 최소 리드타임(예: 2시간) 정책은 서버/클라이언트 모두에서 방어
- API:
  - `POST /bookings`

### C3. 내 예약 목록 (My Bookings) — `bookings`
- 목적: 예약 이력/상태별 탐색
- UI:
  - 상단 탭/필터: `WAITING | CONFIRMED | COMPLETED | CANCELED`
  - 리스트 아이템: 날짜/시간, 지역, 상태, (확정 시) Cleaner 요약
- API:
  - `GET /bookings?role=customer&status=...&cursor=...`

### C4. 예약 상세 (Booking Detail) — `booking/[bookingId]`
- 목적: 예약 단건 정보 + 상태에 따른 액션
- 표시:
  - 예약 정보(일시/주소/요청사항)
  - 상태 타임라인(요청→확정→완료/취소)
  - Cleaner 배정 시: Cleaner 프로필 요약
- 액션(상태별):
  - `WAITING`: 취소(고객)
  - `CONFIRMED`: 메시지 이동, 취소(정책에 따라)
  - `COMPLETED`: 리뷰 작성
- API:
  - `GET /bookings/:id`
  - `POST /bookings/:id/cancel`

### C5. 채팅 (Booking Chat) — `booking/[bookingId].chat`
- 목적: 예약 기반 1:1 메시지
- MVP 구현:
  - 폴링(예: 3~5초) 또는 화면 포커스 시 refetch
  - 메시지 전송 optimistic update
- API:
  - `GET /bookings/:id/messages?cursor=...`
  - `POST /bookings/:id/messages`

### C6. 리뷰 작성 (Write Review) — `booking/[bookingId].review`
- 목적: 완료된 예약에 대해 Cleaner 리뷰 작성
- 입력:
  - 별점(1~5)
  - 텍스트(옵션)
- API:
  - `POST /bookings/:id/reviews` 또는 `POST /reviews`

### C7. 마이페이지 (Profile)
- 목적: 내 정보/설정
- 섹션:
  - 내 정보(연락처, 기본 주소)
  - 설정(알림, 약관, 로그아웃)
  - 역할 변경(가능하다면) / Cleaner 전환 진입

---

## 6) 화면 정의 (Cleaner)

### P1. 대시보드 (Dashboard)
- 목적: 오늘 일정 요약 + 대기 요청 알림
- 구성:
  - 오늘 일정 리스트(시간순)
  - 수락 대기 요청 수(배지)
  - (옵션) 이번 달 수익 요약(후순위)
- API:
  - `GET /bookings?role=cleaner&status=CONFIRMED&from=today&to=today`
  - `GET /requests?status=WAITING&serviceArea=...` (또는 bookings waiting)

### P2. 요청 목록 (Find Requests) — `requests`
- 목적: 수락 가능한 요청 탐색
- UI:
  - 필터: 지역, 날짜, 거리(옵션), 정렬(시간순/거리순)
  - 카드: 지역/일시/요청사항 요약
- 액션:
  - 상세 진입 → 수락
- API:
  - `GET /bookings?role=cleaner&status=WAITING&subAreaId=...`
  - `POST /bookings/:id/accept`

### P3. 예약 상세 (Cleaner Booking Detail) — `booking/[bookingId]`
- 목적: 고객 정보/요청 사항 확인 및 작업 진행
- 액션(상태별):
  - `WAITING`: 수락/거절
  - `CONFIRMED`: 메시지 이동, 완료 처리 진입
  - `COMPLETED`: 리뷰 작성(고객 평가)
- 주의:
  - 고객 연락처 노출 정책 필요(최소한 채팅으로 대체)

### P4. 일정 관리 (Schedule) — `schedule`
- 목적: 주간/월간 일정 보기 + 가능 시간 설정
- MVP:
  - 확정된 예약 캘린더 뷰
  - 가능 시간대 설정 UI는 최소 입력(예: 요일별 on/off + 시간범위)
- API:
  - `GET /bookings?role=cleaner&status=CONFIRMED&range=...`
  - `GET /available-times` / `POST /available-times`

### P5. 메시지 함 (Messages)
- 목적: 예약별 대화 목록
- UI:
  - 예약 카드 + 마지막 메시지 + 읽지 않음 표시
- API:
  - `GET /conversations` (없으면 `GET /bookings?withLastMessage=true` 형태로 대체)

### P6. 채팅 (Booking Chat)
- Customer의 C5와 동일(공유 컴포넌트화 권장)

### P7. 완료 처리 (Complete Booking) — `booking/[bookingId].complete`
- 목적: 작업 완료 체크리스트 + 완료 확정
- MVP 체크(예):
  - 쓰레기 처리, 욕실, 주방, 바닥 등(옵션)
  - 사진 업로드는 Post-MVP(placeholder)
- API:
  - `POST /bookings/:id/complete`

### P8. 리뷰 작성/평가 (Review)
- 목적: 고객에 대한 매너 평가/메모
- API:
  - `POST /bookings/:id/reviews` 또는 `POST /reviews`

### P9. 프로필 (Cleaner Profile)
- 목적: 제공자 프로필/서비스 지역/소개 관리
- 구성:
  - 소개/경력(텍스트)
  - 서비스 지역(서브지역)
  - (옵션) 가격/옵션
- API:
  - `GET /me/cleaner-profile`
  - `PATCH /me/cleaner-profile`

---

## 7) 상태(Booking Status)별 UI 가이드

- `WAITING`
  - Customer: “취소”, “대기 안내(매니저 수락 중)”
  - Cleaner: “수락/거절”
- `CONFIRMED`
  - 양측: “메시지”, 일정/주소 확인
  - Customer 취소 정책(시간 제한) 필요
- `COMPLETED`
  - 양측: 리뷰 CTA
- `CANCELED`
  - 취소 사유 표시(있다면)

---

## 8) 에러/로딩/엣지케이스

- 네트워크 실패: 재시도 버튼 + “마지막 업데이트 시각” 표시
- 중복 제출: 예약 생성/수락/완료는 버튼 disable + server idempotency(가능하면)
- 권한:
  - 위치 권한은 MVP에서 필수 아님(거리 정렬을 위해 옵션)
  - 알림 권한은 온보딩에서 선택(거부해도 사용 가능)
- 데이터 불일치:
  - 이미 다른 Cleaner가 수락한 경우 → 수락 실패 토스트 + 목록 갱신

---

## 9) 분석 이벤트(선택)

- `signup_complete(role)`
- `booking_create_start / booking_create_submit`
- `booking_accept`
- `message_send`
- `review_submit`

---

## 10) 체크리스트 (Plan 완료 기준)

- [x] 역할별 탭/스택 네비게이션 정의
- [x] Customer 핵심 화면 정의(생성/목록/상세/채팅/리뷰)
- [x] Cleaner 핵심 화면 정의(요청/수락/일정/완료/채팅/리뷰)
- [x] 라우트 트리 초안 제시
- [ ] 실제 `apps/mobile/app/`에 스캐폴딩 생성(구현 단계)
