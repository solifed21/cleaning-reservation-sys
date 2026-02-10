import { pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { cleanerProfiles } from './cleaner-profiles';
import { subAreas } from './areas';

export const cleanerServiceAreas = pgTable('cleaner_service_areas', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  profileId: text('profile_id').notNull().references(() => cleanerProfiles.id, { onDelete: 'cascade' }),
  subAreaId: text('sub_area_id').notNull().references(() => subAreas.id, { onDelete: 'cascade' }),
  
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  uniqueProfileSubArea: uniqueIndex('cleaner_service_areas_profile_sub_area_idx').on(table.profileId, table.subAreaId),
}));

export type CleanerServiceArea = typeof cleanerServiceAreas.$inferSelect;
export type NewCleanerServiceArea = typeof cleanerServiceAreas.$inferInsert;
