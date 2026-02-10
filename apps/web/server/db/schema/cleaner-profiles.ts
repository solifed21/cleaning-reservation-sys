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
