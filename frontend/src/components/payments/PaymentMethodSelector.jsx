import React from "react";
import { Wallet, Building2, CreditCard, Check } from "lucide-react";
import { Badge } from "../ui/badge";

const METHODS = [
  {
    id: "bank",
    title: "Bank Transfer",
    subtitle: "Pay directly from your bank",
    icon: Building2,
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    id: "card",
    title: "Debit Card",
    subtitle: "Visa, Mastercard, Verve",
    icon: CreditCard,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    id: "wallet",
    title: "Wallet",
    subtitle: "Pay from HerJo wallet",
    icon: Wallet,
    color: "text-secondary",
    bg: "bg-secondary/10",
    comingSoon: true,
  },
];

function MethodCard({ method, selected, disabled, onClick }) {
  const Icon = method.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || method.comingSoon}
      aria-pressed={selected}
      className={[
        "relative w-full text-left rounded-xl border-2 p-4 transition-all duration-150 outline-none",
        "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        selected
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-border/40 bg-card hover:border-border hover:bg-muted/30",
        (disabled || method.comingSoon) && "opacity-50 cursor-not-allowed",
      ].join(" ")}
    >
      {/* Selected checkmark */}
      {selected && (
        <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
          <Check className="w-3 h-3 text-primary-foreground" strokeWidth={3} />
        </span>
      )}

      {/* Icon */}
      <div className={`w-10 h-10 rounded-lg ${method.bg} flex items-center justify-center mb-3`}>
        <Icon className={`w-5 h-5 ${method.color}`} />
      </div>

      {/* Label */}
      <div className="font-semibold text-sm text-foreground leading-tight">
        {method.title}
      </div>
      <div className="text-xs text-muted-foreground mt-0.5">{method.subtitle}</div>

      {method.comingSoon && (
        <Badge variant="secondary" className="mt-2 text-xs">Coming Soon</Badge>
      )}
    </button>
  );
}

export function PaymentMethodSelector({ value, onChange, disabled }) {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-foreground">Payment Method</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {METHODS.map((method) => (
          <MethodCard
            key={method.id}
            method={method}
            selected={value === method.id}
            disabled={disabled}
            onClick={() => !method.comingSoon && onChange(method.id)}
          />
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        All payments are secured and processed instantly.
      </p>
    </div>
  );
}
