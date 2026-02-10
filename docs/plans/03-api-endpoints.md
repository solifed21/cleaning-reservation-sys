# 03. API 엔드포인트 설계

청소 예약 시스템의 **서버 API(모바일/웹 공용)** 엔드포인트를 정의합니다.

- Backend는 **TanStack Start(서버 라우트/서버 액션)** 를 사용합니다.
- DB는 **PostgreSQL + Drizzle ORM** (문서 02 참고)
- Auth는 PRD에서 명시한 **Better Auth(OAuth: 카카오/네이버 + 세션/JWT)** 를 전제로 합니다.

> 이 문서는 “REST 스타일”로 정리하지만, 실제 구현은 TanStack Start의 `route handlers` 혹은 `server functions/actions`로 매핑됩니다.

---

## 1) 공통 규칙

### Base URL / 버전
- **Base URL:** `/api`
- **Versioning:** `/api/v1` (향후 breaking change 대비)

예) `/api/v1/bookings`, `/api/v1/bookings/:id/messages`

### 인증
- 기본은 **로그인 세션(쿠키)** 또는 **Bearer 토큰** 둘 다 지원 가능
- 문서 표기:
  - `Auth: Public` (인증 불필요)
  - `Auth: User` (로그인 필요)
  - `Auth: Cleaner` (role=cleaner)
  - `Auth: Admin` (관리자)

> Better Auth의 실제 세션 방식(쿠키/토큰)은 구현 선택에 따라 달라질 수 있으나, 클라이언트는 “로그인 상태”만 일관되게 취급하면 됩니다.

### 표준 응답 포맷
성공 응답은 기본적으로 JSON.

```json
{
  "data": {"...": "..."},
  "meta": {"requestId": "req_..."}
}
```

에러 응답:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "scheduledDate is required",
    "details": {"field": "scheduledDate"}
  },
  "meta": {"requestId": "req_..."}
}
```

### 페이지네이션 / 정렬 / 필터
- List API는 기본적으로 `limit` + `cursor`(또는 `offset`)를 지원
- 최소 스펙(MVP): `limit`, `cursor`

예)
- `GET /api/v1/bookings?limit=20&cursor=eyJ...`
- `GET /api/v1/cleaners?subAreaId=...&sort=rating_desc`

### 권한(RBAC) 원칙
- **Customer**: 본인이 생성한 booking만 조회/수정/취소 가능
- **Cleaner**: 본인이 수락한 booking만 상태 변경/완료 처리 가능
- **Admin**: 전체 조회/변경 가능

---

## 2) Auth (Better Auth)

Better Auth는 통상적으로 `/api/auth/*` 경로를 사용합니다(프레임워크 어댑터에 따라 상이).
여기서는 클라이언트 관점의 “논리 엔드포인트”를 정의합니다.

| Method | Endpoint | 설명 | Auth |
|---|---|---|---|
| GET | `/api/auth/session` | 현재 세션 조회 | User (세션 없으면 null) |
| POST | `/api/auth/sign-in` | 이메일/비번 또는 OAuth 시작 | Public |
| POST | `/api/auth/sign-out` | 로그아웃 | User |
| POST | `/api/auth/callback/:provider` | OAuth 콜백 처리 | Public |

> 구현 시 실제 provider 키는 `kakao`, `naver` 등으로 정의.

---

## 3) 사용자/프로필

### 3.1 내 프로필
| Method | Endpoint | 설명 | Auth |
|---|---|---|---|
| GET | `/api/v1/me` | 내 기본 사용자 정보 | User |
| PATCH | `/api/v1/me` | 내 정보 수정(이름/전화 등) | User |

**PATCH /api/v1/me (예시)**
```json
{
  "name": "홍길동",
  "phone": "010-1234-5678",
  "profileImage": "https://..."
}
```

### 3.2 Cleaner 프로필
| Method | Endpoint | 설명 | Auth |
|---|---|---|---|
| GET | `/api/v1/cleaners/:id` | 청소부 프로필 상세(공개) | Public |
| PATCH | `/api/v1/cleaners/me` | 내 청소부 프로필 수정 | Cleaner |
| GET | `/api/v1/cleaners/me` | 내 청소부 프로필 조회 | Cleaner |

---

## 4) 지역(areas/sub_areas)

모바일에서 지역 선택/필터를 위해 공개 조회 API 제공.

| Method | Endpoint | 설명 | Auth |
|---|---|---|---|
| GET | `/api/v1/areas` | 상위 지역 목록(의창구/성산구 등) | Public |
| GET | `/api/v1/areas/:areaId/sub-areas` | 하위 지역 목록(동) | Public |

---

## 5) 청소부 탐색(검색)

요청자가 예약 전에 청소부를 탐색하는 기능.

| Method | Endpoint | 설명 | Auth |
|---|---|---|---|
| GET | `/api/v1/cleaners` | 청소부 목록(필터/정렬) | Public |

**Query Params(예시)**
- `subAreaId` (필수에 가깝게 권장)
- `minRating` (optional)
- `maxPricePerHour` (optional)
- `sort`: `rating_desc | price_asc | bookings_desc`

---

## 6) 예약(Bookings)

DB 스키마의 `bookings` 테이블을 기준으로 합니다.

### 6.1 예약 생성(요청자)
| Method | Endpoint | 설명 | Auth |
|---|---|---|---|
| POST | `/api/v1/bookings` | 청소 요청(예약) 생성 | User (Customer) |

**POST /api/v1/bookings (Request)**
```json
{
  "subAreaId": "sub_...",
  "scheduledDate": "2026-02-20",
  "scheduledTime": "10:00:00",
  "duration": 2,
  "address": "경남 창원시 ...",
  "addressDetail": "101동 1001호",
  "roomType": "oneRoom",
  "services": ["basic_cleaning", "bathroom"],
  "roomSize": 8,
  "description": "반려묘 1마리 있어요",
  "budget": 50000
}
```

**Response (예시)**
```json
{
  "data": {
    "id": "booking_...",
    "status": "pending",
    "createdAt": "2026-02-11T00:30:00.000Z"
  }
}
```

### 6.2 예약 목록/상세
| Method | Endpoint | 설명 | Auth |
|---|---|---|---|
| GET | `/api/v1/bookings` | 내 예약 목록(요청자/청소부 모두) | User |
| GET | `/api/v1/bookings/:id` | 예약 상세 | User (본인/상대방/Admin) |

**GET /api/v1/bookings Query Params**
- `roleView`: `customer | cleaner` (선택; 서버가 세션 role로 추론 가능)
- `status`: `pending|confirmed|in_progress|completed|cancelled` (optional)
- `from`, `to` (날짜 필터 optional)

### 6.3 예약 수정(요청자)
| Method | Endpoint | 설명 | Auth |
|---|---|---|---|
| PATCH | `/api/v1/bookings/:id` | 예약 정보 수정(일정/주소/요청사항) | User (Customer, 본인) |

> 상태가 `pending`일 때만 수정 허용(MVP 권장). `confirmed` 이후 변경은 별도 “변경 요청” 프로세스로 확장.

### 6.4 예약 취소
| Method | Endpoint | 설명 | Auth |
|---|---|---|---|
| POST | `/api/v1/bookings/:id/cancel` | 예약 취소(soft cancel) | User (Customer/Cleaner 본인) |

**POST /api/v1/bookings/:id/cancel (Request)**
```json
{
  "reason": "개인 사정으로 일정 변경이 필요합니다"
}
```

> DB에는 `status=cancelled`, `cancelledBy`, `cancelReason`, `cancelledAt` 등을 기록.

---

## 7) 예약 수락/상태 변경(청소부)

예약 상태 머신(권장):
- `pending` → `confirmed` → `in_progress` → `completed`
- 언제든 취소되면 `cancelled`

### 7.1 청소부가 예약 수락/거절
| Method | Endpoint | 설명 | Auth |
|---|---|---|---|
| POST | `/api/v1/bookings/:id/accept` | 예약 수락(청소부 지정, confirmed) | Cleaner |
| POST | `/api/v1/bookings/:id/reject` | 예약 거절(사유 optional) | Cleaner |

**POST /accept (예시 Response)**
```json
{
  "data": {
    "id": "booking_...",
    "status": "confirmed",
    "cleanerId": "user_..."
  }
}
```

> MVP에서는 “첫 수락자 확정” 방식. 동시 수락 경쟁을 막기 위해 트랜잭션/조건 업데이트(예: `WHERE status='pending' AND cleaner_id IS NULL`)로 보호.

### 7.2 진행/완료 처리
| Method | Endpoint | 설명 | Auth |
|---|---|---|---|
| POST | `/api/v1/bookings/:id/start` | 청소 시작 처리(in_progress) | Cleaner |
| POST | `/api/v1/bookings/:id/complete` | 청소 완료 처리(completed) | Cleaner |

**POST /complete (Request)**
```json
{
  "completionPhotos": ["https://.../1.jpg"],
  "completionNotes": "화장실 곰팡이 제거 완료"
}
```

---

## 8) 메시지(Messages) — 예약 기반

MVP는 “예약 상세 화면에서 메시지 내역 조회 + 메시지 전송”의 폴링 방식.

| Method | Endpoint | 설명 | Auth |
|---|---|---|---|
| GET | `/api/v1/bookings/:id/messages` | 메시지 목록(폴링) | User (booking 참여자) |
| POST | `/api/v1/bookings/:id/messages` | 메시지 전송 | User (booking 참여자) |

**GET Query Params**
- `after` (optional): 특정 message id/시간 이후만 가져오기
- `limit` (optional)

---

## 9) 리뷰(Reviews)

상호 리뷰(고객→청소부, 청소부→고객) 모두 가능하게 설계하되,
MVP에서는 우선 “고객이 청소부에게 남기는 리뷰”부터 시작해도 됩니다.

| Method | Endpoint | 설명 | Auth |
|---|---|---|---|
| POST | `/api/v1/bookings/:id/reviews` | 해당 booking에 대한 리뷰 작성 | User (booking 참여자) |
| GET | `/api/v1/cleaners/:id/reviews` | 청소부 리뷰 목록(공개) | Public |
| PATCH | `/api/v1/reviews/:id` | 리뷰 수정(작성자만) | User |

**POST /bookings/:id/reviews (Request)**
```json
{
  "rating": 5,
  "comment": "시간 약속 정확하고 꼼꼼했어요",
  "photos": []
}
```

---

## 10) 알림(Notifications)

초기에는 DB 저장 + 클라이언트 폴링.
푸시 알림(FCM/APNs)은 Post-MVP.

| Method | Endpoint | 설명 | Auth |
|---|---|---|---|
| GET | `/api/v1/notifications` | 내 알림 목록 | User |
| POST | `/api/v1/notifications/read` | 다건 읽음 처리 | User |

---

## 11) 관리자(Admin)

웹 대시보드에서 사용.

| Method | Endpoint | 설명 | Auth |
|---|---|---|---|
| GET | `/api/v1/admin/stats` | 예약/유저/리뷰 통계 | Admin |
| GET | `/api/v1/admin/bookings` | 전체 예약 검색/필터 | Admin |
| PATCH | `/api/v1/admin/bookings/:id` | 예약 강제 수정/취소 | Admin |
| GET | `/api/v1/admin/users` | 사용자 목록/검색 | Admin |
| PATCH | `/api/v1/admin/users/:id` | 계정 활성/비활성 등 | Admin |

---

## 12) 에러 코드(권장)

| code | 상황 |
|---|---|
| `UNAUTHORIZED` | 로그인 필요 |
| `FORBIDDEN` | 권한 없음 |
| `NOT_FOUND` | 리소스 없음 |
| `VALIDATION_ERROR` | 입력 검증 실패(Zod 등) |
| `CONFLICT` | 상태 충돌(동시 수락 등) |
| `RATE_LIMITED` | 과도한 요청 |

---

## 13) 구현 매핑(권장 폴더)

TanStack Start 기준 예시:

- Route handlers: `apps/web/app/routes/api/v1/**` (프로젝트 구조에 맞게)
- Zod validators: `packages/shared/validators/**`
- Response helpers: `packages/shared/utils/http.ts`

---

## 14) 범위 밖(후속)

- 결제(PG 연동) API
- 푸시 알림 디바이스 토큰/구독 API
- 정기 예약(Recurring)
- 실시간 채팅(WebSocket)
