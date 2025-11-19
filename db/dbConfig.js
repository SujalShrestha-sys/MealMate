import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: ["errors", "query"],
});

export default prisma;
