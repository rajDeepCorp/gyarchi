function formatCount(value: number = 0): string {
  if (value < 1000) return value.toString();

  if (value < 1_000_000) {
    const formatted = (value / 1000).toFixed(value >= 100_000 ? 0 : 1);
    return `${formatted.replace(".0", "")}k`;
  }

  if (value < 1_000_000_000) {
    const formatted = (value / 1_000_000).toFixed(value >= 100_000_000 ? 0 : 1);
    return `${formatted.replace(".0", "")}m`;
  }

  const formatted = (value / 1_000_000_000).toFixed(value >= 100_000_000_000 ? 0 : 1);
  return `${formatted.replace(".0", "")}b`;
}

export { formatCount };