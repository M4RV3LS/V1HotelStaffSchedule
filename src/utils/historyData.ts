// Mock data for history/activity log

export interface HistoryEntry {
  email: string;
  updateDate: string;
  message: string;
}

const actionTemplates = [
  {
    action: 'changed',
    staff: ['John Doe', 'Jane Smith', 'Sarah Johnson', 'Michael Clarke', 'David Wilson', 'Emily Davis', 'Robert Brown'],
    from: ['Morning', 'Afternoon', 'Night', 'Evening', 'Off Duty', 'On Duty'],
    to: ['Morning', 'Afternoon', 'Night', 'Evening', 'Off Duty', 'On Duty'],
  },
];

export function generateMockHistoryData(month: Date): HistoryEntry[] {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const now = new Date();

  // Only show history for current and past months
  if (year > now.getFullYear() || (year === now.getFullYear() && monthIndex > now.getMonth())) {
    return [];
  }

  const entries: HistoryEntry[] = [];
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  // Generate 8-12 random history entries for the month
  const numEntries = 8 + Math.floor(Math.random() * 5);

  for (let i = 0; i < numEntries; i++) {
    const day = Math.floor(Math.random() * daysInMonth) + 1;
    const hour = Math.floor(Math.random() * 24);
    const minute = Math.floor(Math.random() * 60);

    const date = new Date(year, monthIndex, day, hour, minute);
    const dateStr = date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    }) + ' ' + date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const emails = ['owner@hotel.com', 'manager@hotel.com', 'supervisor@hotel.com'];
    const email = emails[Math.floor(Math.random() * emails.length)];

    const template = actionTemplates[0];
    const staff = template.staff[Math.floor(Math.random() * template.staff.length)];
    const from = template.from[Math.floor(Math.random() * template.from.length)];
    const to = template.to[Math.floor(Math.random() * template.to.length)];
    const changeDay = Math.floor(Math.random() * daysInMonth) + 1;
    const changeDate = `${String(changeDay).padStart(2, '0')}/01/${year}`;

    const messages = [
      `Changed ${staff}'s attendance on ${changeDate} from ${from} to ${to}`,
      `Changed ${staff}'s shift on ${changeDate} from ${from} to ${to}`,
      `Updated ${staff}'s schedule on ${changeDate}`,
      i === 0 ? `Created schedule for ${month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}` : null,
    ].filter(Boolean);

    const message = messages[Math.floor(Math.random() * messages.length)] as string;

    entries.push({
      email,
      updateDate: dateStr,
      message,
    });
  }

  // Sort by date descending
  entries.sort((a, b) => {
    const dateA = new Date(a.updateDate.split(' ').reverse().join(' '));
    const dateB = new Date(b.updateDate.split(' ').reverse().join(' '));
    return dateB.getTime() - dateA.getTime();
  });

  return entries;
}
