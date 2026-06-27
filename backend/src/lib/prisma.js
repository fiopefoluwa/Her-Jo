import "dotenv/config";
import pg from "pg";
const { Pool } = pg;
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";

const globalForPrisma = globalThis;

const connectionString = process.env.DATABASE_URL;
const useSsl = connectionString && (connectionString.includes("render.com") || process.env.NODE_ENV === "production");

const pool = globalForPrisma.pgPool ?? new Pool({
  connectionString,
  ssl: useSsl ? { rejectUnauthorized: false } : false
});
const adapter = new PrismaPg(pool);

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.pgPool = pool;
  globalForPrisma.prisma = prisma;
}

export default prisma;
