/**
 * @file main.js
 * @description Entry point: orchestrates navigation, rendering, form updates, and search.
 */

import { fetchAllFields } from "./modules/api.js";
import { populateNav, getSelectedCategory } from "./modules/nav.js";
import { groupBySubcategory } from "./modules/grouping.js";
import { renderSubcategories } from "./ui/render.js";
import { refreshSearchSuggestions } from "./modules/search.js";
import { refreshFormRows } from "./modules/forms.js";
import { getCheckedItems } from "./utils/dom.js";
import { attachItemCheckListener } from "./ui/listeners.js";
import {
  attachRowButtons,
  attachExpandButtons,
  attachSaveData,
} from "./ui/listeners.js";


/**
 * Refresh subcategories UI and update form rows accordingly.
 * @param {Array<Object>} rows - All field definitions.
 */
function refreshSubcategories(rows) {
  const selectedCategory = getSelectedCategory();
  if (!selectedCategory) return;

  const grouped = groupBySubcategory(rows, selectedCategory);
  renderSubcategories(grouped);

  const checkedIds = getCheckedItems();
  refreshFormRows(rows, checkedIds);
}

$(function () {
  fetchAllFields().then((rows) => {
    populateNav();
    refreshSubcategories(rows);
    refreshSearchSuggestions(rows);
    attachItemCheckListener((checkedIds) => {
      refreshFormRows(rows, checkedIds);
    });

    attachRowButtons();

    $(".nav-btn").on("click", function () {
      $(".nav-btn").removeClass("active");
      $(this).addClass("active");

      refreshSubcategories(rows);
      refreshSearchSuggestions(rows);
    });
    attachExpandButtons();
    attachSaveData();
  });
});
