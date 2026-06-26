const now = () => new Date();

function fmtDate(d) {
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export const mockContributions = [
  {
    id: "c1",
    circleId: "circle-1",
    userId: "user-1",
    amount: 50000,
    amountFormatted: "₦50,000",
    date: fmtDate(now()),
    action: "Contribution received",
  },
  {
    id: "c2",
    circleId: "circle-2",
    userId: "user-1",
    amount: 75000,
    amountFormatted: "₦75,000",
    date: fmtDate(now()),
    action: "Contribution received",
  },
];

