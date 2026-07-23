export const truncateHash = (hash = "") =>
  hash?.length > 14 ? `${hash?.slice(0, 8)}…${hash?.slice(-6)}` : hash;

export const truncateMethod = (input = "") =>
  input?.length > 10 ? `${input.slice(0, 10)}…` : input;

export const fmtNum = (val) => {
  if (val === null || val === undefined || val === "") return "—";
  const n = Number(val);
  if (isNaN(n)) return val;
  return n.toLocaleString();
};

export const roundToSixDecimals = (value) =>
  Math.round(Number(value) * 1e6) / 1e6;

// Token transfer `value` fields come back as raw 0x-prefixed uint256 hex.
export const hexToDecimalString = (hex) => {
  if (!hex || hex === "0x") return "0";
  try {
    // eslint-disable-next-line no-undef -- BigInt is a standard ES2020 global
    return BigInt(hex).toString();
  } catch {
    return hex;
  }
};
