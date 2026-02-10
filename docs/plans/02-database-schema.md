# 02. DB 스키마 & 데이터 모델

PostgreSQL(Neon/Supabase) + Drizzle ORM 기반의 데이터 모델 설계 문서입니다.
실제 스키마 코드는 `apps/web/server/db/schema/` 에 구현되어 있으며, 본 문서는 “왜 이런 구조인가/어떻게 안전하게 쓰는가”에 초점을 둡니다.

- 대상: C2C 청소 예약(요청자/제공자), 예약 기반 메시지, 리뷰, 알림
- 설계 목표: **타입 안전성**, **정합성(제약/ENUM/관계)**, **MVP에 과하지 않은 확장성**
- 기준 스키마: `apps/web/server/db/schema/*.ts`
- 문서 버전: **v4 (2026-02-11)**

---

## 0) 기본 규칙 (Conventions)

### 0.1 ID
- 모든 PK는 `text`(UUID 문자열)
- 기본값: `$defaultFn(() => crypto.randomUUID())`
  - 장점: 앱 레벨에서 ID 선점 가능, Drizzle 타입 추론이 단순

### 0.2 Timestamp
- 대부분 테이블에 `created_at`, `updated_at`
- `updated_at` 자동 갱신 트리거는 MVP에서 미적용
  - 서버 액션(또는 DB 레이어)에서 업데이트 책임

### 0.3 Enum (DB enum 강제)
핵심 상태/타입은 PostgreSQL enum으로 강제하여 **상태 값의 오염**을 막습니다.

- `user_role`: `customer | cleaner`
- `booking_status`: `pending | confirmed | in_progress | completed | cancelled`
- `room_type`: `oneRoom | twoRoom | threeRoom | studio | office`
- `service_type`: `basic_cleaning | bathroom | kitchen | window | move_in | move_out`
- `message_type`: `text | image | system`
- `notification_type`:
  - `booking_created | booking_accepted | booking_rejected | booking_cancelled | booking_reminder | booking_completed | new_message | new_review`
- `review_tag`:
  - `친절해요 | 시간 준수 | 꼼꼼해요 | 깨끗해요 | 추천해요`

> 참고: 현재 `service_type`, `review_tag`는 enum이 **정의는 되어있지만**, 실제 컬럼(`services`, `tags`) 타입은 `text[]` 입니다.
> 따라서 DB 차원에서 배열 원소가 enum에 속하는지까지는 강제하지 못하고, **서버 액션에서 값 검증**을 합니다.

### 0.4 Soft delete
- MVP에서는 soft delete를 기본 채택하지 않음
  - 사유: 로직/인덱스/필터 복잡도 증가
  - 필요 시: `deleted_at` 컬럼 추가 + 조회 스코프 표준화로 확장

### 0.5 “배열 컬럼 vs 조인 테이블” 원칙
MVP에서 “선택 목록” 성격이고 **조회가 단순**한 항목은 `text[]`를 사용합니다.

- `bookings.services: text[]`
- `reviews.tags: text[]`

대신 아래 조건 중 하나를 만족하면 조인 테이블로 승격합니다.

- 항목 자체에 속성(수량/가격/정렬/메모)이 붙는다
- 항목별 집계/검색이 중요해진다(예: 특정 서비스가 포함된 예약만 필터)
- DB 차원에서 정합성 강제가 꼭 필요하다(enum membership, FK 등)

---

## 1) ERD (Entity Relationship Diagram)

> 현재 스키마 구조를 기준으로 작성했습니다.

```mermaid
erDiagram
    users ||--o| cleaner_profiles : "has (if role=cleaner)"
    cleaner_profiles ||--o{ available_times : "has"
    cleaner_profiles ||--o{ cleaner_service_areas : "covers"

    areas ||--o{ sub_areas : "has"
    sub_areas ||--o{ cleaner_service_areas : "covered by"

    users ||--o{ bookings : "customer"
    users ||--o{ bookings : "cleaner (nullable)"
    sub_areas ||--o{ bookings : "location"

    bookings ||--o{ messages : "contains"
    bookings ||--o| reviews : "has (1:1)"

    users ||--o{ messages : "sends"
    users ||--o{ reviews : "author"
    users ||--o{ reviews : "recipient"
    users ||--o{ notifications : "receives"

    users {
      text id PK
      text email UK
      text password "OAuth면 null"
      text name
      text phone
      enum user_role role
      text kakao_id UK
      text naver_id UK
      text profile_image
      bool is_active
      bool email_verified
      timestamp created_at
      timestamp updated_at
    }

    cleaner_profiles {
      text id PK
      text user_id FK UK
      text intro
      int price_per_hour
      int total_bookings
      int total_reviews
      numeric average_rating
      bool is_verified
      bool is_available
      timestamp created_at
      timestamp updated_at
    }

    areas {
      text id PK
      text name
      int sort_order
      timestamp created_at
    }

    sub_areas {
      text id PK
      text area_id FK
      text name
      int sort_order
      timestamp created_at
    }

    cleaner_service_areas {
      text id PK
      text profile_id FK
      text sub_area_id FK
      timestamp created_at
    }

    available_times {
      text id PK
      text profile_id FK
      smallint day_of_week
      time start_time
      time end_time
      timestamp created_at
      timestamp updated_at
    }

    bookings {
      text id PK
      text customer_id FK
      text cleaner_id FK "nullable"
      text sub_area_id FK
      enum booking_status status

      date scheduled_date
      time scheduled_time
      int duration

      text address
      text address_detail

      enum room_type room_type
      int room_size

      text[] services
      text description
      int budget

      text[] completion_photos
      text completion_notes
      timestamp completed_at

      text cancelled_by
      text cancel_reason
      timestamp cancelled_at

      timestamp created_at
      timestamp updated_at
    }

    messages {
      text id PK
      text booking_id FK
      text sender_id FK
      enum message_type type
      text content
      text image_url
      bool is_read
      timestamp read_at
      timestamp created_at
    }

    reviews {
      text id PK
      text booking_id FK UK
      text author_id FK
      text recipient_id FK
      smallint rating
      text content
      text[] tags
      bool can_edit
      timestamp created_at
      timestamp updated_at
    }

    notifications {
      text id PK
      text user_id FK
      enum notification_type type
      text title
      text body
      text related_type
      text related_id
      bool is_read
      timestamp read_at
      timestamp created_at
    }
```

---

## 2) 테이블 상세 (스키마 기준)

### 2.1 `users`
- 파일: `apps/web/server/db/schema/users.ts`
- 목적: 로그인 주체(요청자/제공자)를 단일 테이블로 통합

핵심 컬럼
- `email` (unique, not null): 기본 로그인 키
- `password` (nullable): OAuth 유저는 null
- `role` (`user_role`): `customer | cleaner`
- `kakao_id`, `naver_id` (unique, nullable): 소셜 연동
- `is_active`: 탈퇴/정지 등 상태
- `email_verified`: 이메일 검증 여부

설계 메모
- 고객/제공자를 분리 테이블로 두지 않고 role로 구분 → 예약/메시지/리뷰에서 FK가 단순해짐

---

### 2.2 `cleaner_profiles`
- 파일: `apps/web/server/db/schema/cleaner-profiles.ts`
- 목적: 제공자(청소부) 전용 확장 프로필

관계
- `user_id` → `users.id` (FK, `onDelete: cascade`)
- `user_id` unique (사실상 users:cleaner_profiles = 1:1)

핵심 컬럼
- `intro`: 소개
- `price_per_hour`: 시간당 가격(원)
- 통계(denormalized)
  - `total_bookings`, `total_reviews`, `average_rating`
- 상태
  - `is_verified`: 신원/자격 확인
  - `is_available`: 현재 수락 가능 여부(휴무/중단 토글)

운영 규칙(권장)
- 리뷰 생성/수정 시 `average_rating`, `total_reviews`를 트랜잭션으로 함께 갱신
- 예약 완료 처리 시 `total_bookings` 갱신

---

### 2.3 `areas`, `sub_areas`
- 파일: `apps/web/server/db/schema/areas.ts`
- 목적: 서비스 지역의 계층(예: 구/동)을 정규화

관계
- `sub_areas.area_id` → `areas.id` (FK, `onDelete: cascade`)

핵심 컬럼
- `name`: 표시 이름
- `sort_order`: UI 정렬용

---

### 2.4 `cleaner_service_areas`
- 파일: `apps/web/server/db/schema/cleaner-service-areas.ts`
- 목적: 제공자가 커버 가능한 하위 지역 매핑 (N:M)

관계
- `profile_id` → `cleaner_profiles.id` (FK, cascade)
- `sub_area_id` → `sub_areas.id` (FK, cascade)

제약/인덱스
- `unique(profile_id, sub_area_id)`
  - 동일 지역 중복 등록 방지

---

### 2.5 `available_times`
- 파일: `apps/web/server/db/schema/available-times.ts`
- 목적: 제공자의 요일별 가능 시간대(정기 스케줄)

핵심 컬럼
- `day_of_week` (0~6): 0=일요일
- `start_time`, `end_time`

정합성 규칙(현재: 앱 레벨)
- `start_time < end_time`
- 동일 `profile_id + day_of_week` 내 시간대 겹침 방지

확장 포인트
- 특정 날짜 예외(휴무/추가 가능)를 지원하려면 `availability_exceptions` 테이블 추가 권장

---

### 2.6 `bookings`
- 파일: `apps/web/server/db/schema/bookings.ts`
- 목적: 예약(요청) 단일 엔티티로 요청→수락→진행→완료/취소 상태 흐름을 표현

관계
- `customer_id` → `users.id` (FK, cascade)
- `cleaner_id` → `users.id` (FK, set null)
  - 수락 전에는 null
  - 제공자 계정 삭제 시 예약 레코드를 보존하고 싶어서 set null
- `sub_area_id` → `sub_areas.id` (FK)

상태
- `status` (`booking_status`)
  - `pending` (요청 등록)
  - `confirmed` (제공자 수락)
  - `in_progress`
  - `completed`
  - `cancelled`

일정
- `scheduled_date` + `scheduled_time` + `duration`
  - 시간대 충돌/중복 수락 방지는 MVP에서는 앱 레벨로 처리

주소/요청
- `address`, `address_detail`
- `room_type` (`room_type`)
- `services` (text[]) : 선택 서비스 목록
  - 값은 `service_type`의 value(`basic_cleaning` 등)를 사용하도록 **서버에서 검증**
- `budget` (optional)

완료/취소
- 완료: `completion_photos[]`, `completion_notes`, `completed_at`
- 취소: `cancelled_by`, `cancel_reason`, `cancelled_at`

인덱스(구현됨)
- `bookings_customer_status_idx (customer_id, status)`
- `bookings_cleaner_status_idx (cleaner_id, status)`
- `bookings_sub_area_date_idx (sub_area_id, scheduled_date)`
- `bookings_status_date_idx (status, scheduled_date)`

운영 규칙(권장)
- 상태 전이는 서버 액션에서만 수행(클라이언트 직접 업데이트 금지)
- `confirmed` 전환 시점에 `cleaner_id`를 반드시 세팅
- `completed` 전환 시점에 `completed_at` 필수
- `cancelled` 전환 시점에 `cancelled_at`, `cancelled_by` 필수

---

### 2.7 `messages`
- 파일: `apps/web/server/db/schema/messages.ts`
- 목적: 예약 기반 메시지(채팅) MVP 저장소

관계
- `booking_id` → `bookings.id` (FK, cascade)
- `sender_id` → `users.id` (FK, cascade)

핵심 컬럼
- `type` (`message_type`): `text | image | system`
- `content`: 본문(시스템 메시지도 포함)
- `image_url`: 이미지 메시지일 때 사용
- `is_read`, `read_at`: 단순 읽음 처리

인덱스
- `messages_booking_created_idx (booking_id, created_at)`
  - 대화 로딩(최신순/페이징)에 필요

확장 포인트
- 1:1 채팅방을 독립 엔티티로 두려면 `conversations` 추가 + `booking_id`는 optional로 분리

---

### 2.8 `reviews`
- 파일: `apps/web/server/db/schema/reviews.ts`
- 목적: 청소 완료 후 리뷰(별점 + 내용 + 태그)

관계/제약
- `booking_id` unique
  - 현재 구현은 예약당 리뷰 1개 모델
  - “상호 리뷰(고객↔제공자)”가 필요하면 아래 중 하나로 변경 권장
    1) `unique(booking_id, author_id)`로 바꾸고 한 예약당 2개 허용
    2) `review_threads`(예약당 1개) + `review_entries`(2개)로 분리

핵심 컬럼
- `author_id` → 작성자
- `recipient_id` → 대상자
- `rating` (1~5)
- `tags` (text[]) : `review_tag` 값 사용을 서버에서 검증
- `can_edit`: 24시간 내 수정 가능 등 정책용 플래그

인덱스
- `reviews_author_idx (author_id)`
- `reviews_recipient_created_idx (recipient_id, created_at)`

---

### 2.9 `notifications`
- 파일: `apps/web/server/db/schema/notifications.ts`
- 목적: 인앱 알림/푸시 알림 원천 데이터

관계
- `user_id` → `users.id` (FK, cascade)

핵심 컬럼
- `type` (`notification_type`)
- `title`, `body`
- `related_type`, `related_id`: 딥링크/탭 이동에 사용
- `is_read`, `read_at`

인덱스
- `notifications_user_read_idx (user_id, is_read)`
- `notifications_user_created_idx (user_id, created_at)`

---

## 3) 조회 패턴 & 인덱싱 가이드

### 자주 하는 쿼리
- 고객: “내 예약 목록 (status별)”
  - 인덱스: `(customer_id, status)`
- 제공자: “내가 수락한/진행중인 예약”
  - 인덱스: `(cleaner_id, status)`
- 지역/날짜 기반 탐색(제공자 탐색/추천)
  - 인덱스: `(sub_area_id, scheduled_date)`
- 메시지 로딩
  - 인덱스: `(booking_id, created_at)`
- 알림 리스트
  - 인덱스: `(user_id, created_at)`

### 향후 필요할 수 있는 인덱스(옵션)
- 예약 중복 방지/캘린더 뷰를 강화하면
  - `(cleaner_id, scheduled_date, scheduled_time)`

---

## 4) 데이터 정합성 체크리스트 (서버 액션에서 강제)

DB 제약만으로 부족한 부분은 서버 액션에서 **반드시 검증/거절**합니다.

- `users.role = cleaner` 인 경우에만 `cleaner_profiles` 생성 허용
- `bookings.status = confirmed` 이면 `cleaner_id` not null로 강제
- `bookings.status = completed` 이면 `completed_at` 세팅
- `bookings.status = cancelled` 이면 `cancelled_at`, `cancelled_by` 세팅
- `available_times` 시간대 겹침 방지
- `bookings.services[]` 값은 `service_type` 값만 허용
- `reviews.tags[]` 값은 `review_tag` 값만 허용

---

## 5) 예약 상태 전이(State machine) 가이드

MVP에서 예약 상태는 단순하지만, **상태 전이 규칙을 코드에서 하나로 모아두는 것**이 중요합니다.

권장 전이
- `pending` → `confirmed` (제공자 수락)
- `pending` → `cancelled` (요청자 취소)
- `confirmed` → `in_progress` (작업 시작)
- `confirmed` → `cancelled` (요청자/제공자 취소)
- `in_progress` → `completed` (완료)
- `in_progress` → `cancelled` (긴급 취소)

금지/주의 전이(권장)
- `completed` → 다른 상태로 변경 금지(불변)
- `cancelled` → 다른 상태로 변경 금지(불변)

상태별 필수 필드
- `confirmed`: `cleaner_id` 필수
- `completed`: `completed_at` 필수
- `cancelled`: `cancelled_at`, `cancelled_by` 필수

> 향후 “거절(rejected)”이 필요하면 `booking_status`에 `rejected`를 추가하고,
> `pending` → `rejected` 전이 + 거절 사유(`reject_reason`)를 고려합니다.

---

## 6) DB 레벨 제약을 더 강하게 하고 싶다면 (Post-MVP 권장)

현재는 MVP 속도를 위해 많은 규칙을 앱 레벨에서 보장합니다. 운영이 시작되면 아래 제약을 **DB 레벨로 승격**하는 것을 권장합니다.

### 6.1 Check constraints (예시)
- `available_times.start_time < available_times.end_time`
- `reviews.rating BETWEEN 1 AND 5`
- `bookings.duration > 0`

### 6.2 시간대 겹침 방지 (고급)
제공자 스케줄/예약 충돌을 DB에서 막으려면 `tsrange` + `EXCLUDE USING gist`를 고려합니다.

- 예: 예약 확정 이후(`confirmed` 이상) 시간대 충돌 금지
- 단, 구현 난이도/마이그레이션 비용이 있으니 Post-MVP로 미루는 편이 안전

---

## 7) 보안/접근 제어(권장 패턴)

### 7.1 기본 원칙
- “예약에 참여한 사용자만 예약/메시지/리뷰를 볼 수 있다”를 최상위 규칙으로 둡니다.

### 7.2 Supabase를 쓸 경우(RLS)
Supabase를 사용한다면, 아래와 같은 방향으로 RLS를 설계할 수 있습니다.

- `bookings`: `auth.uid()`가 `customer_id` 또는 `cleaner_id`인 row만 select/update
- `messages`: message의 `booking_id`가 위 조건을 만족하는 booking에 속할 때만 select/insert
- `reviews`: 작성자는 `author_id = auth.uid()`일 때 insert, 조회는 booking 참여자만 허용

> 현재 코드는 TanStack Start 서버를 통한 접근을 가정합니다. RLS는 “추가 안전장치”로 보는 것이 좋습니다.

---

## 8) 마이그레이션/운영

- 스키마 위치: `apps/web/server/db/schema/`
- Drizzle kit

```bash
# 변경 감지 → 마이그레이션 생성
pnpm drizzle-kit generate

# 마이그레이션 실행
pnpm drizzle-kit migrate

# 개발용 push
pnpm drizzle-kit push
```

권장 운영 규칙
- 마이그레이션은 CI에서 적용되도록 하고, 운영 DB에 로컬에서 수동 `push`는 지양
- seed 데이터(areas/sub_areas)는 별도의 `seed` 스크립트로 관리

---

## 9) Post-MVP 확장(후보)

- 결제/정산
  - `payments`, `payouts`, `refunds`
- 정기 예약
  - `recurring_bookings`, `booking_instances`
- 제공자 검색/추천
  - `cleaner_profile_stats_daily`, `search_index`
- 첨부파일(사진) 정규화
  - `booking_assets`, `message_assets`
- 감사/추적 로그
  - `audit_logs` (중요 상태 전이/정산/권한 변경 이력)
