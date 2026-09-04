const messageTimeFormatter = new Intl.DateTimeFormat("id-ID", {
  hour: "2-digit",
  minute: "2-digit",
});

const conversationDateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

function parseDate(value: string | null | undefined) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatMessageTime(value: string | null | undefined) {
  const date = parseDate(value);
  return date ? messageTimeFormatter.format(date) : "Waktu tidak tersedia";
}

export function formatConversationDate(value: string | null | undefined) {
  const date = parseDate(value);
  return date ? conversationDateFormatter.format(date) : "Tanggal tidak tersedia";
}
