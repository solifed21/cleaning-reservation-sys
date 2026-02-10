# 02. DB 스키마 & 데이터 모델

Drizzle ORM 기반 데이터베이스 설계

## 🎯 설계 원칙

1. **타입 안전**: TypeScript와 1:1 매핑
2. **확장성**: 향후 기능 추가 고려
3. **성능**: 인덱스 전략, 쿼리 패턴 최적화
4. **정규화**: 중복 최소화, 무결성 보장

---

## 📊 ERD (Entity Relationship Diagram)

```
┌──────────────┐       ┌───────────────────┐
│    users     │───1:1──│ cleaner_profiles  │
└──────────────┘       └───────────────────┘
       │                       │
       │ 1:N                   │ 1:N
       ▼                       ▼
┌──────────────┐       ┌───────────────────┐
│   bookings   │───────│ available_times   │
│  (customer)  │       └───────────────────┘
└──────────────┘
       │
       │ 1:1
       ▼
┌──────────────┐       ┌───────────────────┐
│    reviews   │───────│ review_tags       │
│  (from/to)   │       └───────────────────┘
└──────────────┘
       │
       │ 1:N
       ▼
┌──────────────┐       ┌───────────────────┐
│   messages   │       │  notifications    │
└──────────────┘       └───────────────────┘

┌──────────────┐       ┌───────────────────┐
│    areas     │──1:N──│    sub_areas      │
└──────────────┘       └───────────────────┘
```

---

## 📋 테이블 상세

### 1. users (사용자)

```typescript
// server/db/schema/users.ts
import { pgTable, text, timestamp, boolean, pgEnum } from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('user_role', ['customer', 'cleaner']);

export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text('email').notNull().unique(),
  password: text('password'), // OAuth 유저는 null
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  role: roleEnum('role').notNull(),
  
  // OAuth
  kakaoId: text('kakao_id').unique(),
  naverId: text('naver_id').unique(),
  
  // 이미지
  profileImage: text('profile_image'),
  
  // 상태
  isActive: boolean('is_active').notNull().default(true),
  emailVerified: boolean('email_verified').notNull().default(false),
  
  // 타임스탬프
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
```

**Indexes:**
- `email` (unique)
- `kakao_id` (unique, sparse)
- `naver_id` (unique, sparse)

---

### 2. cleaner_profiles (제공자 프로필)

```typescript
// server/db/schema/cleaner-profiles.ts
import { pgTable, text, timestamp, integer, boolean, numeric } from 'drizzle-orm/pg-core';
import { users } from './users';

export const cleanerProfiles = pgTable('cleaner_profiles', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }).unique(),
  
  // 소개
  intro: text('intro'), // 자기소개
  
  // 가격
  pricePerHour: integer('price_per_hour'), // 시간당 가격 (원)
  
  // 통계
  totalBookings: integer('total_bookings').notNull().default(0),
  totalReviews: integer('total_reviews').notNull().default(0),
  averageRating: numeric('average_rating', { precision: 2, scale: 1 }).default('0.0'),
  
  // 상태
  isVerified: boolean('is_verified').notNull().default(false), // 본인 인증 여부
  isAvailable: boolean('is_available').notNull().default(true), // 서비스 가능 여부
  
  // 타임스탬프
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type CleanerProfile = typeof cleanerProfiles.$inferSelect;
export type NewCleanerProfile = typeof cleanerProfiles.$inferInsert;
```

**Indexes:**
- `user_id` (unique)
- `is_available`, `is_verified` (composite)

---

### 3. available_times (제공자 가능 시간)

```typescript
// server/db/schema/available-times.ts
import { pgTable, text, timestamp, smallint, time } from 'drizzle-orm/pg-core';
import { cleanerProfiles } from './cleaner-profiles';

export const availableTimes = pgTable('available_times', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  profileId: text('profile_id').notNull().references(() => cleanerProfiles.id, { onDelete: 'cascade' }),
  
  // 요일 & 시간
  dayOfWeek: smallint('day_of_week').notNull(), // 0=일요일, 1=월요일, ...
  startTime: time('start_time').notNull(), // "09:00"
  endTime: time('end_time').notNull(),     // "18:00"
  
  isActive: timestamp('is_active').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type AvailableTime = typeof availableTimes.$inferSelect;
export type NewAvailableTime = typeof availableTimes.$inferInsert;
```

**Indexes:**
- `profile_id`, `day_of_week` (composite)

---

### 4. cleaner_service_areas (제공자 서비스 지역)

```typescript
// server/db/schema/cleaner-service-areas.ts
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { cleanerProfiles } from './cleaner-profiles';
import { subAreas } from './areas';

export const cleanerServiceAreas = pgTable('cleaner_service_areas', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  profileId: text('profile_id').notNull().references(() => cleanerProfiles.id, { onDelete: 'cascade' }),
  subAreaId: text('sub_area_id').notNull().references(() => subAreas.id, { onDelete: 'cascade' }),
  
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Unique constraint: (profile_id, sub_area_id)
```

---

### 5. areas & sub_areas (서비스 지역)

```typescript
// server/db/schema/areas.ts
import { pgTable, text, timestamp, integer } from 'drizzle-orm/pg-core';

// 상위 지역 (예: 창원시 의창구)
export const areas = pgTable('areas', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
  
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// 하위 지역 (예: 용지동, 명곡동)
export const subAreas = pgTable('sub_areas', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  areaId: text('area_id').notNull().references(() => areas.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
  
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type Area = typeof areas.$inferSelect;
export type SubArea = typeof subAreas.$inferSelect;
```

**Indexes:**
- `areas`: `sort_order`
- `sub_areas`: `area_id`, `sort_order`

---

### 6. bookings (예약)

```typescript
// server/db/schema/bookings.ts
import { pgTable, text, timestamp, date, time, integer, pgEnum, numeric } from 'drizzle-orm/pg-core';
import { users } from './users';
import { subAreas } from './areas';

export const bookingStatusEnum = pgEnum('booking_status', [
  'pending',      // 대기중 (요청자가 등록, 제공자 미정)
  'confirmed',    // 확정 (제공자가 수락)
  'in_progress',  // 진행중
  'completed',    // 완료
  'cancelled',    // 취소
]);

export const roomTypeEnum = pgEnum('room_type', [
  'oneRoom',
  'twoRoom', 
  'threeRoom',
  'studio',
  'office',
]);

export const bookings = pgTable('bookings', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  
  // 참조
  customerId: text('customer_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  cleanerId: text('cleaner_id').references(() => users.id, { onDelete: 'set null' }), // 수락 전엔 null
  subAreaId: text('sub_area_id').notNull().references(() => subAreas.id),
  
  // 상태
  status: bookingStatusEnum('status').notNull().default('pending'),
  
  // 일정
  scheduledDate: date('scheduled_date').notNull(),
  scheduledTime: time('scheduled_time').notNull(),
  duration: integer('duration').notNull(), // 예상 소요 시간 (시간)
  
  // 주소
  address: text('address').notNull(),        // 도로명 주소
  addressDetail: text('address_detail'),     // 상세 주소 (동/호수 등)
  
  // 방 정보
  roomType: roomTypeEnum('room_type').notNull(),
  roomSize: integer('room_size'), // 평수
  
  // 요청 사항
  services: text('services').notNull().array(), // ["basic_cleaning", "bathroom"]
  description: text('description'),
  budget: integer('budget'), // 희망 예산 (원)
  
  // 완료 정보
  completionPhotos: text('completion_photos').array(),
  completionNotes: text('completion_notes'),
  completedAt: timestamp('completed_at'),
  
  // 취소 정보
  cancelledBy: text('cancelled_by'), // customer | cleaner
  cancelReason: text('cancel_reason'),
  cancelledAt: timestamp('cancelled_at'),
  
  // 타임스탬프
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
```

**Indexes:**
- `customer_id`, `status` (composite)
- `cleaner_id`, `status` (composite)
- `sub_area_id`, `scheduled_date` (composite)
- `scheduled_date`, `scheduled_time`
- `status`, `scheduled_date` (대기중 예약 조회용)

---

### 7. messages (메시지)

```typescript
// server/db/schema/messages.ts
import { pgTable, text, timestamp, pgEnum, boolean } from 'drizzle-orm/pg-core';
import { bookings } from './bookings';
import { users } from './users';

export const messageTypeEnum = pgEnum('message_type', ['text', 'image', 'system']);

export const messages = pgTable('messages', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  bookingId: text('booking_id').notNull().references(() => bookings.id, { onDelete: 'cascade' }),
  senderId: text('sender_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  
  type: messageTypeEnum('type').notNull().default('text'),
  content: text('content').notNull(),
  imageUrl: text('image_url'),
  
  isRead: boolean('is_read').notNull().default(false),
  readAt: timestamp('read_at'),
  
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
```

**Indexes:**
- `booking_id`, `created_at` (composite, 메시지 목록 조회)
- `sender_id`

---

### 8. reviews (리뷰)

```typescript
// server/db/schema/reviews.ts
import { pgTable, text, timestamp, smallint, boolean } from 'drizzle-orm/pg-core';
import { bookings } from './bookings';
import { users } from './users';

export const reviews = pgTable('reviews', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  bookingId: text('booking_id').notNull().references(() => bookings.id, { onDelete: 'cascade' }).unique(),
  
  // 작성자 → 수신자 (양방향 리뷰)
  authorId: text('author_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  recipientId: text('recipient_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  
  // 내용
  rating: smallint('rating').notNull(), // 1-5
  content: text('content').notNull(),
  
  // 태그 (JSON array로 저장)
  tags: text('tags').array(), // ["친절해요", "꼼꼼해요"]
  
  // 수정 가능 여부
  canEdit: boolean('can_edit').notNull().default(true), // 24시간 후 false
  
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
```

**Indexes:**
- `booking_id` (unique)
- `author_id`
- `recipient_id`, `created_at` (composite, 사용자 리뷰 목록)

---

### 9. notifications (알림)

```typescript
// server/db/schema/notifications.ts
import { pgTable, text, timestamp, pgEnum, boolean } from 'drizzle-orm/pg-core';
import { users } from './users';

export const notificationTypeEnum = pgEnum('notification_type', [
  'booking_created',     // 새 예약 요청 (제공자용)
  'booking_accepted',    // 예약 수락됨 (요청자용)
  'booking_rejected',    // 예약 거절됨 (요청자용)
  'booking_cancelled',   // 예약 취소됨
  'booking_reminder',    // 예약 리마인더
  'booking_completed',   // 청소 완료
  'new_message',         // 새 메시지
  'new_review',          // 새 리뷰
]);

export const notifications = pgTable('notifications', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  
  type: notificationTypeEnum('type').notNull(),
  title: text('title').notNull(),
  body: text('body').notNull(),
  
  // 관련 리소스
  relatedType: text('related_type'), // 'booking' | 'message' | 'review'
  relatedId: text('related_id'),
  
  isRead: boolean('is_read').notNull().default(false),
  readAt: timestamp('read_at'),
  
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;
```

**Indexes:**
- `user_id`, `is_read` (composite)
- `user_id`, `created_at` (composite)

---

## 📁 스키마 파일 구조

```
apps/web/server/db/
├── index.ts              # Drizzle 클라이언트 export
├── schema/
│   ├── index.ts          # 모든 스키마 export
│   ├── users.ts
│   ├── cleaner-profiles.ts
│   ├── available-times.ts
│   ├── cleaner-service-areas.ts
│   ├── areas.ts
│   ├── bookings.ts
│   ├── messages.ts
│   ├── reviews.ts
│   └── notifications.ts
└── migrations/           # Drizzle Kit이 생성
```

---

## 🔗 관계 정의 (Relations)

```typescript
// server/db/schema/relations.ts
import { relations } from 'drizzle-orm';
import { users, cleanerProfiles, availableTimes, cleanerServiceAreas, areas, subAreas, bookings, messages, reviews, notifications } from './index';

// Users
export const usersRelations = relations(users, ({ one, many }) => ({
  cleanerProfile: one(cleanerProfiles, {
    fields: [users.id],
    references: [cleanerProfiles.userId],
  }),
  customerBookings: many(bookings, { relationName: 'customer' }),
  cleanerBookings: many(bookings, { relationName: 'cleaner' }),
  sentMessages: many(messages, { relationName: 'sender' }),
  writtenReviews: many(reviews, { relationName: 'author' }),
  receivedReviews: many(reviews, { relationName: 'recipient' }),
  notifications: many(notifications),
}));

// Cleaner Profiles
export const cleanerProfilesRelations = relations(cleanerProfiles, ({ one, many }) => ({
  user: one(users, {
    fields: [cleanerProfiles.userId],
    references: [users.id],
  }),
  availableTimes: many(availableTimes),
  serviceAreas: many(cleanerServiceAreas),
}));

// Areas
export const areasRelations = relations(areas, ({ many }) => ({
  subAreas: many(subAreas),
}));

export const subAreasRelations = relations(subAreas, ({ one, many }) => ({
  area: one(areas, {
    fields: [subAreas.areaId],
    references: [areas.id],
  }),
  bookings: many(bookings),
  cleanerServices: many(cleanerServiceAreas),
}));

// Bookings
export const bookingsRelations = relations(bookings, ({ one, many }) => ({
  customer: one(users, {
    fields: [bookings.customerId],
    references: [users.id],
    relationName: 'customer',
  }),
  cleaner: one(users, {
    fields: [bookings.cleanerId],
    references: [users.id],
    relationName: 'cleaner',
  }),
  subArea: one(subAreas, {
    fields: [bookings.subAreaId],
    references: [subAreas.id],
  }),
  messages: many(messages),
  review: one(reviews, {
    fields: [bookings.id],
    references: [reviews.bookingId],
  }),
}));

// Messages
export const messagesRelations = relations(messages, ({ one }) => ({
  booking: one(bookings, {
    fields: [messages.bookingId],
    references: [bookings.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
    relationName: 'sender',
  }),
}));

// Reviews
export const reviewsRelations = relations(reviews, ({ one }) => ({
  booking: one(bookings, {
    fields: [reviews.bookingId],
    references: [bookings.id],
  }),
  author: one(users, {
    fields: [reviews.authorId],
    references: [users.id],
    relationName: 'author',
  }),
  recipient: one(users, {
    fields: [reviews.recipientId],
    references: [users.id],
    relationName: 'recipient',
  }),
}));

// Notifications
export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));
```

---

## 🗄️ Drizzle 설정

```typescript
// drizzle.config.ts
import type { Config } from 'drizzle-kit';

export default {
  schema: './apps/web/server/db/schema/*.ts',
  out: './apps/web/server/db/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
```

---

## 📦 패키지 의존성

```json
{
  "dependencies": {
    "drizzle-orm": "^0.29.0",
    "postgres": "^3.4.0"
  },
  "devDependencies": {
    "drizzle-kit": "^0.20.0"
  }
}
```

---

## ⚡ 쿼리 최적화 전략

### 1. 인덱스 활용
- 사용자 이메일, OAuth ID 조회 → unique index
- 예약 목록 조회 → composite index (`status`, `scheduled_date`)
- 메시지 조회 → composite index (`booking_id`, `created_at`)

### 2. 조인 최소화
- 드물게 변경되는 지역 정보는 앱 레벨 캐싱 고려
- 리뷰 통계는 `cleaner_profiles`에 денormalized 컬럼 유지

### 3. 페이지네이션
- 커서 기반 페이지네이션 권장 (무한 스크롤용)
- 오프셋 기반은 관리자 대시보드용

---

## 🔄 마이그레이션 전략

```bash
# 스키마 변경 감지
pnpm drizzle-kit generate

# 마이그레이션 실행
pnpm drizzle-kit migrate

# 스키마 push (개발용)
pnpm drizzle-kit push
```

---

## ✅ 체크리스트

- [x] Users 테이블 (OAuth 지원)
- [x] CleanerProfiles 테이블 (제공자 프로필)
- [x] AvailableTimes 테이블 (가능 시간)
- [x] Areas/SubAreas 테이블 (서비스 지역)
- [x] CleanerServiceAreas 테이블 (제공자-지역 매핑)
- [x] Bookings 테이블 (예약)
- [x] Messages 테이블 (메시지)
- [x] Reviews 테이블 (리뷰)
- [x] Notifications 테이블 (알림)
- [x] Relations 정의
- [x] 인덱스 전략
- [x] 마이그레이션 설정

---

## 📝 다음 단계

- [ ] 04. 모바일 앱 화면 설계
- [ ] 06. UI/UX 테마 & 디자인 시스템
