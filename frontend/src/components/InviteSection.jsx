import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Copy, Share2, Check } from "lucide-react";
import { toast } from "sonner";

export function InviteSection({ inviteCode, inviteLink }) {
  const [codeCopied, setCodeCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const copyCode = async () => {
    await navigator.clipboard.writeText(inviteCode);
    setCodeCopied(true);
    toast.success("Invite code copied!");
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(inviteLink);
    setLinkCopied(true);
    toast.success("Invite link copied!");
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join my HerJo savings circle",
          text: "Use this link to join my savings circle on HerJo.",
          url: inviteLink,
        });
      } catch {
        // User dismissed the share sheet — no action needed
      }
    } else {
      await copyLink();
    }
  };

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label className="text-foreground">Invite Code</Label>
        <div className="flex gap-2">
          <Input
            value={inviteCode}
            readOnly
            className="font-mono bg-muted/40 border-border/40 tracking-widest"
          />
          <Button variant="outline" onClick={copyCode} className="flex-shrink-0 border-border/40">
            {codeCopied ? <Check className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-foreground">Invite Link</Label>
        <div className="flex gap-2">
          <Input
            value={inviteLink}
            readOnly
            className="bg-muted/40 border-border/40 text-xs text-muted-foreground"
          />
          <Button variant="outline" onClick={copyLink} className="flex-shrink-0 border-border/40">
            {linkCopied ? <Check className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      <Button onClick={shareLink} className="w-full bg-primary hover:bg-primary/90">
        <Share2 className="w-4 h-4 mr-2" />
        Share Invite Link
      </Button>
    </div>
  );
}
