import "dotenv/config";
import { defineConfig } from "prisma/config";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
const { Pool } = pg;

const connectionString = process.env.DATABASE_URL || "";
const useSsl = connectionString.includes("render.com") || process.env.NODE_ENV === "production";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: connectionString,
  },
  migrate: {
    adapter: () => {
      const pool = new Pool({
        connectionString,
        ssl: useSsl ? { rejectUnauthorized: false } : false,
      });
      return new PrismaPg(pool);
    },
  },
});
