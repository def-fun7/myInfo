/**
 * Check checkboxes based on a list of safeId suffixes.
 * @param {string[]} defaults
 */
export function checkDefaultChecks(defaults) {
  defaults.forEach((suffix) => {
    const $box = $(`#check-${suffix}`);
    if ($box.length) $box.prop("checked", true);
  });
}

/**
 * Get all checked item-check IDs without the "check-" prefix.
 * @returns {string[]}
 */
export function getCheckedItems() {
  return $("input.item-check:checked")
    .map(function () {
      return this.id.replace(/^check-/, "");
    })
    .get();
}
