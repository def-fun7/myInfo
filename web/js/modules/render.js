/**
 * @file render.js
 * @description Rendering grouped subcategories
 */

export function renderSubcategories(groupedDict) {
  const $nav = $("#inner-right").empty();

  Object.entries(groupedDict).forEach(([subcategory, items]) => {
    const $header = $(`
      <div class="subcategory">
        <span class="subcategory-title">${subcategory}</span>
        <button class="expand-btn">∨</button>
      </div>
    `);

    const $dropdown = $('<div class="subcategory-dropdown"></div>');

    items.forEach(([name, multiplicity]) => {
      const safeId = `item-${name.replace(/\s+/g, "-")}`;
      const addBtn =
        multiplicity === 1 ? '<button class="add-btn">+</button>' : "";
      $dropdown.append(`
        <div class="dropdown-item" id="${safeId}">
          <input type="checkbox" class="item-check">
          <span>${name}</span>
          ${addBtn}
        </div>
      `);
    });

    $nav.append($header, $dropdown);
  });

  $(".expand-btn").on("click", function () {
    const $btn = $(this);
    const $dropdown = $btn
      .closest(".subcategory")
      .next(".subcategory-dropdown");
    const isOpen = $dropdown.css("display") === "flex";
    $dropdown.toggle(!isOpen);
    $btn.text(isOpen ? "∨" : "∧");
  });
}
