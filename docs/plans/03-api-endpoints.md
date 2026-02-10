# 03. API 엔드포인트

TanStack Start 기반 풀스택 아키텍처의 API 설계

## 🎯 설계 원칙

1. **RESTful**: 리소스 중심 URL 설계
2. **타입 안전**: Zod 검증 + TypeScript
3. **Server Actions 우선**: 데이터 변경은 Server Actions
4. **Server Functions**: 복잡한 조회는 Server Functions
5. **일관된 응답**: 표준 응답 포맷 사용

---

## 📋 응답 포맷

### 성공 응답
```typescript
interface SuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}
```

### 에러 응답
```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}
```

### 페이지네이션
```typescript
interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}
```

---

## 🔐 인증 API (Auth)

### `POST /api/auth/signup`
회원가입

**Request Body:**
```typescript
{
  email: string;
  password: string;
  name: string;
  phone: string;
  role: "customer" | "cleaner";
}
```

**Response:**
```typescript
{
  success: true;
  data: {
    user: User;
    token: string;
  }
}
```

### `POST /api/auth/login`
로그인

**Request Body:**
```typescript
{
  email: string;
  password: string;
}
```

### `POST /api/auth/logout`
로그아웃

### `GET /api/auth/me`
현재 사용자 정보 조회

### `POST /api/auth/oauth/kakao`
카카오 OAuth 로그인

**Request Body:**
```typescript
{
  code: string;
}
```

### `POST /api/auth/oauth/naver`
네이버 OAuth 로그인

**Request Body:**
```typescript
{
  code: string;
  state: string;
}
```

---

## 👤 사용자 API (Users)

### `GET /api/users/:id`
사용자 프로필 조회

### `PUT /api/users/:id`
프로필 수정

**Request Body (Customer):**
```typescript
{
  name?: string;
  phone?: string;
  address?: string;
  addressDetail?: string;
}
```

**Request Body (Cleaner):**
```typescript
{
  name?: string;
  phone?: string;
  intro?: string;
  serviceAreas?: string[];
  pricePerHour?: number;
  availableTimes?: AvailableTime[];
}

interface AvailableTime {
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0=일요일
  startTime: string; // "09:00"
  endTime: string;   // "18:00"
}
```

### `GET /api/users/:id/reviews`
사용자 리뷰 목록

**Query Parameters:**
- `type`: "received" | "written"
- `page`: number
- `limit`: number

---

## 🧹 예약 API (Bookings)

### `GET /api/bookings`
예약 목록 조회 (역할별 필터링)

**Query Parameters:**
- `status`: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled"
- `role`: "customer" | "cleaner"
- `page`: number
- `limit`: number
- `dateFrom`: string (ISO date)
- `dateTo`: string (ISO date)

**Response:**
```typescript
{
  success: true;
  data: Booking[];
  pagination: PaginationInfo;
}
```

### `POST /api/bookings`
청소 예약 생성 (요청자)

**Request Body:**
```typescript
{
  address: string;
  addressDetail?: string;
  scheduledDate: string; // ISO date
  scheduledTime: string; // "14:00"
  duration: number;      // 예상 소요 시간 (시간)
  roomType: "oneRoom" | "twoRoom" | "threeRoom" | "studio" | "office";
  roomSize?: number;     // 평수
  services: ServiceType[];
  description?: string;
  budget?: number;       // 희망 예산
}

type ServiceType = 
  | "basic_cleaning"     // 기본 청소
  | "bathroom"           // 욕실 청소
  | "kitchen"            // 주방 청소
  | "window"             // 창문 청소
  | "move_in"            // 입주 청소
  | "move_out";          // 이주 청소
```

**Response:**
```typescript
{
  success: true;
  data: {
    booking: Booking;
  };
  message: "예약 요청이 등록되었습니다.";
}
```

### `GET /api/bookings/:id`
예약 상세 조회

### `PUT /api/bookings/:id`
예약 수정 (요청자만, 대기 상태일 때만)

**Request Body:**
```typescript
{
  scheduledDate?: string;
  scheduledTime?: string;
  duration?: number;
  services?: ServiceType[];
  description?: string;
}
```

### `POST /api/bookings/:id/accept`
예약 수락 (제공자)

**Request Body:**
```typescript
{
  message?: string; // 수락 메시지
}
```

### `POST /api/bookings/:id/reject`
예약 거절 (제공자)

**Request Body:**
```typescript
{
  reason: string; // 거절 사유
}
```

### `POST /api/bookings/:id/cancel`
예약 취소

**Request Body:**
```typescript
{
  reason?: string;
}
```

### `POST /api/bookings/:id/start`
청소 시작 (제공자)

### `POST /api/bookings/:id/complete`
청소 완료 (제공자)

**Request Body:**
```typescript
{
  photos?: string[]; // 완료 사진 URL
  notes?: string;    // 완료 메모
}
```

### `GET /api/bookings/available`
수락 가능한 예약 목록 (제공자)

**Query Parameters:**
- `date`: string (ISO date)
- `area`: string
- `page`: number
- `limit`: number

---

## 💬 메시지 API (Messages)

### `GET /api/bookings/:bookingId/messages`
예약 메시지 목록

**Query Parameters:**
- `after`: string (message id, 이후 메시지만 조회)
- `limit`: number

**Response:**
```typescript
{
  success: true;
  data: Message[];
  hasMore: boolean;
}
```

### `POST /api/bookings/:bookingId/messages`
메시지 전송

**Request Body:**
```typescript
{
  content: string;
  type?: "text" | "image";
  imageUrl?: string; // type이 image일 때
}
```

### `POST /api/bookings/:bookingId/messages/read`
메시지 읽음 처리

**Request Body:**
```typescript
{
  messageIds: string[];
}
```

---

## ⭐ 리뷰 API (Reviews)

### `POST /api/reviews`
리뷰 작성

**Request Body:**
```typescript
{
  bookingId: string;
  rating: 1 | 2 | 3 | 4 | 5;
  content: string;
  tags?: ReviewTag[];
}

type ReviewTag = 
  | "친절해요"
  | "시간 준수"
  | "꼼꼼해요"
  | "깨끗해요"
  | "추천해요";
```

**Response:**
```typescript
{
  success: true;
  data: {
    review: Review;
  };
  message: "리뷰가 작성되었습니다.";
}
```

### `GET /api/reviews/:id`
리뷰 상세 조회

### `PUT /api/reviews/:id`
리뷰 수정 (24시간 내)

**Request Body:**
```typescript
{
  rating?: 1 | 2 | 3 | 4 | 5;
  content?: string;
  tags?: ReviewTag[];
}
```

### `DELETE /api/reviews/:id`
리뷰 삭제 (24시간 내)

### `GET /api/reviews/check/:bookingId`
리뷰 작성 여부 확인

**Response:**
```typescript
{
  success: true;
  data: {
    canReview: boolean;
    existingReview?: Review;
  };
}
```

---

## 📍 지역 API (Areas)

### `GET /api/areas`
서비스 가능 지역 목록

**Response:**
```typescript
{
  success: true;
  data: {
    areas: {
      id: string;
      name: string;
      subAreas: {
        id: string;
        name: string;
      }[];
    }[];
  };
}
```

### `GET /api/areas/search`
지역 검색

**Query Parameters:**
- `q`: string (검색어)

---

## 📊 대시보드 API (Dashboard)

### `GET /api/dashboard/customer`
요청자 대시보드

**Response:**
```typescript
{
  success: true;
  data: {
    activeBookings: number;
    completedBookings: number;
    pendingReviews: number;
    upcomingBookings: Booking[];
    recentBookings: Booking[];
  };
}
```

### `GET /api/dashboard/cleaner`
제공자 대시보드

**Response:**
```typescript
{
  success: true;
  data: {
    todayBookings: Booking[];
    pendingRequests: number;
    completedThisMonth: number;
    totalEarnings: number;
    averageRating: number;
    totalReviews: number;
    upcomingBookings: Booking[];
  };
}
```

---

## 🔔 알림 API (Notifications)

### `GET /api/notifications`
알림 목록

**Query Parameters:**
- `page`: number
- `limit`: number
- `unreadOnly`: boolean

### `POST /api/notifications/:id/read`
알림 읽음 처리

### `POST /api/notifications/read-all`
모든 알림 읽음 처리

### `GET /api/notifications/unread-count`
읽지 않은 알림 수

---

## 📁 파일 업로드 API (Upload)

### `POST /api/upload/image`
이미지 업로드

**Request:** `multipart/form-data`
- `file`: File
- `type`: "profile" | "message" | "review" | "completion"

**Response:**
```typescript
{
  success: true;
  data: {
    url: string;
    thumbnailUrl?: string;
  };
}
```

---

## 🔧 Server Actions (클라이언트 직접 호출)

TanStack Start에서 클라이언트가 직접 호출하는 서버 액션들

### 인증 관련
```typescript
// server/actions/auth.ts
export async function signup(data: SignupFormData): Promise<AuthResult>
export async function login(data: LoginFormData): Promise<AuthResult>
export async function logout(): Promise<void>
export async function oauthLogin(provider: 'kakao' | 'naver', code: string): Promise<AuthResult>
```

### 예약 관련
```typescript
// server/actions/booking.ts
export async function createBooking(data: CreateBookingInput): Promise<Booking>
export async function updateBooking(id: string, data: UpdateBookingInput): Promise<Booking>
export async function acceptBooking(id: string, message?: string): Promise<Booking>
export async function rejectBooking(id: string, reason: string): Promise<Booking>
export async function cancelBooking(id: string, reason?: string): Promise<Booking>
export async function completeBooking(id: string, data: CompleteBookingInput): Promise<Booking>
```

### 메시지 관련
```typescript
// server/actions/message.ts
export async function sendMessage(bookingId: string, data: SendMessageInput): Promise<Message>
export async function markMessagesRead(bookingId: string, messageIds: string[]): Promise<void>
```

### 리뷰 관련
```typescript
// server/actions/review.ts
export async function createReview(data: CreateReviewInput): Promise<Review>
export async function updateReview(id: string, data: UpdateReviewInput): Promise<Review>
export async function deleteReview(id: string): Promise<void>
```

### 프로필 관련
```typescript
// server/actions/user.ts
export async function updateProfile(data: UpdateProfileInput): Promise<User>
export async function updateCleanerProfile(data: UpdateCleanerProfileInput): Promise<User>
```

---

## 🔒 권한 매트릭스

| 엔드포인트 | 비회원 | 요청자 | 제공자 |
|-----------|--------|--------|--------|
| `POST /api/auth/*` | ✅ | ✅ | ✅ |
| `GET /api/users/:id` | ✅ | ✅ | ✅ |
| `PUT /api/users/:id` | ❌ | 본인만 | 본인만 |
| `POST /api/bookings` | ❌ | ✅ | ❌ |
| `GET /api/bookings` | ❌ | 본인만 | 본인만 |
| `POST /api/bookings/:id/accept` | ❌ | ❌ | ✅ |
| `POST /api/bookings/:id/reject` | ❌ | ❌ | ✅ |
| `GET /api/bookings/available` | ❌ | ❌ | ✅ |
| `POST /api/reviews` | ❌ | ✅ | ✅ |
| `GET /api/reviews/:id` | ✅ | ✅ | ✅ |

---

## 📈 에러 코드

### 공통 에러 (1xxx)
| Code | Message |
|------|---------|
| 1001 | "잘못된 요청입니다." |
| 1002 | "인증이 필요합니다." |
| 1003 | "권한이 없습니다." |
| 1004 | "리소스를 찾을 수 없습니다." |
| 1005 | "유효하지 않은 데이터입니다." |

### 인증 에러 (2xxx)
| Code | Message |
|------|---------|
| 2001 | "이미 존재하는 이메일입니다." |
| 2002 | "잘못된 이메일 또는 비밀번호입니다." |
| 2003 | "만료된 토큰입니다." |
| 2004 | "유효하지 않은 토큰입니다." |
| 2005 | "소셜 로그인에 실패했습니다." |

### 예약 에러 (3xxx)
| Code | Message |
|------|---------|
| 3001 | "이미 예약된 시간입니다." |
| 3002 | "예약을 찾을 수 없습니다." |
| 3003 | "예약 상태를 변경할 수 없습니다." |
| 3004 | "본인의 예약만 수정할 수 있습니다." |
| 3005 | "취소 가능 시간이 지났습니다." |

### 리뷰 에러 (4xxx)
| Code | Message |
|------|---------|
| 4001 | "이미 리뷰를 작성했습니다." |
| 4002 | "리뷰 작성 기간이 아닙니다." |
| 4003 | "완료된 예약만 리뷰 작성 가능합니다." |
| 4004 | "리뷰 수정 기간이 지났습니다." |

---

## ✅ 다음 단계

- [ ] 04. 모바일 앱 화면 설계
- [ ] 05. 웹 대시보드 설계
- [ ] 06. UI/UX 테마 & 디자인 시스템
- [ ] 02. DB 스키마 & 데이터 모델 (보완 필요)
