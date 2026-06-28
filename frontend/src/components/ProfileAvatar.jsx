import { useAuth } from "../context/AuthContext";

export function ProfileAvatar({ className = "" }) {
  const user = useAuth();
  return (
    <div className={`w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 ${className}`}>
      <span className="text-sm font-semibold text-primary">{user.avatar}</span>
    </div>
  );
}
