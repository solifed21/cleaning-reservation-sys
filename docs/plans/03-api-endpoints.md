# 03. API 엔드포인트 설계

이 문서는 청소 예약 시스템의 REST API 엔드포인트를 정의합니다.
Supabase를 백엔드로 사용하므로, 클라이언트에서 직접 호출하거나 Edge Functions를 통해 호출될 API 구조를 설계합니다.

## 1. 개요

*   **Base URL:** (Supabase Project URL) `/rest/v1` 또는 `/functions/v1`
*   **Authentication:** Bearer Token (JWT) via Supabase Auth
*   **Format:** JSON

## 2. 인증 (Auth) - Supabase Auth 내장

Supabase GoTrue API를 직접 사용합니다. 클라이언트 SDK를 통해 처리되지만, 논리적인 엔드포인트는 다음과 같습니다.

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| POST | `/auth/v1/signup` | 회원가입 (이메일/비밀번호) | No |
| POST | `/auth/v1/token` | 로그인 (Access Token 발급) | No |
| POST | `/auth/v1/logout` | 로그아웃 | Yes |
| GET | `/auth/v1/user` | 현재 사용자 정보 조회 | Yes |

## 3. 사용자 (Users) - `public.profiles`

사용자 추가 정보 및 관리 기능을 제공합니다.

| Method | Endpoint | Description | Auth Required | Role |
| :--- | :--- | :--- | :--- | :--- |
| GET | `/profiles` | 내 프로필 조회 | Yes | Any |
| PATCH | `/profiles` | 내 프로필 수정 (전화번호, 주소 등) | Yes | Any |
| GET | `/profiles/{id}` | 특정 사용자 프로필 조회 (관리자용) | Yes | Admin |

## 4. 예약 (Reservations)

청소 서비스 예약 생성, 조회, 상태 변경을 처리합니다.

### 4.1. 예약 CRUD

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| POST | `/reservations` | 새 예약 생성 | Yes |
| GET | `/reservations` | 내 예약 목록 조회 | Yes |
| GET | `/reservations/{id}` | 특정 예약 상세 조회 | Yes |
| PATCH | `/reservations/{id}` | 예약 수정 (날짜, 주소 등) | Yes (본인/Admin) |
| DELETE | `/reservations/{id}` | 예약 취소 (삭제 또는 상태 변경) | Yes (본인/Admin) |

**Request Body (Create/Update):**

```json
{
  "service_type": "standard", // or "deep", "move_in"
  "area_size": 84, // m2
  "scheduled_at": "2023-10-27T10:00:00Z",
  "address": "서울시 강남구...",
  "notes": "애완동물 있음"
}
```

### 4.2. 예약 상태 관리 (Admin/Cleaner)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| PATCH | `/reservations/{id}/status` | 예약 상태 변경 (pending -> confirmed -> completed) | Yes (Admin/Cleaner) |

## 5. 결제 (Payments)

결제 처리 및 내역을 관리합니다. PG사 연동 로직은 Edge Function 또는 클라이언트 SDK와 연동됩니다.

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| POST | `/payments` | 결제 생성 (결제 시도) | Yes |
| GET | `/payments/{id}` | 결제 상세 조회 | Yes |
| POST | `/payments/webhook` | PG사 웹훅 처리 (결제 완료 통보) | No (Signature 검증) |

## 6. 리뷰 (Reviews)

서비스 완료 후 리뷰 작성 및 조회.

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| POST | `/reviews` | 리뷰 작성 | Yes |
| GET | `/reviews?service_id={id}` | 특정 서비스/청소부 리뷰 조회 | No |
| PATCH | `/reviews/{id}` | 리뷰 수정 | Yes (작성자) |

## 7. 관리자 기능 (Admin Only)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| GET | `/admin/stats` | 전체 예약/매출 통계 조회 | Yes (Admin) |
| GET | `/admin/users` | 전체 사용자 관리 | Yes (Admin) |

## 8. 에러 처리 (Error Handling)

표준 HTTP 상태 코드를 사용합니다.

*   `200 OK`: 성공
*   `201 Created`: 리소스 생성 성공
*   `400 Bad Request`: 입력값 오류
*   `401 Unauthorized`: 인증 실패
*   `403 Forbidden`: 권한 없음
*   `404 Not Found`: 리소스 없음
*   `500 Internal Server Error`: 서버 오류
