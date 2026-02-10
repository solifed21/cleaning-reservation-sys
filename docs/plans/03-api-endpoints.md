# 03. API 엔드포인트

TanStack Start Server Functions 기반 API 설계

## 🎯 설계 원칙

1. **타입 안전**: TypeScript + Zod로 요청/응답 검증
2. **일관성**: 모든 API는 동일한 응답 구조 사용
3. **인증**: Better Auth 세션 기반 인증
4. **권한**: 역할별 접근 제어 (RBAC)

---

## 📐 공통 구조

### 응답 포맷

```typescript
// 성공 응답
type SuccessResponse<T> = {
  success: true;
  data: T;
};

// 에러 응답
type ErrorResponse = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
};

// 통합 응답
type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;
```

### 페이지네이션

```typescript
type PaginatedResponse<T> = {
  success: true;
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    hasMore: boolean;
  };
};

// 커서 기반
type CursorResponse<T> = {
  success: true;
  data: T[];
  cursor: {
    nextCursor: string | null;
    hasMore: boolean;
  };
};
```

### 에러 코드

| Code | HTTP | 설명 |
|------|------|------|
| `UNAUTHORIZED` | 401 | 인증 필요 |
| `FORBIDDEN` | 403 | 권한 없음 |
| `NOT_FOUND` | 404 | 리소스 없음 |
| `VALIDATION_ERROR` | 400 | 요청 데이터 오류 |
| `CONFLICT` | 409 | 상태 충돌 |
| `INTERNAL_ERROR` | 500 | 서버 오류 |

---

## 🔐 인증 (Auth)

### POST `/api/auth/signup`
이메일 회원가입

**Request:**
```typescript
{
  email: string;
  password: string;      // 8자 이상
  name: string;
  phone: string;         // 010-XXXX-XXXX
  role: 'customer' | 'cleaner';
}
```

**Response:**
```typescript
{
  success: true;
  data: {
    user: User;
    session: Session;
  };
}
```

### POST `/api/auth/login`
이메일 로그인

**Request:**
```typescript
{
  email: string;
  password: string;
}
```

### GET `/api/auth/oauth/kakao`
카카오 OAuth 시작

### GET `/api/auth/oauth/kakao/callback`
카카오 OAuth 콜백

### GET `/api/auth/oauth/naver`
네이버 OAuth 시작

### GET `/api/auth/oauth/naver/callback`
네이버 OAuth 콜백

### POST `/api/auth/logout`
로그아웃

### GET `/api/auth/me`
현재 사용자 정보

**Response:**
```typescript
{
  success: true;
  data: {
    user: User;
    cleanerProfile?: CleanerProfile;
  };
}
```

---

## 👤 사용자 (Users)

### GET `/api/users/:id`
사용자 공개 프로필 조회

**Response:**
```typescript
{
  success: true;
  data: {
    id: string;
    name: string;
    profileImage: string | null;
    role: 'customer' | 'cleaner';
    // 제공자인 경우 추가 정보
    cleanerProfile?: {
      intro: string | null;
      averageRating: string;
      totalReviews: number;
      totalBookings: number;
    };
  };
}
```

### PATCH `/api/users/me`
내 정보 수정

**Request:**
```typescript
{
  name?: string;
  phone?: string;
  profileImage?: string;
}
```

### DELETE `/api/users/me`
계정 탈퇴 (소프트 삭제)

---

## 🧹 제공자 프로필 (Cleaner Profiles)

### POST `/api/cleaner-profiles`
제공자 프로필 생성 (역할 전환)

**Request:**
```typescript
{
  intro?: string;
  pricePerHour?: number;
  serviceAreaIds: string[];  // sub_area IDs
  availableTimes: {
    dayOfWeek: number;       // 0-6
    startTime: string;       // "09:00"
    endTime: string;         // "18:00"
  }[];
}
```

### GET `/api/cleaner-profiles/me`
내 제공자 프로필 조회

### PATCH `/api/cleaner-profiles/me`
내 제공자 프로필 수정

**Request:**
```typescript
{
  intro?: string;
  pricePerHour?: number;
  isAvailable?: boolean;
}
```

### GET `/api/cleaner-profiles/:id`
제공자 상세 프로필 (공개)

**Response:**
```typescript
{
  success: true;
  data: {
    id: string;
    user: {
      id: string;
      name: string;
      profileImage: string | null;
    };
    intro: string | null;
    pricePerHour: number | null;
    averageRating: string;
    totalReviews: number;
    totalBookings: number;
    serviceAreas: {
      id: string;
      name: string;
      area: {
        id: string;
        name: string;
      };
    }[];
    availableTimes: AvailableTime[];
  };
}
```

### GET `/api/cleaner-profiles`
제공자 목록 검색

**Query Parameters:**
```typescript
{
  areaId?: string;          // 지역 필터
  subAreaId?: string;       // 세부 지역 필터
  date?: string;            // YYYY-MM-DD (가능한 제공자)
  time?: string;            // HH:mm
  minRating?: number;       // 최소 평점
  page?: number;
  pageSize?: number;
}
```

### POST `/api/cleaner-profiles/me/service-areas`
서비스 지역 추가

**Request:**
```typescript
{
  subAreaIds: string[];
}
```

### DELETE `/api/cleaner-profiles/me/service-areas/:subAreaId`
서비스 지역 제거

### POST `/api/cleaner-profiles/me/available-times`
가능 시간 추가

**Request:**
```typescript
{
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}
```

### DELETE `/api/cleaner-profiles/me/available-times/:id`
가능 시간 제거

---

## 📅 예약 (Bookings)

### POST `/api/bookings`
청소 예약 생성 (요청자)

**Request:**
```typescript
{
  subAreaId: string;
  scheduledDate: string;     // YYYY-MM-DD
  scheduledTime: string;     // HH:mm
  duration: number;          // 시간 단위
  address: string;
  addressDetail?: string;
  roomType: 'oneRoom' | 'twoRoom' | 'threeRoom' | 'studio' | 'office';
  roomSize?: number;         // 평수
  services: string[];        // ["basic_cleaning", "bathroom", "kitchen"]
  description?: string;
  budget?: number;           // 희망 예산
}
```

**Response:**
```typescript
{
  success: true;
  data: Booking;
}
```

### GET `/api/bookings`
예약 목록 조회

**Query Parameters:**
```typescript
{
  status?: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  role?: 'customer' | 'cleaner';  // 내 역할 기준
  page?: number;
  pageSize?: number;
}
```

### GET `/api/bookings/available`
수락 가능한 예약 목록 (제공자)

**Query Parameters:**
```typescript
{
  areaId?: string;
  subAreaId?: string;
  date?: string;             // YYYY-MM-DD
  page?: number;
  pageSize?: number;
}
```

### GET `/api/bookings/:id`
예약 상세 조회

**Response:**
```typescript
{
  success: true;
  data: {
    ...Booking;
    customer: {
      id: string;
      name: string;
      phone: string;
      profileImage: string | null;
    };
    cleaner?: {
      id: string;
      name: string;
      phone: string;
      profileImage: string | null;
      cleanerProfile: CleanerProfile;
    };
    subArea: {
      id: string;
      name: string;
      area: Area;
    };
    review?: Review;
  };
}
```

### POST `/api/bookings/:id/accept`
예약 수락 (제공자)

**Response:**
```typescript
{
  success: true;
  data: Booking;  // status: 'confirmed'
}
```

**Errors:**
- `BOOKING_ALREADY_TAKEN` - 이미 다른 제공자가 수락
- `BOOKING_NOT_IN_YOUR_AREA` - 서비스 지역 외
- `TIME_CONFLICT` - 해당 시간에 다른 예약 존재

### POST `/api/bookings/:id/reject`
예약 거절 (제공자)

**Request:**
```typescript
{
  reason?: string;
}
```

### POST `/api/bookings/:id/start`
청소 시작 (제공자)

**Response:**
```typescript
{
  success: true;
  data: Booking;  // status: 'in_progress'
}
```

### POST `/api/bookings/:id/complete`
청소 완료 (제공자)

**Request:**
```typescript
{
  completionPhotos?: string[];  // 이미지 URL 배열
  completionNotes?: string;
}
```

**Response:**
```typescript
{
  success: true;
  data: Booking;  // status: 'completed'
}
```

### POST `/api/bookings/:id/cancel`
예약 취소

**Request:**
```typescript
{
  reason: string;
}
```

**Rules:**
- 요청자: 확정 상태에서만 취소 가능
- 제공자: 확정 상태에서만 취소 가능
- 취소 시 상대방에게 알림 발송

---

## 💬 메시지 (Messages)

### GET `/api/bookings/:bookingId/messages`
예약 메시지 목록

**Query Parameters:**
```typescript
{
  cursor?: string;           // 메시지 ID
  limit?: number;            // default: 50
}
```

**Response:**
```typescript
{
  success: true;
  data: Message[];
  cursor: {
    nextCursor: string | null;
    hasMore: boolean;
  };
}
```

### POST `/api/bookings/:bookingId/messages`
메시지 전송

**Request:**
```typescript
{
  type: 'text' | 'image';
  content: string;
  imageUrl?: string;         // type이 image인 경우
}
```

### POST `/api/bookings/:bookingId/messages/read`
메시지 읽음 처리

**Request:**
```typescript
{
  messageIds: string[];
}
```

### GET `/api/bookings/:bookingId/messages/unread`
안읽은 메시지 수

**Response:**
```typescript
{
  success: true;
  data: {
    count: number;
    lastMessage?: Message;
  };
}
```

---

## ⭐ 리뷰 (Reviews)

### POST `/api/bookings/:bookingId/review`
리뷰 작성

**Request:**
```typescript
{
  rating: number;            // 1-5
  content: string;           // 10자 이상
  tags?: string[];           // ["친절해요", "꼼꼼해요", "시간 엄수"]
}
```

**Rules:**
- 청소 완료 상태에서만 작성 가능
- 예약당 양방향 리뷰 (요청자 → 제공자, 제공자 → 요청자)
- 작성 후 24시간 내 수정 가능

### GET `/api/reviews/:id`
리뷰 상세 조회

### GET `/api/users/:userId/reviews`
사용자 리뷰 목록

**Query Parameters:**
```typescript
{
  type?: 'received' | 'written';
  page?: number;
  pageSize?: number;
}
```

### PATCH `/api/reviews/:id`
리뷰 수정 (24시간 내)

**Request:**
```typescript
{
  rating?: number;
  content?: string;
  tags?: string[];
}
```

---

## 🔔 알림 (Notifications)

### GET `/api/notifications`
알림 목록

**Query Parameters:**
```typescript
{
  unreadOnly?: boolean;
  page?: number;
  pageSize?: number;
}
```

### POST `/api/notifications/:id/read`
알림 읽음 처리

### POST `/api/notifications/read-all`
전체 읽음 처리

### GET `/api/notifications/unread-count`
안읽은 알림 수

**Response:**
```typescript
{
  success: true;
  data: {
    count: number;
  };
}
```

---

## 📍 지역 (Areas)

### GET `/api/areas`
지역 목록 (캐시 가능)

**Response:**
```typescript
{
  success: true;
  data: {
    id: string;
    name: string;
    subAreas: {
      id: string;
      name: string;
    }[];
  }[];
}
```

### GET `/api/areas/:id`
지역 상세

---

## 📊 관리자 API (Admin)

> 관리자 대시보드용 API (추후 구현)

### GET `/api/admin/users`
사용자 목록

### GET `/api/admin/bookings`
전체 예약 통계

### GET `/api/admin/stats`
대시보드 통계

**Response:**
```typescript
{
  success: true;
  data: {
    users: {
      total: number;
      customers: number;
      cleaners: number;
    };
    bookings: {
      total: number;
      pending: number;
      confirmed: number;
      completed: number;
      cancelled: number;
    };
    revenue: {
      today: number;
      thisMonth: number;
    };
  };
}
```

---

## 🔒 권한 매트릭스

| API | Guest | Customer | Cleaner | Admin |
|-----|-------|----------|---------|-------|
| POST /auth/* | ✅ | ✅ | ✅ | ✅ |
| GET /users/:id | ✅ | ✅ | ✅ | ✅ |
| PATCH /users/me | ❌ | ✅ | ✅ | ✅ |
| POST /cleaner-profiles | ❌ | ✅ | ❌ | ✅ |
| POST /bookings | ❌ | ✅ | ❌ | ✅ |
| GET /bookings/available | ❌ | ❌ | ✅ | ✅ |
| POST /bookings/:id/accept | ❌ | ❌ | ✅ | ✅ |
| GET /areas | ✅ | ✅ | ✅ | ✅ |
| GET /admin/* | ❌ | ❌ | ❌ | ✅ |

---

## 📁 파일 구조

```
apps/web/
├── app/
│   └── routes/
│       └── api/
│           ├── auth.ts
│           ├── users.ts
│           ├── cleaner-profiles.ts
│           ├── bookings.ts
│           ├── messages.ts
│           ├── reviews.ts
│           ├── notifications.ts
│           ├── areas.ts
│           └── admin/
│               ├── users.ts
│               └── stats.ts
├── server/
│   ├── functions/          # 재사용 가능한 비즈니스 로직
│   │   ├── auth.ts
│   │   ├── booking.ts
│   │   ├── message.ts
│   │   └── notification.ts
│   ├── middleware/
│   │   ├── auth.ts         # 인증 미들웨어
│   │   └── rbac.ts         # 권한 체크 미들웨어
│   └── validators/         # Zod 스키마
│       ├── auth.ts
│       ├── booking.ts
│       ├── message.ts
│       └── review.ts
└── packages/shared/
    └── types/
        └── api.ts          # API 타입 정의
```

---

## 🔄 상태 머신

### 예약 상태 전이

```
┌─────────┐  수락   ┌───────────┐  시작   ┌───────────┐
│ pending │ ──────→ │ confirmed │ ──────→ │ in_progress│
└────┬────┘         └─────┬─────┘         └─────┬─────┘
     │                    │                     │
     │ 거절               │ 취소                │ 완료
     ↓                    ↓                     ↓
┌───────────┐       ┌───────────┐        ┌───────────┐
│ cancelled │       │ cancelled │        │ completed │
└───────────┘       └───────────┘        └───────────┘
```

### 상태별 가능한 액션

| 현재 상태 | Customer | Cleaner |
|-----------|----------|---------|
| pending | 취소 | 수락, 거절 |
| confirmed | 취소 | 취소, 시작 |
| in_progress | - | 완료 |
| completed | 리뷰 작성 | 리뷰 작성 |
| cancelled | - | - |

---

## 🧪 테스트 전략

### 단위 테스트
- 각 Server Function에 대한 입력/출력 테스트
- Zod validator 테스트

### 통합 테스트
- API 엔드포인트 E2E 테스트
- 인증/권한 테스트

### 테스트 예시

```typescript
// __tests__/api/bookings.test.ts
describe('POST /api/bookings', () => {
  it('should create a booking for customer', async () => {
    const res = await client.post('/api/bookings', {
      subAreaId: 'sub-1',
      scheduledDate: '2024-02-15',
      scheduledTime: '10:00',
      duration: 2,
      address: '창원시 의창구 용지동 123',
      roomType: 'oneRoom',
      services: ['basic_cleaning'],
    }, { headers: { Authorization: `Bearer ${customerToken}` }});
    
    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('pending');
  });
  
  it('should reject booking from cleaner', async () => {
    const res = await client.post('/api/bookings', payload, {
      headers: { Authorization: `Bearer ${cleanerToken}` }
    });
    
    expect(res.status).toBe(403);
  });
});
```

---

## ✅ 체크리스트

- [x] 공통 응답 구조 정의
- [x] 인증 API 설계
- [x] 사용자 API 설계
- [x] 제공자 프로필 API 설계
- [x] 예약 API 설계
- [x] 메시지 API 설계
- [x] 리뷰 API 설계
- [x] 알림 API 설계
- [x] 지역 API 설계
- [x] 관리자 API 설계 (기본)
- [x] 권한 매트릭스 정의
- [x] 상태 머신 정의

---

## 📝 다음 단계

- [ ] 04. 모바일 앱 화면 설계
- [ ] 05. 웹 대시보드 설계
