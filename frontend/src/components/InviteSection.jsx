import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Copy, Share2, Check, Send } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "../lib/api";

export function InviteSection({ circleId }) {
  const [email, setEmail] = useState("");

  // This is a UI-only input. The backend invite API is treated as a general invite link
  // for anyone with the link to sign up. We still keep the input field to avoid changing
  // existing UI layouts, but it is no longer used for invite generation.

  const [sending, setSending] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setSending(true);

    try {
      const result = await apiFetch(`/circles/${circleId}/invite`, {
        method: "POST",
        // Intentionally do NOT bind invites to a specific user/email.
        // The invite link returned by the backend is treated as a general
        // link (anyone with the link can sign up).
        body: JSON.stringify({}),
      });

      setGeneratedUrl(result.inviteUrl);
      toast.success("Invite link created!");

    } catch (err) {
      toast.error(err.message || "Failed to create invite");
    } finally {
      setSending(false);
    }
  };

  const copyLink = async () => {
    if (!generatedUrl) return;
    await navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    toast.success("Invite link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLink = async () => {
    if (!generatedUrl) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join my HerJo savings circle",
          text: "Use this link to join my savings circle on HerJo.",
          url: generatedUrl,
        });
      } catch {
        // User dismissed — no action needed
      }
    } else {
      await copyLink();
    }
  };

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label className="text-foreground">Invite Link (General)</Label>
        <div className="flex gap-2">
          <Input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Optional email (not required)"
            className="border-border/40"
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
          />

          <Button
            onClick={handleGenerate}
            disabled={sending}
            className="flex-shrink-0 bg-primary hover:bg-primary/90"
          >
            <Send className="w-4 h-4 mr-1.5" />
            {sending ? "..." : "Generate"}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Generate a general invite link. Anyone with the link can sign up—email is optional.
        </p>

      </div>

      {generatedUrl && (
        <div className="space-y-3 p-4 rounded-lg bg-accent/5 border border-accent/20">


          <Label className="text-foreground text-sm">Invite Link</Label>

          <div className="flex gap-2">
            <Input
              value={generatedUrl}
              readOnly
              className="bg-muted/40 border-border/40 text-xs text-muted-foreground min-w-0"
            />
            <Button
              variant="outline"
              onClick={copyLink}
              className="flex-shrink-0 border-border/40"
            >
              {copied ? <Check className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>

          <Button
            onClick={shareLink}
            variant="outline"
            className="w-full border-border/40"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Link
          </Button>

          <p className="text-xs text-muted-foreground">
            This link expires in 7 days. Anyone with the link can sign up.
          </p>

        </div>
      )}
    </div>
  );
}
