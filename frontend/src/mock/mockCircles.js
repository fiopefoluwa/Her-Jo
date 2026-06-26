import { DEV_ROLE } from "../config/devRole";

const makeRotation = () => [
  {
    position: 1,
    name: "Amina Okafor",
    date: "Jan 15",
    status: "completed",
  },
  {
    position: 2,
    name: "Bisi Adekunle",
    date: "Feb 15",
    status: "active",
  },
  {
    position: 3,
    name: "Chika Nwosu",
    date: "Mar 15",
    status: "upcoming",
  },
];

const makeMembersList = (userRoleForYou) => [
  { id: "m1", name: "Amina Okafor", avatar: "AO", trustScore: 87, status: "active", isYou: true, role: userRoleForYou },
  { id: "m2", name: "Bisi Adekunle", avatar: "BA", trustScore: 80, status: "upcoming", isYou: false },
  { id: "m3", name: "Chika Nwosu", avatar: "CN", trustScore: 76, status: "upcoming", isYou: false },
  { id: "m4", name: "Tunde Adebayo", avatar: "TA", trustScore: 82, status: "paid", isYou: false },
  { id: "m5", name: "Lara Musa", avatar: "LM", trustScore: 78, status: "paid", isYou: false },
  { id: "m6", name: "Zainab Idris", avatar: "ZI", trustScore: 75, status: "pending", isYou: false },
];

export const mockCircles = [
  {
    id: "circle-1",
    name: "Market Women Alliance",
    description: "Monthly savings circle for trusted traders.",
    monthlyContribution: 50000,
    monthlyContributionFormatted: "₦50,000",
    totalPool: 400000,
    totalPoolFormatted: "₦400,000",
    members: 8,
    currentCycle: 1,
    totalCycles: 8,
    startDate: "Jan 2026",
    endDate: null,
    nextPayout: "You",
    daysUntilPayout: 5,
    status: "active",
    rotationSchedule: makeRotation(),
    membersList: makeMembersList(DEV_ROLE),
    currentUserRole: DEV_ROLE,
    nextPayoutLabel: "Your Turn Soon",

  },
  {
    id: "circle-2",
    name: "Ajo Developers",
    description: "Community circle for builders.",
    monthlyContribution: 75000,
    monthlyContributionFormatted: "₦75,000",
    totalPool: 600000,
    totalPoolFormatted: "₦600,000",
    members: 8,
    currentCycle: 2,
    totalCycles: 8,
    startDate: "Feb 2026",
    endDate: null,
    nextPayout: "Bisi Adekunle",
    daysUntilPayout: 10,
    status: "active",
    rotationSchedule: makeRotation(),
    membersList: makeMembersList("member"),
    currentUserRole: "member",
  },
];

