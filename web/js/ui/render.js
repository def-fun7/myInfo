import { toSafeId } from "../utils/ids.js";
import { checkDefaultChecks } from "../utils/dom.js";

const defaultChecks = ["Mother-Name", "Maiden-Name", "University-Name"];

/**
 * Render grouped subcategories into the right panel.
 * @param {Object<string, Array<[string, number]>>} groupedDict
 */
export function renderSubcategories(groupedDict) {
  const $nav = $("#inner-right").empty();

  Object.entries(groupedDict).forEach(([subcategory, items]) => {
    const $header = $(`
      <div class="subcategory">
        <span class="subcategory-title">${subcategory}</span>
        <button class="expand-btn" title="Expand">∨</button>
      </div>
    `);

    const $dropdown = $('<div class="subcategory-dropdown"></div>');

    items.forEach(([name, multiplicity]) => {
      const safeId = toSafeId(name);

      const addBtn =
        multiplicity === 1
          ? `<button class="row-btn add-btn" data-id="${safeId}" title="Add one more" >+</button>`
          : "";

      $dropdown.append(`
        <div class="dropdown-item" id="dropdown-${safeId}">
          <input type="checkbox" class="item-check" id="check-${safeId}" title="Check to add in the form">
          <span>${name}</span>
          ${addBtn}
        </div>
      `);
    });

    $nav.append($header, $dropdown);
  });

  checkDefaultChecks(defaultChecks);
}
