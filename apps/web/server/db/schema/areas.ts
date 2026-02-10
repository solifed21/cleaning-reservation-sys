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
