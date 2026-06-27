import { USE_MOCK_DATA } from "../config/mockMode";
import { mockUser } from "./mockUser";
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

function computeTrustScoreForUser(userId, addedAmount) {
  // Lightweight deterministic mock.
  // Keep payload shape consistent with real backend expectations.
  const base = mockUser.trustScore;
  const bump = Math.min(20, Math.floor(addedAmount / 50000));
  return Math.max(0, base + bump);
}

export function isMockEnabled() {
  return USE_MOCK_DATA;
}

export async function mockFetch(url, options = {}) {
  if (!USE_MOCK_DATA) {
    throw new Error("Mock fetch called while USE_MOCK_DATA=false");
  }

  // Small delay to mimic network
  await delay(100);

  const method = (options.method || "GET").toUpperCase();

  // GET /api/users/:id
  if (method === "GET" && url.startsWith("/api/users/")) {
    return jsonResponse({ ...mockUser });
  }

  // GET /api/circles
  if (method === "GET" && url === "/api/circles") {
    return jsonResponse(state.circles.map((c) => ({
      ...c,
      nextPayoutLabel: c.nextPayoutLabel || (c.nextPayout === "You" ? "Your Turn Soon" : c.nextPayout),
    })));
  }

  // GET /api/circles/:id
  if (method === "GET" && url.startsWith("/api/circles/")) {
    const id = url.split("/api/circles/")[1];
    const found = state.circles.find((c) => c.id === id);
    if (!found) return errorResponse("Circle not found", 404);
    return jsonResponse(found);
  }

  // POST /api/circles
  if (method === "POST" && url === "/api/circles") {
    const body = JSON.parse(options.body || "{}");

    const id = `circle-${Date.now()}`;

    const monthlyContribution = Number(body.monthlyContribution || 0);
    const totalPool = monthlyContribution * Number(body.members || 2) * 1; // simple

    const leaderRole = "leader";
    const memberRole = "member";
    // Role is for dev/testing; defaults to leader.
    const currentUserRole = body.role || body.currentUserRole || leaderRole;

    const circle = {
      id,
      name: body.name || "Untitled Circle",
      description: body.description || "",
      monthlyContribution,
      monthlyContributionFormatted: `₦${monthlyContribution.toLocaleString()}`,
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
        { position: 1, name: "Amina Okafor", date: "Jan 15", status: "completed" },
        { position: 2, name: "Bisi Adekunle", date: "Feb 15", status: "active" },
        { position: 3, name: "Chika Nwosu", date: "Mar 15", status: "upcoming" },
      ],
      // Provide membersList with role-based current user status.
      membersList: [
        {
          id: "m1",
          name: "Amina Okafor",
          avatar: "AO",
          trustScore: 87,
          status: "pending",
          isYou: true,
          role: currentUserRole,
        },
        { id: "m2", name: "Bisi Adekunle", avatar: "BA", trustScore: 80, status: "upcoming", isYou: false, role: memberRole },
      ],
      currentUserRole,
    };


    state.circles.unshift(circle);
    return jsonResponse(circle);
  }

  // GET /api/contributions
  if (method === "GET" && url === "/api/contributions") {
    return jsonResponse(state.contributions);
  }

  // POST /api/contributions
  if (method === "POST" && url === "/api/contributions") {
    const body = JSON.parse(options.body || "{}");

    const { circleId, userId, amount } = body;
    const added = Number(amount || 0);

    const id = `con_${Date.now()}`;
    const contribution = {
      id,
      circleId,
      userId,
      amount: added,
      amountFormatted: `₦${added.toLocaleString()}`,
      date: new Date().toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
      }),
      action: "Contribution received",
    };

    state.contributions.unshift(contribution);

    // Update circle state so UI reflects payment status (pending -> paid)
    // This mimics real backend behavior after successful payment.
    const circle = state.circles.find((c) => c.id === circleId);
    if (circle?.membersList?.length) {
      circle.membersList = circle.membersList.map((m) => {
        // In this mock, current user is always the member with isYou=true.
        if (m.isYou) {
          return { ...m, status: "paid" };
        }
        return m;
      });

      // Update aggregates if present.
      // The UI uses circle.membersList?.filter(m=>m.status==='paid') for rotation progress.
    }

    const trustScore = computeTrustScoreForUser(userId, added);
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

