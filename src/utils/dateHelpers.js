import { format, parseISO, isValid, differenceInCalendarDays } from 'date-fns';

export const todayISO = () => new Date().toISOString().slice(0, 10);

export const formatDate = (value, pattern = 'dd MMM yyyy') => {
  if (!value) return '—';
  try {
    const date = typeof value === 'string' ? parseISO(value) : value;
    if (!isValid(date)) return '—';
    return format(date, pattern);
  } catch {
    return '—';
  }
};

export const daysBetween = (a, b) => {
  try {
    const dateA = typeof a === 'string' ? parseISO(a) : a;
    const dateB = typeof b === 'string' ? parseISO(b) : b;
    return differenceInCalendarDays(dateB, dateA);
  } catch {
    return null;
  }
};

export const relativeDay = (value) => {
  if (!value) return 'Never';
  const diff = daysBetween(value, todayISO());
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff > 1) return `${diff} days ago`;
  return formatDate(value);
};
