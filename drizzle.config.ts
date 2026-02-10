import type { Config } from 'drizzle-kit';

export default {
  schema: './apps/web/server/db/schema/*.ts',
  out: './apps/web/server/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
