import React from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

function MethodCard({
  title,
  subtitle,
  icon,
  selected,
  comingSoon,
  onClick,
  disabled,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={
        "w-full text-left rounded-lg border transition-colors p-4 " +
        (selected
          ? "border-primary/60 bg-primary/5"
          : "border-border/40 bg-card hover:bg-card")
      }
      aria-pressed={selected}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            {icon}
          </div>
          <div>
            <div className="font-semibold flex items-center gap-2">
              {title}
              {comingSoon && <Badge variant="secondary">Coming Soon</Badge>}
            </div>
            <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>
          </div>
        </div>
        {selected && (
          <div className="w-3 h-3 rounded-full bg-primary mt-1" />
        )}
      </div>
    </button>
  );
}

export function PaymentMethodSelector({ value, onChange, disabled }) {
  return (
    <div className="space-y-4">
      <div>
        <div className="text-xs text-muted-foreground">Payment Method</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <MethodCard
          title="Wallet"
          subtitle="Fast pay from your wallet"
          comingSoon
          selected={value === "wallet"}
          disabled={disabled}
          onClick={() => onChange("wallet")}
          icon={<span className="text-primary font-bold">W</span>}
        />
        <MethodCard
          title="Bank Transfer"
          subtitle="Simulated bank transfer"
          selected={value === "bank"}
          disabled={disabled}
          onClick={() => onChange("bank")}
          icon={<span className="text-accent font-bold">B</span>}
        />
        <MethodCard
          title="Debit Card"
          subtitle="Card details mocked"
          selected={value === "card"}
          disabled={disabled}
          onClick={() => onChange("card")}
          icon={<span className="text-secondary font-bold">C</span>}
        />
      </div>

      <div className="text-xs text-muted-foreground">
        All methods use the same secure mock flow for this MVP.
      </div>
    </div>
  );
}

