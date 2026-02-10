import { pgTable, text, timestamp, smallint, boolean, index, uniqueIndex } from 'drizzle-orm/pg-core';
import { bookings } from './bookings';
import { users } from './users';

export const reviewTagEnum = pgEnum('review_tag', [
  '친절해요',
  '시간 준수',
  '꼼꼼해요',
  '깨끗해요',
  '추천해요',
]);

export const reviews = pgTable('reviews', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  bookingId: text('booking_id').notNull().references(() => bookings.id, { onDelete: 'cascade' }).unique(),
  
  // 작성자 → 수신자 (양방향 리뷰)
  authorId: text('author_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  recipientId: text('recipient_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  
  // 내용
  rating: smallint('rating').notNull(), // 1-5
  content: text('content').notNull(),
  
  // 태그
  tags: text('tags').array(), // ["친절해요", "꼼꼼해요"]
  
  // 수정 가능 여부
  canEdit: boolean('can_edit').notNull().default(true), // 24시간 후 false
  
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  authorIdx: index('reviews_author_idx').on(table.authorId),
  recipientCreatedIdx: index('reviews_recipient_created_idx').on(table.recipientId, table.createdAt),
}));

export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
