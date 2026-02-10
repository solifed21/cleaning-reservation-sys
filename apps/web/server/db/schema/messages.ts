import { pgTable, text, timestamp, pgEnum, boolean, index } from 'drizzle-orm/pg-core';
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
}, (table) => ({
  bookingCreatedIdx: index('messages_booking_created_idx').on(table.bookingId, table.createdAt),
}));

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
