/**
 * Database seed script
 * Run with: npm run db:seed
 *
 * Creates:
 *  - Demo user: Amina Okafor (amina@herjo.app / herjo123)
 *  - 3 savings circles with realistic rotation schedules
 *  - Seed activity entries
 */

import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../generated/prisma/client.js";

const url = process.env.DATABASE_URL ?? "file:./herjo.db";
const adapter = new PrismaBetterSqlite3({ url });
const prisma = new PrismaClient({ adapter });



async function main() {
  console.log("\n🌱 Seeding HerJo database...\n");

  // ── 1. Create demo users ──────────────────────────────────────────────────

  const passwordHash = await bcrypt.hash("herjo123", 12);

  // Check if already seeded
  const existing = await prisma.user.findUnique({ where: { email: "amina@herjo.app" } });
  if (existing) {
    console.log("  ⚠️  Database already seeded. Skipping.\n  Run `npx prisma migrate reset` to start fresh.\n");
    return;
  }

  const amina = await prisma.user.create({
    data: {
      name: "Amina Okafor",
      email: "amina@herjo.app",
      phone: "08012345678",
      passwordHash,
      avatar: "AO",
      trustScore: 87,
      joinedDate: new Date("2024-03-15"),
    },
  });

  // Create additional demo members (no login — they're other circle members)
  const otherMembers = await Promise.all([
    prisma.user.create({ data: { name: "Bisi Adekunle",  email: "bisi@herjo.local",  passwordHash, avatar: "BA", trustScore: 92 } }),
    prisma.user.create({ data: { name: "Chika Nwosu",    email: "chika@herjo.local",  passwordHash, avatar: "CN", trustScore: 78 } }),
    prisma.user.create({ data: { name: "Dami Okonkwo",   email: "dami@herjo.local",   passwordHash, avatar: "DO", trustScore: 85 } }),
    prisma.user.create({ data: { name: "Ese Ogbonna",    email: "ese@herjo.local",    passwordHash, avatar: "EO", trustScore: 90 } }),
    prisma.user.create({ data: { name: "Funmi Adeleke",  email: "funmi@herjo.local",  passwordHash, avatar: "FA", trustScore: 88 } }),
    prisma.user.create({ data: { name: "Grace Udoka",    email: "grace@herjo.local",  passwordHash, avatar: "GU", trustScore: 82 } }),
    prisma.user.create({ data: { name: "Helen Chukwu",   email: "helen@herjo.local",  passwordHash, avatar: "HC", trustScore: 94 } }),
    prisma.user.create({ data: { name: "Ifeoma Egwu",    email: "ifeoma@herjo.local", passwordHash, avatar: "IE", trustScore: 80 } }),
    prisma.user.create({ data: { name: "Joy Nnaji",      email: "joy@herjo.local",    passwordHash, avatar: "JN", trustScore: 86 } }),
  ]);

  console.log(`  ✅ Created ${1 + otherMembers.length} users`);

  // ── 2. Circle 1: Market Women Alliance (8 members) ───────────────────────

  const startJan = new Date("2026-01-01");
  const circle1 = await prisma.circle.create({
    data: {
      name: "Market Women Alliance",
      description: "A trusted circle of market traders supporting each other's business growth",
      monthlyContribution: 50000,
      totalCycles: 8,
      startDate: startJan,
      endDate: new Date("2026-08-31"),
      status: "active",
    },
  });

  const c1Members = [amina, ...otherMembers.slice(0, 7)];
  for (let i = 0; i < c1Members.length; i++) {
    const payoutDate = new Date("2026-01-15");
    payoutDate.setMonth(payoutDate.getMonth() + i);
    const alreadyPaid = i === 0; // Amina received first payout
    await prisma.circleMember.create({
      data: {
        userId: c1Members[i].id,
        circleId: circle1.id,
        position: i + 1,
        memberStatus: i === 1 ? "pending" : "paid", // Bisi is next
        scheduledPayoutDate: payoutDate,
        payoutReceived: alreadyPaid,
        payoutReceivedAt: alreadyPaid ? new Date("2026-01-15") : null,
      },
    });
  }
  console.log(`  ✅ Created circle: ${circle1.name}`);

  // ── 3. Circle 2: Tech Sisters Savings (6 members) ────────────────────────

  const startDec = new Date("2025-12-01");
  const circle2 = await prisma.circle.create({
    data: {
      name: "Tech Sisters Savings",
      description: "Women in tech pooling resources for professional growth",
      monthlyContribution: 75000,
      totalCycles: 6,
      startDate: startDec,
      endDate: new Date("2026-05-31"),
      status: "active",
    },
  });

  const c2Members = [...otherMembers.slice(0, 3), amina, ...otherMembers.slice(3, 6)];
  for (let i = 0; i < c2Members.length; i++) {
    const payoutDate = new Date("2025-12-15");
    payoutDate.setMonth(payoutDate.getMonth() + i);
    const alreadyPaid = i < 3;
    await prisma.circleMember.create({
      data: {
        userId: c2Members[i].id,
        circleId: circle2.id,
        position: i + 1,
        memberStatus: i === 3 ? "pending" : "paid",
        scheduledPayoutDate: payoutDate,
        payoutReceived: alreadyPaid,
        payoutReceivedAt: alreadyPaid ? new Date() : null,
      },
    });
  }
  console.log(`  ✅ Created circle: ${circle2.name}`);

  // ── 4. Circle 3: Traders Circle (10 members) ─────────────────────────────

  const startOct = new Date("2025-10-01");
  const circle3 = await prisma.circle.create({
    data: {
      name: "Traders Circle",
      description: "A community of traders saving towards shared goals",
      monthlyContribution: 30000,
      totalCycles: 10,
      startDate: startOct,
      endDate: new Date("2026-07-31"),
      status: "active",
    },
  });

  const c3Members = [...otherMembers.slice(0, 6), amina, ...otherMembers.slice(6, 9)];
  for (let i = 0; i < c3Members.length; i++) {
    const payoutDate = new Date("2025-10-15");
    payoutDate.setMonth(payoutDate.getMonth() + i);
    const alreadyPaid = i < 6;
    await prisma.circleMember.create({
      data: {
        userId: c3Members[i].id,
        circleId: circle3.id,
        position: i + 1,
        memberStatus: i === 6 ? "pending" : "paid",
        scheduledPayoutDate: payoutDate,
        payoutReceived: alreadyPaid,
        payoutReceivedAt: alreadyPaid ? new Date() : null,
      },
    });
  }
  console.log(`  ✅ Created circle: ${circle3.name}`);

  // ── 5. Seed activity entries ──────────────────────────────────────────────

  await prisma.activity.createMany({
    data: [
      {
        userId: amina.id,
        circleId: circle1.id,
        action: "Contribution received",
        amount: 50000,
        metadata: JSON.stringify({ circleName: "Market Women Alliance" }),
        createdAt: new Date(Date.now() - 2 * 86400000),
      },
      {
        userId: amina.id,
        circleId: circle2.id,
        action: "Payout completed",
        amount: 450000,
        metadata: JSON.stringify({ circleName: "Tech Sisters Savings", recipient: "Amina Okafor" }),
        createdAt: new Date(Date.now() - 7 * 86400000),
      },
      {
        userId: amina.id,
        circleId: circle3.id,
        action: "Circle started",
        metadata: JSON.stringify({ circleName: "Traders Circle" }),
        createdAt: new Date(Date.now() - 14 * 86400000),
      },
    ],
  });

  // Seed a contribution record so totalSaved shows correctly
  await prisma.contribution.create({
    data: { userId: amina.id, circleId: circle1.id, amount: 340000 },
  });

  console.log("  ✅ Seeded activity + contribution records");
  console.log("\n🎉 Seed complete!\n");
  console.log("  Demo login:");
  console.log("  Email:    amina@herjo.app");
  console.log("  Password: herjo123\n");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
