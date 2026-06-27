import React from "react";
import { Badge } from "../ui/badge";

export function PaymentSummary({ circle, amount }) {
  const formattedAmount =
    circle?.currencyFormatted ||
    circle?.monthlyContributionFormatted ||
    `₦${Number(amount || 0).toLocaleString()}`;

  const dueDate = circle?.dueDate || circle?.endDate || "—";

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs text-muted-foreground">Circle Name</div>
          <div className="font-semibold">{circle?.name || "—"}</div>
        </div>
        <Badge variant="secondary">Due</Badge>
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs text-muted-foreground">Contribution Amount</div>
          <div className="font-playfair font-bold text-xl text-primary">{formattedAmount}</div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-muted-foreground">Current Cycle</div>
          <div className="font-semibold">
            {circle?.currentCycle ?? "—"} of {circle?.totalCycles ?? "—"}
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Due Date</div>
          <div className="font-semibold">{dueDate}</div>
        </div>
      </div>
    </div>
  );
}

