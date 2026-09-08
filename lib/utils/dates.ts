export function formatTimestamp(
  dateInput: Date | string | number | null | undefined,
  options: { includeTime?: boolean; relative?: boolean } = { includeTime: true }
): string {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '';

  if (options.relative) {
    const rel = getRelativeTimeString(date);
    if (rel) return rel;
  }

  const dateStr = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);

  if (!options.includeTime) {
    return dateStr;
  }

  const timeStr = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);

  return `${dateStr} at ${timeStr}`;
}

export function getRelativeTimeString(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 0) {
    // Future date
    const futureSec = Math.abs(diffInSeconds);
    if (futureSec < 60) return 'in a few seconds';
    if (futureSec < 3600) return `in ${Math.floor(futureSec / 60)}m`;
    if (futureSec < 86400) return `in ${Math.floor(futureSec / 3600)}h`;
    return `in ${Math.floor(futureSec / 86400)}d`;
  }

  if (diffInSeconds < 45) return 'just now';
  if (diffInSeconds < 90) return '1m ago';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 7200) return '1h ago';
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 172800) return '1d ago';
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return '';
}
