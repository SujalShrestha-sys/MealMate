import "dotenv/config";
import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
const { Pool } = pg;

// This ensures we only have one instance of Prisma in development
// to avoid "Too many database connections" errors.
if (!global.prisma) {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  const isLocalHost =
    process.env.DATABASE_URL.includes("localhost") ||
    process.env.DATABASE_URL.includes("127.0.0.1");

  // Keep pool size simple and configurable:
  // - use DB_POOL_MAX if provided
  // - otherwise use a safer default than 2
  const parsedPoolMax = Number(process.env.DB_POOL_MAX);
  const poolMax =
    Number.isInteger(parsedPoolMax) && parsedPoolMax > 0
      ? parsedPoolMax
      : process.env.NODE_ENV === "production"
        ? 10
        : 5;

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: isLocalHost ? false : { rejectUnauthorized: false },
    max: poolMax,
  });

  const adapter = new PrismaPg(pool);
  global.prisma = new PrismaClient({ adapter });
}

export default global.prisma;
