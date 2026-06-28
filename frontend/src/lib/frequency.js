export function frequencyLabel(frequency) {
  switch (frequency?.toLowerCase()) {
    case "daily":    return "Daily";
    case "weekly":   return "Weekly";
    case "biweekly": return "Bi-weekly";
    case "monthly":
    default:         return "Monthly";
  }
}

export function frequencyAdverb(frequency) {
  switch (frequency?.toLowerCase()) {
    case "daily":    return "daily";
    case "weekly":   return "weekly";
    case "biweekly": return "bi-weekly";
    case "monthly":
    default:         return "monthly";
  }
}
