import { pgTable, text, timestamp, pgEnum, boolean, index } from 'drizzle-orm/pg-core';
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
}, (table) => ({
  userReadIdx: index('notifications_user_read_idx').on(table.userId, table.isRead),
  userCreatedIdx: index('notifications_user_created_idx').on(table.userId, table.createdAt),
}));

export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;
