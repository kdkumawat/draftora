export type MockMention = {
  id: string;
  name: string;
  subtitle: string;
};

export const MOCK_MENTIONS: MockMention[] = [
  { id: "u1", name: "Kuldeep Kumawat", subtitle: "Designing distributed systems" },
  { id: "u2", name: "Alex Chen", subtitle: "Engineering" },
  { id: "c1", name: "Acme Corp", subtitle: "Company" },
  { id: "c2", name: "OpenAI", subtitle: "Company" },
  { id: "u3", name: "Sam Rivera", subtitle: "Design" },
];

export function filterMentions(query: string): MockMention[] {
  const q = query.trim().toLowerCase();
  if (!q) return MOCK_MENTIONS;
  return MOCK_MENTIONS.filter(
    (m) =>
      m.name.toLowerCase().includes(q) ||
      m.subtitle.toLowerCase().includes(q),
  );
}
