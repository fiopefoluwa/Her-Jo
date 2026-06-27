import React from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { CheckCircle2 } from "lucide-react";

export function PaymentSuccess({
  circle,
  amountFormatted,
  transactionReference,
  processedAt,
  onDone,
  onViewCircle,
}) {
  const date = processedAt ? new Date(processedAt) : new Date();
  const formattedTime = date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
          <CheckCircle2 className="w-6 h-6 text-accent" />
        </div>
        <div>
          <div className="font-semibold text-lg">Payment Successful</div>
          <div className="text-xs text-muted-foreground">Confirmation complete</div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-lg border border-border/40 p-4 bg-card">
          <div className="text-xs text-muted-foreground">Amount Contributed</div>
          <div className="font-playfair font-bold text-xl text-primary">
            {amountFormatted}
          </div>
        </div>
        <div className="rounded-lg border border-border/40 p-4 bg-card">
          <div className="text-xs text-muted-foreground">Circle</div>
          <div className="font-semibold">{circle?.name || "—"}</div>
        </div>
      </div>

      <div className="rounded-lg border border-border/40 p-4 bg-card space-y-2">
        <div className="flex items-center justify-between gap-3">
          <div className="text-xs text-muted-foreground">Transaction Reference</div>
          <Badge variant="secondary">Mock</Badge>
        </div>
        <div className="font-mono text-sm break-all">{transactionReference}</div>
        <div className="text-xs text-muted-foreground">{formattedTime}</div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="outline" onClick={onViewCircle}>
          View Circle
        </Button>
        <Button className="bg-primary hover:bg-primary/90" onClick={onDone}>
          Done
        </Button>
      </div>
    </div>
  );
}

