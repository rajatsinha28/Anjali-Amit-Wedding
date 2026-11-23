const start = "20261210T153000Z";
const end = "20261210T163000Z";

function escapeICS(value: string): string {
  return value
    .replaceAll("\\", "\\\\")
    .replaceAll(";", "\\;")
    .replaceAll(",", "\\,")
    .replaceAll("\n", "\\n");
}

export function createBaraatICS(venue?: string | null): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Anjali and Amit//Wedding Invitation//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    "UID:baraat-20261210@anjali-amit-wedding",
    "DTSTAMP:20261120T063000Z",
    `DTSTART:${start}`,
    "SUMMARY:Anjali & Amit — Baraat",
    `DESCRIPTION:${escapeICS("Baraat at 9:00 PM IST. The wedding ceremony is listed separately at 8:00 PM IST.")}`,
  ];
  if (venue) lines.push(`LOCATION:${escapeICS(venue)}`);
  lines.push(
    "BEGIN:VALARM",
    "TRIGGER:-PT30M",
    "ACTION:DISPLAY",
    "DESCRIPTION:Baraat reminder",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  );
  return `${lines.join("\r\n")}\r\n`;
}

export function createGoogleCalendarUrl(venue?: string | null): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: "Anjali & Amit — Baraat",
    dates: `${start}/${end}`,
    details: "Baraat at 9:00 PM IST. Wedding ceremony: 8:00 PM IST.",
  });
  if (venue) params.set("location", venue);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
