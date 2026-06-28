import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Settings } from "lucide-react";

/**
 * Header action buttons shown only to the circle leader.
 */
export function LeaderActions({ circleId }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button asChild variant="outline" className="border-border/40" size="sm">
        <Link to={`/group/${circleId}`}>Group Details</Link>
      </Button>
      <Button asChild variant="outline" className="border-border/40" size="sm">
        <Link to={`/record-contribution/${circleId}`}>Record Contribution</Link>
      </Button>
      <Button asChild variant="outline" className="border-border/40" size="sm">
        <Link to={`/circle/${circleId}/settings`}>
          <Settings className="w-4 h-4 mr-1.5" />
          Settings
        </Link>
      </Button>
    </div>
  );
}
