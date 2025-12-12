/**
 * Convert a label into a safe DOM id.
 * @param {string} name
 * @returns {string}
 */
export function toSafeId(name) {
  return name.replace(/\s+/g, "-");
}

/**
 * Convert a safeId back into a readable label.
 * @param {string} safeId
 * @returns {string}
 */
export function toReadableLabel(safeId) {
  return safeId.replace(/-/g, " ");
}
