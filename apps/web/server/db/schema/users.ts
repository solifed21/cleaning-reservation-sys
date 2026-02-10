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
