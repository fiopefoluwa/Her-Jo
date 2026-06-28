function fmtDate(d) {
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

const today = fmtDate(new Date());

export const mockContributions = [
  {
    id: "c1",
    circleId: "circle-1",
    userId: "user-1",
    amount: 50000,
    amountFormatted: "₦50,000",
    date: today,
    action: "Amina contributed ₦50,000",
    circle: "Market Women Alliance",
  },
  {
    id: "c2",
    circleId: "circle-2",
    userId: "user-1",
    amount: 75000,
    amountFormatted: "₦75,000",
    date: today,
    action: "Amina contributed ₦75,000",
    circle: "Ajo Developers",
  },
];
