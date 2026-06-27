import React, { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { PaymentSummary } from "./PaymentSummary";
import { PaymentMethodSelector } from "./PaymentMethodSelector";
import { PaymentProcessing } from "./PaymentProcessing";
import { PaymentSuccess } from "./PaymentSuccess";
import { PaymentFailure } from "./PaymentFailure";
import { Button } from "../ui/button";
import { processMockPayment, SIMULATE_PAYMENT_FAILURE } from "./mockPaymentProcessor";
import { toast } from "sonner";

export function PaymentModal({
  open,
  onOpenChange,
  circle,
  amount,
  userId,
  onPaymentSuccess,
}) {
  const [method, setMethod] = useState("wallet");
  const [stage, setStage] = useState("select"); // select | processing | success | failure
  const [processing, setProcessing] = useState(false);

  const [transactionReference, setTransactionReference] = useState(null);
  const [processedAt, setProcessedAt] = useState(null);
  const [failureMessage, setFailureMessage] = useState(null);

  const amountFormatted = useMemo(() => {
    const v = Number(amount || 0);
    return circle?.monthlyContributionFormatted || `₦${v.toLocaleString()}`;
  }, [amount, circle]);

  const reset = () => {
    setMethod("wallet");
    setStage("select");
    setProcessing(false);
    setTransactionReference(null);
    setProcessedAt(null);
    setFailureMessage(null);
  };

  const handleClose = () => {
    if (processing) return;
    reset();
    onOpenChange(false);
  };

  const handleConfirm = async () => {
    if (processing) return;
    if (!circle) return;

    setProcessing(true);
    setStage("processing");

    try {
      const result = await processMockPayment({
        method,
        amount: Number(amount || 0),
        circleId: circle.id,
        userId,
      });

      if (!result.ok) {
        setFailureMessage(result.error);
        setTransactionReference(result.transactionReference);
        setProcessedAt(result.processedAt);
        setStage("failure");
        return;
      }

      setTransactionReference(result.transactionReference);
      setProcessedAt(result.processedAt);
      setStage("success");

      // After payment succeeds, update the application state exactly like real payment.
      // This keeps backend/state flow consistent with the current mock implementation.
      await onPaymentSuccess({
        circleId: circle.id,
        userId,
        amount: Number(amount || 0),
        method,
        transactionReference: result.transactionReference,
        processedAt: result.processedAt,
      });
    } catch (e) {
      console.error(e);
      setFailureMessage(e?.message || "Payment failed. Please try again.");
      setStage("failure");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? null : handleClose())}>
      <DialogContent className="sm:max-w-[560px] bg-card border-border/40">
        <DialogHeader>
          <DialogTitle className="font-playfair text-2xl">Contribute to Circle</DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {stage === "select" && (
            <>
              <PaymentSummary circle={circle} amount={amount} />
              <div className="border-t border-border/40 pt-5" />
              <PaymentMethodSelector value={method} onChange={setMethod} disabled={processing} />

              <div className="pt-2">
                <Button
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={handleConfirm}
                  disabled={processing}
                >
                  {processing ? "Confirming..." : "Confirm Payment"}
                </Button>

                {SIMULATE_PAYMENT_FAILURE && (
                  <div className="mt-3 text-xs text-muted-foreground">
                    Development flag is enabled: payment failure may be simulated.
                  </div>
                )}
              </div>
            </>
          )}

          {stage === "processing" && (
            <PaymentProcessing label="Processing Payment..." />
          )}

          {stage === "success" && (
            <PaymentSuccess
              circle={circle}
              amountFormatted={amountFormatted}
              transactionReference={transactionReference}
              processedAt={processedAt}
              onViewCircle={() => handleClose()}
              onDone={() => handleClose()}
            />
          )}

          {stage === "failure" && (
            <PaymentFailure
              message={failureMessage}
              onRetry={() => {
                reset();
                setStage("select");
              }}
              onCancel={() => handleClose()}
            />
          )}
        </div>

        {/* Footer hint: keep a polished feel */}
        {stage === "select" && (
          <div className="mt-6 text-xs text-muted-foreground">
            No real payment provider is connected in this MVP.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

