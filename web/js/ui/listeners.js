import { getCheckedItems } from "../utils/dom.js";
import { toReadableLabel } from "../utils/ids.js";
import { addFormRow, enableInputKeyNavigation } from "../modules/forms.js";
import { saveData } from "../modules/save.js";

/**
 * Listen for checkbox changes and notify callback.
 * @param {Function} callback
 */
export function attachItemCheckListener(callback) {
  $(document).on("change", "input.item-check", () => {
    callback(getCheckedItems());
  });
}

/**
 * Handle + and − row buttons.
 */
export function attachRowButtons() {
  $(document).on("click", ".add-btn", function () {
    const safeId = $(this).data("id");
    const count = incrementCounter(this);
    const label = `${toReadableLabel(safeId)} ${count}`;
    addFormRow(label);
    enableInputKeyNavigation();
  });
  $(document).on("click", ".remove-row-btn", function () {
    $(this).closest(".form-row").remove();
  });
}
/**
 * Increment button counter stored in dataset.
 * @param {HTMLElement} btn
 * @returns {number} new count
 */
function incrementCounter(btn) {
  const current = Number(btn.dataset.count || 0) + 1;
  btn.dataset.count = current;
  return current;
}

/**
 * Decrement button counter.
 * @param {HTMLElement} btn
 * @returns {number} new count
 */
function decrementCounter(btn) {
  const current = Math.max(0, Number(btn.dataset.count || 0) - 1);
  btn.dataset.count = current;
  return current;
}

/**
 * Handle expand/collapse of subcategory dropdowns.
 */
export function attachExpandButtons() {
  $(document).on("click", ".expand-btn", function () {
    const $btn = $(this);
    const $container = $btn.closest(".subcategory");
    const $dropdown = $container.nextAll(".subcategory-dropdown").first();

    const isOpen = $dropdown.is(":visible");
    $dropdown.toggle(!isOpen);

    $btn.text(isOpen ? "∨" : "∧");
    $btn.attr('title', isOpen ? "Expand" : "Collapse");
  });
}

export function attachSaveData() {
  $(document).on("click", "#save-button", () => {
    saveData();
  });
}