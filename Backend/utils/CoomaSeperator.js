exports.parseCommaSeparated = (value) => {
  if (!value) return [];
  if (Array.isArray(value))
    return value.map((v) => String(v).trim()).filter(Boolean);
  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};
