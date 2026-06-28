import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export function HerJoLogo({ className = "" }) {
  return (
    <Link to="/" className={`flex items-center gap-1.5 group ${className}`}>
      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary group-hover:text-primary/80 transition-colors" />
      <span className="font-playfair font-bold text-base sm:text-lg tracking-tight group-hover:text-primary/80 transition-colors">
        HerJo
      </span>
    </Link>
  );
}
