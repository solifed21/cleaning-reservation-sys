import { pgTable, text, timestamp, date, time, integer, pgEnum, index } from 'drizzle-orm/pg-core';
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

export const serviceTypeEnum = pgEnum('service_type', [
  'basic_cleaning',     // 기본 청소
  'bathroom',           // 욕실 청소
  'kitchen',            // 주방 청소
  'window',             // 창문 청소
  'move_in',            // 입주 청소
  'move_out',           // 이주 청소
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
}, (table) => ({
  customerStatusIdx: index('bookings_customer_status_idx').on(table.customerId, table.status),
  cleanerStatusIdx: index('bookings_cleaner_status_idx').on(table.cleanerId, table.status),
  subAreaDateIdx: index('bookings_sub_area_date_idx').on(table.subAreaId, table.scheduledDate),
  statusDateIdx: index('bookings_status_date_idx').on(table.status, table.scheduledDate),
}));

export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
