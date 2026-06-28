import { USE_MOCK_DATA } from "../config/mockMode";
import { mockCurrentUser } from "./mockUser";
import { mockCircles } from "./mockCircles";
import { mockContributions } from "./mockContributions";

const state = {
  circles: [...mockCircles],
  contributions: [...mockContributions],
};

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function jsonResponse(data) {
  return {
    ok: true,
    status: 200,
    json: async () => data,
  };
}

function errorResponse(error, status = 400) {
  return {
    ok: false,
    status,
    json: async () => ({ error }),
  };
}

function computeTrustScore(addedAmount) {
  const base = mockCurrentUser.trustScore;
  const bump = Math.min(20, Math.floor(addedAmount / 50000));
  return Math.min(100, base + bump);
}

function generateInviteCode(circleName) {
  const prefix = circleName.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, "X");
  const suffix = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}-${suffix}`;
}

export function isMockEnabled() {
  return USE_MOCK_DATA;
}

export async function mockFetch(url, options = {}) {
  if (!USE_MOCK_DATA) {
    throw new Error("Mock fetch called while USE_MOCK_DATA=false");
  }

  await delay(100);

  const method = (options.method || "GET").toUpperCase();

  // GET /api/auth/me — returns the static authenticated user
  if (method === "GET" && (url === "/api/auth/me" || url === "/api/users/me")) {
    return jsonResponse({ ...mockCurrentUser });
  }

  // GET /api/users/:id
  if (method === "GET" && url.startsWith("/api/users/")) {
    return jsonResponse({ ...mockCurrentUser });
  }

  // GET /api/circles
  if (method === "GET" && url === "/api/circles") {
    return jsonResponse(state.circles.map((c) => ({
      ...c,
      nextPayoutLabel: c.nextPayoutLabel || (c.nextPayout === "You" ? "Your Turn Soon" : c.nextPayout),
    })));
  }

  // GET /api/circles/:id
  if (method === "GET" && url.match(/^\/api\/circles\/[^/]+$/)) {
    const id = url.split("/api/circles/")[1];
    const found = state.circles.find((c) => c.id === id);
    if (!found) return errorResponse("Circle not found", 404);
    return jsonResponse(found);
  }

  // POST /api/circles — creator always becomes the leader
  if (method === "POST" && url === "/api/circles") {
    const body = JSON.parse(options.body || "{}");

    const id = `circle-${Date.now()}`;
    const monthlyContribution = Number(body.monthlyContribution || 0);
    const totalPool = monthlyContribution * Number(body.members || 2);
    const inviteCode = generateInviteCode(body.name || "CIR");
    const inviteLink = `https://herjo.app/join/${inviteCode}`;

    const circle = {
      id,
      name: body.name || "Untitled Circle",
      description: body.description || "",
      monthlyContribution,
      monthlyContributionFormatted: `₦${monthlyContribution.toLocaleString()}`,
      frequency: "Monthly",
      totalPool,
      totalPoolFormatted: `₦${totalPool.toLocaleString()}`,
      members: Number(body.members || 6),
      currentCycle: 1,
      totalCycles: 8,
      startDate: "Jan 2026",
      endDate: null,
      nextPayout: "You",
      daysUntilPayout: 5,
      status: "active",
      rotationSchedule: [
        { position: 1, name: mockCurrentUser.name, date: "Jan 15", status: "completed" },
        { position: 2, name: "Bisi Adekunle", date: "Feb 15", status: "active" },
        { position: 3, name: "Chika Nwosu", date: "Mar 15", status: "upcoming" },
      ],
      membersList: [
        {
          id: "m1",
          name: mockCurrentUser.name,
          avatar: mockCurrentUser.avatar,
          trustScore: mockCurrentUser.trustScore,
          status: "pending",
          isYou: true,
          role: "leader",
        },
        { id: "m2", name: "Bisi Adekunle", avatar: "BA", trustScore: 80, status: "upcoming", isYou: false, role: "member" },
      ],
      currentUserRole: "leader",
      leaderId: mockCurrentUser.id,
      inviteCode,
      inviteLink,
    };

    state.circles.unshift(circle);

    // Add a creation activity entry
    state.contributions.unshift({
      id: `act-${Date.now()}`,
      circleId: id,
      userId: mockCurrentUser.id,
      amount: null,
      amountFormatted: null,
      date: new Date().toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" }),
      action: `${mockCurrentUser.name} created ${circle.name}`,
      circle: circle.name,
    });

    return jsonResponse(circle);
  }

  // GET /api/contributions
  if (method === "GET" && url === "/api/contributions") {
    return jsonResponse(state.contributions);
  }

  // POST /api/circles/:id/invite (mock)
  if (method === "POST" && url.match(/^\/api\/circles\/[^/]+\/invite$/)) {
    // In mock mode, generate a general join link that anyone with the link can use.
    const circleId = url.split("/api/circles/")[1].split("/invite")[0];

    // Keep it deterministic enough for debugging, but still unique.
    const seed = circleId + "-" + Date.now();
    const suffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    const code = `JOIN-${suffix}`;
    const inviteUrl = `https://herjo.app/join/${code}`;

    return jsonResponse({
      inviteUrl,
      email: null,
      code,
    });
  }

  // POST /api/contributions
  if (method === "POST" && url === "/api/contributions") {

    const body = JSON.parse(options.body || "{}");
    const { circleId, amount } = body;
    const added = Number(amount || 0);

    const circle = state.circles.find((c) => c.id === circleId);
    const circleName = circle?.name || "Unknown Circle";

    const id = `con_${Date.now()}`;
    const contribution = {
      id,
      circleId,
      userId: mockCurrentUser.id,
      amount: added,
      amountFormatted: `₦${added.toLocaleString()}`,
      date: new Date().toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" }),
      action: `${mockCurrentUser.name} contributed ₦${added.toLocaleString()}`,
      circle: circleName,
    };

    state.contributions.unshift(contribution);

    if (circle?.membersList?.length) {
      circle.membersList = circle.membersList.map((m) =>
        m.isYou ? { ...m, status: "paid" } : m
      );
    }

    const trustScore = computeTrustScore(added);
    return jsonResponse({
      user: { trustScore },
      contribution,
    });
  }

  // POST /api/circles/:id/payout
  if (method === "POST" && url.endsWith("/payout")) {
    return jsonResponse({ message: "Payout triggered successfully!" });
  }

  return errorResponse(`Unknown mock endpoint: ${url}`, 404);
}
