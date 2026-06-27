import React from "react";
import { Progress } from "../ui/progress";
import { motion } from "motion/react";
import { Loader2 } from "lucide-react";

export function PaymentProcessing({ label }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"
        >
          <Loader2 className="w-5 h-5 text-primary" />
        </motion.div>
        <div>
          <div className="text-sm text-muted-foreground">{label || "Processing Payment..."}</div>
          <div className="font-semibold">Please wait</div>
        </div>
      </div>

      <Progress value={60} className="h-2" />

      <div className="text-xs text-muted-foreground">
        We’re securely confirming your contribution.
      </div>
    </div>
  );
}

