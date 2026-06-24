import { toast } from "react-toastify";
import { ethers } from "ethers";

export const shortenString = (input, startLength = 8, endLength = 5) => {
  if (input?.length <= startLength + endLength) {
    return input; // No need to shorten
  }
  return `${input?.slice(0, startLength)}...${input?.slice(-endLength)}`;
};

export const handleCopy = (val, message) => {
  navigator.clipboard.writeText(val);
  toast.success(message);
};

export const isValidBlock = (input) => {
  if (/^\d+$/.test(input)) {
    // Check if it's a valid block number (non-negative integer)
    return Number.isInteger(Number(input)) && Number(input) >= 0;
  }
  return false;
};

export const normalizeValue = (value) => {
  // If value is already a string and not in scientific notation
  if (/^\d+$/.test(value)) return value;

  // Convert to plain string without exponential notation
  const num = Number(value); // handles strings like "1e+21"
  return num.toLocaleString("fullwide", { useGrouping: false });
};

/**
 * Format token amount (in wei or numeric formats) into a human-friendly RYT string
 * - Converts wei to ether (18 decimals) via `ethers.formatEther`.
 * - Rounds to `maxDecimals` (default 6) for typical values.
 * - For very small non-zero amounts (smaller than 10^-maxDecimals), shows full precision
 *   up to 18 decimals (so backend values like `100` => `0.0000000000000001`).
 */
export const formatTokenAmount = (
  value,
  { maxDecimals = 6, minDisplay = 1e-6 } = {}
) => {
  if (value === undefined || value === null || value === "") return "0";

  try {
    const normalized = normalizeValue(value);
    const etherStr = ethers.formatEther(normalized); // exact decimal string from wei
    const amount = Number(etherStr);

    if (!isFinite(amount)) return "0";

    if (amount === 0) return "0";

    const abs = Math.abs(amount);

    // If the number is smaller than the readable rounding threshold, display full
    // precision up to 18 decimals rather than a `<threshold` marker.
    if (abs < Math.pow(10, -maxDecimals)) {
      let [intPart, fracPart = ""] = etherStr.split(".");
      // Keep up to 18 decimals (wei precision) and trim trailing zeros
      fracPart = fracPart.slice(0, 18).replace(/0+$/, "");
      return fracPart ? `${intPart}.${fracPart}` : intPart;
    }

    // Otherwise round to maxDecimals for cleaner display
    const rounded = Number(amount.toFixed(maxDecimals));
    return rounded.toLocaleString(undefined, {
      maximumFractionDigits: maxDecimals,
    });
  } catch (err) {
    // Fallback to a simple display on error
    console.error("formatTokenAmount error", err);
    return "0";
  }
};

export async function decodeWithoutAbi(input) {
  if (!input || input === "0x") return { error: "No input data" };

  const methodId = input.slice(0, 10);
  const data = input.slice(10);

  // Split the data into 32-byte (64-hex) chunks
  const chunks = data.match(/.{1,64}/g) || [];

  // Try to get function signature from 4byte.directory
  const sigRes = await fetch(
    `https://www.4byte.directory/api/v1/signatures/?hex_signature=${methodId}`
  );
  const sigData = await sigRes.json();
  const functionSignatures = sigData.results.map((r) => r.text_signature);

  return {
    methodId,
    possibleFunctions: functionSignatures.length
      ? functionSignatures
      : ["Unknown function"],
    rawParams: chunks.map((x, i) => `0x${x}`),
  };
}

// utils/parseAbi.js
export function parseAbi(rawAbi) {
  const readMethods = [];
  const writeMethods = [];

  if (!rawAbi) return { readMethods, writeMethods };

  let abiArray = [];

  try {
    // 1️⃣ If it's a string, try JSON.parse
    if (typeof rawAbi === "string") {
      // Sometimes backend sends JSON stringified array
      abiArray = JSON.parse(rawAbi);
    } else if (Array.isArray(rawAbi)) {
      abiArray = rawAbi;
    } else {
      console.warn("Unknown ABI format:", rawAbi);
      return { readMethods, writeMethods };
    }

    // 2️⃣ Parse each entry (some entries are stringified JSON)
    abiArray.forEach((item) => {
      let abiItem = item;
      if (typeof item === "string") {
        try {
          abiItem = JSON.parse(item);
        } catch (err) {
          console.warn("Failed to parse ABI item:", item);
          return;
        }
      }

      // Only functions
      if (abiItem.type !== "function") return;

      const { stateMutability, name, inputs = [], outputs = [] } = abiItem;

      if (stateMutability === "view" || stateMutability === "pure") {
        readMethods.push({ name, inputs, outputs });
      } else if (
        stateMutability === "nonpayable" ||
        stateMutability === "payable"
      ) {
        writeMethods.push({ name, inputs, outputs });
      }
    });
  } catch (error) {
    console.error("Failed to parse ABI:", error, rawAbi);
  }

  return { readMethods, writeMethods };
}
export function jsonStringToSolidity(jsonSource) {
  // Remove the wrapping quotes if present
  let code = jsonSource;

  // Replace escaped newline and tabs
  code = code?.replace(/\\n/g, "\n");
  code = code?.replace(/\\t/g, "\t");

  // Replace escaped quotes
  code = code?.replace(/\\"/g, '"');

  // Remove double escaping for slashes if any
  code = code?.replace(/\\\\/g, "\\");

  return code?.trim();
}

export const downloadAsCSV = (data, filename = "table-data.csv") => {
  if (!data || !data?.length) return;

  const headers = Object.keys(data[0]);

  const csvRows = [
    headers.join(","), // header row
    ...data.map((row) =>
      headers
        .map((field) => `"${String(row[field] ?? "").replace(/"/g, '""')}"`)
        .join(",")
    ),
  ];

  const csvBlob = new Blob([csvRows.join("\n")], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(csvBlob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
};
