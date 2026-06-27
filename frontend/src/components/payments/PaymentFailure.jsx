import React from "react";
import { Button } from "../ui/button";
import { AlertTriangle } from "lucide-react";

export function PaymentFailure({ onRetry, onCancel, message }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
          <AlertTriangle className="w-6 h-6 text-destructive" />
        </div>
        <div>
          <div className="font-semibold text-lg">Payment Failed</div>
          <div className="text-xs text-muted-foreground">Please try again</div>
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        {message || "We couldn’t process your payment right now."}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button className="bg-primary hover:bg-primary/90" onClick={onRetry}>
          Retry
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

