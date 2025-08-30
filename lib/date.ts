export function lastNDaysRange(n: number) {
  const to = new Date();
  const from = new Date(to.getTime() - n * 24 * 60 * 60 * 1000);
  const iso = (d: Date) => d.toISOString().slice(0, 19) + "Z"; // ISO corto
  return { from: iso(from), to: iso(to) };
}
