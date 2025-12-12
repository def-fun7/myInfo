/**
 * @file forms.js
 * @description Handles creation, removal, and refreshing of dynamic form rows.
 */

import { getSelectedCategory } from "./nav.js";
import { getNamesByCategory } from "./grouping.js";
import { toSafeId } from "../utils/ids.js";
import { getUserData } from "./api.js";
import { path } from "../script.js";

/**
 * Refresh form rows based on the selected category and checked items.
 *
 * @param {Array<Object>} rows - All field definitions.
 * @param {string[]} checkedSafeIds - List of safeIds that should appear as form rows.
 */
export function refreshFormRows(rows, checkedSafeIds) {
  const selectedCategory = getSelectedCategory();
  if (!selectedCategory) return;

  const allNames = getNamesByCategory(rows, selectedCategory);

  $("#form").empty();

  allNames.forEach((name) => {
    const safeId = toSafeId(name);
    if (checkedSafeIds.includes(safeId)) {
      addFormRow(name);
    }
  });

  enableInputKeyNavigation();
  updateFormInput(path)
}

/**
 * Add a new form row with a label and input field.
 *
 * @param {string} label - Human-readable label (e.g., "Father Name 2").
 */
export function addFormRow(label) {
  const safeId = toSafeId(label);

  const $row = $("<div>", {
    class: "form-row",
    "data-label": label,
  });

  const $label = $("<label>", {
    for: safeId,
    text: `${label}:`,
  });

  const $input = $("<input>", {
    type: "text",
    id: safeId,
    name: safeId,
    placeholder: `Enter ${label}`,
    title: `Enter ${label}`,
  });

  const $removeBtn = $("<button>", {
    type: "button",
    class: "remove-row-btn",
    text: "x",
    title: "Remove this Row",
  });

  $row.append($label, $input, $removeBtn);
  $("#form").append($row);
}

/**
 * Enable arrow-key navigation between form inputs.
 */
export function enableInputKeyNavigation() {
  const inputs = $("#form input");

  inputs.off("keydown").on("keydown", function (e) {
    const index = inputs.index(this);

    if (e.key === "ArrowDown" || e.key === "Enter") {
      e.preventDefault();
      const next = inputs[index + 1];
      if (next) next.focus();
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = inputs[index - 1];
      if (prev) prev.focus();
    }
  });
}

export function updateFormInput(path) {
  getUserData(path).then((userDataStr) => {
    const userDataObj = JSON.parse(userDataStr);

    const $formRows = $(".form-row");

    for (const [key, value] of Object.entries(userDataObj)) {
      const safeId = "#" + toSafeId(key);
      $($formRows.find(safeId)).val(value)
    }
  });
}