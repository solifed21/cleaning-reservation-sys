import { pgTable, text, timestamp, smallint, time } from 'drizzle-orm/pg-core';
import { cleanerProfiles } from './cleaner-profiles';

export const availableTimes = pgTable('available_times', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  profileId: text('profile_id').notNull().references(() => cleanerProfiles.id, { onDelete: 'cascade' }),
  
  // 요일 & 시간
  dayOfWeek: smallint('day_of_week').notNull(), // 0=일요일, 1=월요일, ...
  startTime: time('start_time').notNull(), // "09:00"
  endTime: time('end_time').notNull(),     // "18:00"
  
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type AvailableTime = typeof availableTimes.$inferSelect;
export type NewAvailableTime = typeof availableTimes.$inferInsert;
