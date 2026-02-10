# 02. DB 스키마 & 데이터 모델

PostgreSQL + Drizzle ORM 기반 데이터베이스 설계

---

## 🗄️ ERD (Entity Relationship Diagram)

```
┌──────────────────┐       ┌──────────────────┐
│      users       │       │    profiles      │
├──────────────────┤       ├──────────────────┤
│ id (PK)          │───┐   │ id (PK)          │
│ email            │   │   │ user_id (FK)     │◄──┐
│ name             │   └──►│ role             │   │
│ image            │       │ phone            │   │
│ oauth_provider   │       │ address          │   │
│ oauth_id         │       │ bio              │   │
│ created_at       │       │ service_regions  │   │
│ updated_at       │       │ hourly_rate      │   │
└──────────────────┘       │ available_times  │   │
                           │ rating           │   │
                           │ review_count     │   │
                           │ created_at       │   │
                           │ updated_at       │   │
                           └──────────────────┘   │
                                                  │
┌──────────────────┐       ┌──────────────────┐   │
│    bookings      │       │ booking_messages │   │
├──────────────────┤       ├──────────────────┤   │
│ id (PK)          │◄──────│ id (PK)          │   │
│ customer_id (FK) │───┐   │ booking_id (FK)  │   │
│ cleaner_id (FK)  │─┐ │   │ sender_id (FK)   │───┘
│ status           │ │ │   │ content          │
│ scheduled_date   │ │ │   │ created_at       │
│ scheduled_time   │ │ │   └──────────────────┘
│ address          │ │ │
│ detail_address   │ │ │   ┌──────────────────┐
│ cleaning_type    │ │ │   │     reviews      │
│ estimated_hours  │ │ │   ├──────────────────┤
│ hourly_rate      │ │ │   │ id (PK)          │
│ total_amount     │ │ │   │ booking_id (FK)  │───┘
│ requirements     │ │ │   │ reviewer_id (FK) │───┐
│ notes            │ │ │   │ reviewee_id (FK) │◄─┐│
│ created_at       │ │ │   │ rating           │  ││
│ updated_at       │ │ │   │ content          │  ││
│ confirmed_at     │ │ │   │ created_at       │  ││
│ completed_at     │ │ │   └──────────────────┘  ││
│ cancelled_at     │ │ │                          ││
│ cancel_reason    │ │ └──────────────────────────┘│
└──────────────────┘ │                             │
        ▲            └─────────────────────────────┘
        │
        │  ┌──────────────────┐
        └──│  conversations   │ (Post-MVP)
           ├──────────────────┤
           │ id (PK)          │
           │ booking_id (FK)  │
           │ created_at       │
           └──────────────────┘
```

---

## 📊 테이블 상세

### 1. users
사용자 기본 정보 (Better Auth 호환)

```typescript
// apps/web/server/db/schema/users.ts
import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  image: text('image'), // 프로필 이미지 URL
  
  // OAuth 정보 (Better Auth)
  emailVerified: timestamp('email_verified'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
```

**설명:**
- Better Auth의 기본 users 테이블 구조와 호환
- `id`: UUID 문자열
- `email`: 소셜 로그인 이메일
- `name`: 사용자 이름
- `image`: OAuth 프로필 이미지

---

### 2. profiles
사용자 역할별 상세 정보

```typescript
// apps/web/server/db/schema/profiles.ts
import { pgTable, text, timestamp, varchar, integer, decimal, jsonb, boolean } from 'drizzle-orm/pg-core'
import { users } from './users'

export type UserRole = 'customer' | 'cleaner'

export const profiles = pgTable('profiles', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }).unique(),
  
  // 역할
  role: varchar('role', { length: 20 }).notNull().default('customer'), // 'customer' | 'cleaner'
  
  // 공통 정보
  phone: varchar('phone', { length: 20 }),
  address: text('address'), // 기본 주소 (요청자용)
  
  // 제공자 전용
  bio: text('bio'), // 자기소개
  serviceRegions: jsonb('service_regions').$type<string[]>().default([]), // ['창원시 의창구', '창원시 성산구']
  hourlyRate: decimal('hourly_rate', { precision: 10, scale: 0 }), // 시간당 가격 (원)
  availableTimes: jsonb('available_times').$type<AvailableTime[]>().default([]),
  
  // 평점
  rating: decimal('rating', { precision: 2, scale: 1 }).default('0.0'), // 0.0 ~ 5.0
  reviewCount: integer('review_count').default(0),
  
  // 메타
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// 타입 정의
export interface AvailableTime {
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6 // 0=일요일
  startTime: string // '09:00'
  endTime: string // '18:00'
}
```

**설명:**
- **요청자(customer)**: `address`, `phone` 주요
- **제공자(cleaner)**: `bio`, `serviceRegions`, `hourlyRate`, `availableTimes` 주요
- `rating`: 리뷰 작성 시 자동 업데이트 (트리거 또는 앱 로직)
- `isActive`: 제공자가 서비스 중단 시 `false`

---

### 3. bookings
청소 예약

```typescript
// apps/web/server/db/schema/bookings.ts
import { pgTable, text, timestamp, varchar, integer, decimal, jsonb } from 'drizzle-orm/pg-core'
import { users } from './users'

export type BookingStatus = 
  | 'pending'    // 대기중 (요청자 등록)
  | 'confirmed'  // 확정 (제공자 수락)
  | 'in_progress' // 진행중
  | 'completed'  // 완료
  | 'cancelled'  // 취소

export type CleaningType = 
  | 'basic'      // 기본 청소
  | 'move_in'    // 입주 청소
  | 'move_out'   // 퇴실 청소
  | 'deep'       // 딥클리닝

export const bookings = pgTable('bookings', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  
  // 관계
  customerId: text('customer_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  cleanerId: text('cleaner_id').references(() => users.id, { onDelete: 'set null' }), // 수락 전까지 null
  
  // 상태
  status: varchar('status', { length: 20 }).notNull().default('pending'),
  
  // 일정
  scheduledDate: timestamp('scheduled_date', { mode: 'date' }).notNull(), // 2026-02-15
  scheduledTime: varchar('scheduled_time', { length: 5 }).notNull(), // '14:00'
  
  // 위치
  address: text('address').notNull(), // '창원시 의창구 팔용동 123'
  detailAddress: text('detail_address'), // '101동 202호'
  
  // 청소 정보
  cleaningType: varchar('cleaning_type', { length: 20 }).notNull().default('basic'),
  estimatedHours: decimal('estimated_hours', { precision: 3, scale: 1 }).notNull(), // 예상 소요 시간
  hourlyRate: decimal('hourly_rate', { precision: 10, scale: 0 }).notNull(), // 시간당 가격
  totalAmount: decimal('total_amount', { precision: 10, scale: 0 }).notNull(), // 총 금액
  
  // 요구사항
  requirements: text('requirements'), // 자유 텍스트
  checklist: jsonb('checklist').$type<string[]>().default([]), // ['화장실 청소', '주방 청소']
  
  // 메모
  notes: text('notes'), // 제공자용 메모 (비공개)
  
  // 타임스탬프
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  confirmedAt: timestamp('confirmed_at'), // 수락 시각
  completedAt: timestamp('completed_at'), // 완료 시각
  cancelledAt: timestamp('cancelled_at'), // 취소 시각
  cancelReason: text('cancel_reason'), // 취소 사유
})
```

**상태 전이:**
```
pending → confirmed → in_progress → completed
   ↓         ↓             ↓
   └─────────┴─────────────→ cancelled
```

**금액 계산:**
```
total_amount = estimated_hours × hourly_rate
```

---

### 4. booking_messages
예약별 메시지 (MVP용 폴링 방식)

```typescript
// apps/web/server/db/schema/booking-messages.ts
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { bookings } from './bookings'
import { users } from './users'

export const bookingMessages = pgTable('booking_messages', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  
  bookingId: text('booking_id').notNull().references(() => bookings.id, { onDelete: 'cascade' }),
  senderId: text('sender_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  
  content: text('content').notNull(),
  
  // 읽음 확인 (Post-MVP)
  isRead: timestamp('is_read'), // null이면 안읽음
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
```

**설명:**
- MVP에서는 폴링으로 새 메시지 확인
- Post-MVP에서 WebSocket으로 마이그레이션
- `isRead`: 읽은 시각 (null = 안읽음)

---

### 5. reviews
상호 리뷰

```typescript
// apps/web/server/db/schema/reviews.ts
import { pgTable, text, timestamp, integer, check } from 'drizzle-orm/pg-core'
import { bookings } from './bookings'
import { users } from './users'

export const reviews = pgTable('reviews', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  
  bookingId: text('booking_id').notNull().references(() => bookings.id, { onDelete: 'cascade' }).unique(),
  
  // 리뷰어와 피리뷰어
  reviewerId: text('reviewer_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  revieweeId: text('reviewee_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  
  // 평점 (1~5)
  rating: integer('rating').notNull(), // CHECK 제약: 1 <= rating <= 5
  
  // 내용
  content: text('content').notNull(),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  ratingCheck: check('rating_check', sql`${table.rating} >= 1 AND ${table.rating} <= 5`),
}))
```

**설명:**
- 예약당 2개의 리뷰 생성 (요청자 → 제공자, 제공자 → 요청자)
- `bookingId.unique()`: 한 예약에 대해 리뷰어별 1개만 가능
- `rating`: 1~5 제약조건

---

## 📈 인덱스 전략

```sql
-- Users
CREATE INDEX idx_users_email ON users(email);

-- Profiles
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_rating ON profiles(rating DESC);

-- Bookings
CREATE INDEX idx_bookings_customer_id ON bookings(customer_id);
CREATE INDEX idx_bookings_cleaner_id ON bookings(cleaner_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_scheduled_date ON bookings(scheduled_date);
CREATE INDEX idx_bookings_created_at ON bookings(created_at DESC);

-- Booking Messages
CREATE INDEX idx_booking_messages_booking_id ON booking_messages(booking_id);
CREATE INDEX idx_booking_messages_created_at ON booking_messages(created_at DESC);

-- Reviews
CREATE INDEX idx_reviews_reviewer_id ON reviews(reviewer_id);
CREATE INDEX idx_reviews_reviewee_id ON reviews(reviewee_id);
CREATE INDEX idx_reviews_booking_id ON reviews(booking_id);
```

---

## 🔐 보안: Row Level Security (RLS)

Supabase 사용 시 RLS 정책 예시:

```sql
-- Users: 자신의 정보만 수정 가능
CREATE POLICY users_update_own ON users
  FOR UPDATE USING (auth.uid()::text = id);

-- Profiles: 모두 읽기 가능, 생성/수정은 본인만
CREATE POLICY profiles_select_all ON profiles FOR SELECT USING (true);
CREATE POLICY profiles_insert_own ON profiles FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY profiles_update_own ON profiles FOR UPDATE USING (auth.uid()::text = user_id);

-- Bookings: 관계자만 조회 (요청자 또는 제공자)
CREATE POLICY bookings_select_own ON bookings FOR SELECT
  USING (auth.uid()::text IN (customer_id, cleaner_id));

-- Booking Messages: 예약 관계자만
CREATE POLICY booking_messages_select_own ON booking_messages FOR SELECT
  USING (
    booking_id IN (
      SELECT id FROM bookings 
      WHERE auth.uid()::text IN (customer_id, cleaner_id)
    )
  );
```

---

## 🔄 Drizzle ORM 통합

### 스키마 exports

```typescript
// apps/web/server/db/schema/index.ts
export * from './users'
export * from './profiles'
export * from './bookings'
export * from './booking-messages'
export * from './reviews'

// 관계 정의
import { relations } from 'drizzle-orm'
import { users, profiles, bookings, bookingMessages, reviews } from '.'

export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles, {
    fields: [users.id],
    references: [profiles.userId],
  }),
  customerBookings: many(bookings, { relationName: 'customer' }),
  cleanerBookings: many(bookings, { relationName: 'cleaner' }),
  sentMessages: many(bookingMessages, { relationName: 'sender' }),
  writtenReviews: many(reviews, { relationName: 'reviewer' }),
  receivedReviews: many(reviews, { relationName: 'reviewee' }),
}))

export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  customer: one(users, { relationName: 'customer', fields: [bookings.customerId], references: [users.id] }),
  cleaner: one(users, { relationName: 'cleaner', fields: [bookings.cleanerId], references: [users.id] }),
  messages: many(bookingMessages),
  reviews: many(reviews),
}))
```

### Drizzle 설정

```typescript
// apps/web/drizzle.config.ts
import type { Config } from 'drizzle-kit'

export default {
  schema: './server/db/schema/*.{ts,tsx}',
  out: './server/db/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config
```

---

## 📊 데이터 모델 요약

| 테이블 | 목적 | 주요 컬럼 |
|--------|------|----------|
| `users` | 사용자 기본 정보 | email, name, image |
| `profiles` | 역할별 상세 정보 | role, phone, serviceRegions, hourlyRate, rating |
| `bookings` | 청소 예약 | customerId, cleanerId, status, scheduledDate, totalAmount |
| `booking_messages` | 예약별 메시지 | bookingId, senderId, content |
| `reviews` | 상호 리뷰 | bookingId, reviewerId, revieweeId, rating |

---

## ✅ 체크리스트

- [x] ERD 작성
- [x] 테이블별 상세 스키마 정의
- [x] Drizzle ORM 타입 안전 스키마 작성
- [x] 인덱스 전략 수립
- [x] RLS 정책 예시 작성
- [x] 관계 정의

---

**다음:** 03. API 엔드포인트 정의
