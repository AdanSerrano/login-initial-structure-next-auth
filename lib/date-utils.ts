/**
 * Formats a date relative to now in Spanish.
 * @param date - The date to format
 * @param justNowText - Text to show when less than 1 minute ago (default: "Ahora")
 * @returns Formatted relative time string
 */
export function formatRelativeTime(date: Date, justNowText = "Ahora"): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return justNowText;
  if (minutes < 60) return `Hace ${minutes} min`;
  if (hours < 24) return `Hace ${hours}h`;
  if (days < 7) return `Hace ${days}d`;
  return new Intl.DateTimeFormat("es", { dateStyle: "short" }).format(
    new Date(date)
  );
}
