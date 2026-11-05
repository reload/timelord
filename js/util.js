// Make sure numbers only have up to 2 decimals.
export const roundNumber = (num) => Math.round(num * 100) / 100;

// Normalise a date to YYYY-MM-DD, which is the only format the native date
// input accepts. Older URLs may use YYYYMMDD.
export function toIsoDate(value) {
  value = String(value || '');
  if (/^\d{8}$/.test(value)) {
    value = `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
  }
  return value;
}

// Get the location hash (without the "#"), or set it when given a value.
export function hashtag(val = null) {
  if (val) {
    // Strip slashes from the value.
    window.location.hash = String(val).replace(/\//g, '');
    return undefined;
  }
  return window.location.hash.substring(1);
}
