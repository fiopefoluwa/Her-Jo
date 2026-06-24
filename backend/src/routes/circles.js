import { Router } from "express";
import { circles, users, recentActivity } from "../data/mockData.js";

const router = Router();

// Fallback names for generating circle members
const fallbackMembers = [
  { name: "Bisi Adekunle", avatar: "BA" },
  { name: "Chika Nwosu", avatar: "CN" },
  { name: "Dami Okonkwo", avatar: "DO" },
  { name: "Ese Ogbonna", avatar: "EO" },
  { name: "Funmi Adeleke", avatar: "FA" },
  { name: "Grace Udoka", avatar: "GU" },
  { name: "Helen Chukwu", avatar: "HC" },
  { name: "Ifeoma Egwu", avatar: "IE" },
  { name: "Joy Nnaji", avatar: "JN" },
  { name: "Kemi Alao", avatar: "KA" }
];

// Helper to format dates like "Jan 15, 2026"
const formatCycleDate = (monthsToAdd) => {
  const date = new Date();
  date.setMonth(date.getMonth() + monthsToAdd);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[date.getMonth()]} 15, ${date.getFullYear()}`;
};

// GET /api/circles — List all savings circles
router.get("/", (req, res) => {
  // Return circles with summary information (keep list light but descriptive)
  const summary = circles.map(({ membersList, rotationSchedule, ...circle }) => circle);
  res.json(summary);
});

// GET /api/circles/:id — Get single circle with full details
router.get("/:id", (req, res) => {
  const circle = circles.find((c) => c.id === req.params.id);
  if (!circle) {
    return res.status(404).json({ error: "Circle not found" });
  }
  res.json(circle);
});

// POST /api/circles — Create a new circle
router.post("/", (req, res) => {
  const { name, description, monthlyContribution, members } = req.body;
  
  if (!name || !monthlyContribution) {
    return res.status(400).json({ error: "Name and monthly contribution are required" });
  }

  const contributionNum = Number(monthlyContribution);
  const membersNum = Number(members) || 6;
  const totalPool = contributionNum * membersNum;

  // 1. Generate members list
  // The first member is always the logged-in user (Amina Okafor)
  const membersList = [
    { id: 1, name: "Amina Okafor", trustScore: users["user-1"].trustScore, status: "pending", avatar: "AO", isYou: true }
  ];

  // Add other members up to the requested count
  for (let i = 0; i < membersNum - 1; i++) {
    const fallback = fallbackMembers[i % fallbackMembers.length];
    membersList.push({
      id: i + 2,
      name: fallback.name,
      trustScore: Math.floor(Math.random() * 15) + 80, // Random trust score 80-95
      status: "pending",
      avatar: fallback.avatar,
      isYou: false
    });
  }

  // 2. Generate rotation schedule
  const rotationSchedule = [
    { position: 1, name: "Amina Okafor", status: "active", date: formatCycleDate(0) }
  ];

  for (let i = 0; i < membersNum - 1; i++) {
    const fallback = fallbackMembers[i % fallbackMembers.length];
    rotationSchedule.push({
      position: i + 2,
      name: fallback.name,
      status: "upcoming",
      date: formatCycleDate(i + 1)
    });
  }

  const newCircle = {
    id: `circle-${Date.now()}`,
    name,
    description: description || "A culturally grounded savings circle.",
    members: membersNum,
    monthlyContribution: contributionNum,
    monthlyContributionFormatted: `₦${contributionNum.toLocaleString()}`,
    totalPool: totalPool,
    totalPoolFormatted: `₦${totalPool.toLocaleString()}`,
    nextPayout: "You",
    daysUntilPayout: 15,
    status: "active",
    currentCycle: 1,
    totalCycles: membersNum,
    startDate: new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + membersNum)).toLocaleDateString("en-US", { month: "long", year: "numeric" }),
    membersList,
    rotationSchedule,
  };

  circles.push(newCircle);

  // Add creation to recent activity
  recentActivity.unshift({
    id: `act-${Date.now()}`,
    action: "Circle started",
    circle: name,
    circleId: newCircle.id,
    amount: null,
    amountFormatted: "—",
    date: "Just now",
    timestamp: new Date().toISOString(),
    userId: "user-1",
  });

  res.status(201).json(newCircle);
});

// POST /api/circles/:id/payout — Trigger payout for the active member in rotation
router.post("/:id/payout", (req, res) => {
  const { id } = req.params;
  const circle = circles.find((c) => c.id === id);

  if (!circle) {
    return res.status(404).json({ error: "Circle not found" });
  }

  // Find the active position in the rotation schedule
  const activeIndex = circle.rotationSchedule.findIndex((r) => r.status === "active");
  
  if (activeIndex === -1) {
    return res.status(400).json({ error: "No active payout slot found" });
  }

  const activePayout = circle.rotationSchedule[activeIndex];
  
  // 1. Mark current active as completed
  activePayout.status = "completed";

  // Mark the corresponding member as paid
  const paidMember = circle.membersList.find((m) => m.name === activePayout.name);
  if (paidMember) {
    paidMember.status = "paid";
  }

  // 2. Set the next position in schedule to active
  let nextPayoutName = "None";
  let nextPayoutIsYou = false;
  const nextIndex = activeIndex + 1;

  if (nextIndex < circle.rotationSchedule.length) {
    const nextPayout = circle.rotationSchedule[nextIndex];
    nextPayout.status = "active";
    nextPayoutName = nextPayout.name;
    if (nextPayout.name === "Amina Okafor") {
      nextPayoutIsYou = true;
    }
    
    // Reset all members' payment statuses to pending for the next cycle
    circle.membersList.forEach((member) => {
      // Except for members who already received payouts or keep it simple: reset for the new slot
      member.status = "pending";
    });

    circle.currentCycle = nextIndex + 1;
    circle.nextPayout = nextPayoutIsYou ? "You" : nextPayoutName;
    circle.daysUntilPayout = 30; // reset days
  } else {
    // Circle rotation finished!
    circle.status = "completed";
    circle.nextPayout = "Completed";
    circle.daysUntilPayout = 0;
  }

  // 3. Log a "Payout completed" action to activities
  const payoutActivity = {
    id: `act-${Date.now()}`,
    action: "Payout completed",
    circle: circle.name,
    circleId: circle.id,
    amount: circle.totalPool,
    amountFormatted: circle.totalPoolFormatted,
    date: "Just now",
    timestamp: new Date().toISOString(),
    userId: "user-1",
    recipient: activePayout.name
  };
  recentActivity.unshift(payoutActivity);

  res.json({
    message: `Payout successfully completed for ${activePayout.name}`,
    circle,
    activity: payoutActivity
  });
});

export default router;
