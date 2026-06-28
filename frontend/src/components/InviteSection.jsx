import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Copy, Share2, Check, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "../lib/api";

export function InviteSection({ circleId }) {
  const [email, setEmail] = useState("");
  const [generating, setGenerating] = useState(false);
  const [inviteUrl, setInviteUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      // Email is required by backend; generate a placeholder if the leader leaves it blank
      const emailToUse = email.trim() || `invite_${Date.now()}@herjo.app`;
      const result = await apiFetch(`/circles/${circleId}/invite`, {
        method: "POST",
        body: JSON.stringify({ email: emailToUse }),
      });
      // Backend may return a production URL even in local dev (FRONTEND_URL on Render).
      // Rewrite the origin to match wherever the frontend is actually running.
      const path = new URL(result.inviteUrl).pathname;
      setInviteUrl(window.location.origin + path);
      toast.success("Invite link generated!");
    } catch (err) {
      toast.error(err.message || "Failed to generate invite");
    } finally {
      setGenerating(false);
    }
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    toast.success("Copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join my HerJo savings circle",
          url: inviteUrl,
        });
      } catch {
        // user dismissed
      }
    } else {
      await copyLink();
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-foreground">Invitee Email (optional)</Label>
        <div className="flex gap-2">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="friend@example.com — or leave blank"
            className="border-border/40"
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
          />
          <Button
            onClick={handleGenerate}
            disabled={generating}
            className="flex-shrink-0 bg-primary hover:bg-primary/90"
          >
            <RefreshCw className={`w-4 h-4 mr-1.5 ${generating ? "animate-spin" : ""}`} />
            {generating ? "…" : "Generate"}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Leave blank to generate a general invite link. Each link allows one person to join.
        </p>
      </div>

      {inviteUrl && (
        <div className="space-y-3 p-4 rounded-lg bg-accent/5 border border-accent/20">
          <Label className="text-sm text-foreground">Invite Link</Label>
          <div className="flex gap-2">
            <Input
              value={inviteUrl}
              readOnly
              className="bg-muted/40 border-border/40 text-xs text-muted-foreground min-w-0"
            />
            <Button variant="outline" onClick={copyLink} className="flex-shrink-0 border-border/40">
              {copied ? <Check className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
          <Button onClick={shareLink} variant="outline" className="w-full border-border/40">
            <Share2 className="w-4 h-4 mr-2" />
            Share Link
          </Button>
          <p className="text-xs text-muted-foreground">
            Expires in 7 days. Generate a new link for each person you want to invite.
          </p>
        </div>
      )}
    </div>
  );
}
