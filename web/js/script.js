/**
 * @file main.js
 * @description Entry point: orchestrates navigation, rendering, and search
 */

import { fetchAllFields } from "./modules/api.js";
import { populateNav, getSelectedCategory } from "./modules/nav.js";
import { groupBySubcategory } from "./modules/grouping.js";
import { renderSubcategories } from "./modules/render.js";
import { refreshSearchSuggestions } from "./modules/search.js";

function refreshSubcategories(rows) {
  const selectedCategory = getSelectedCategory();
  if (!selectedCategory) return;
  renderSubcategories(groupBySubcategory(rows, selectedCategory));
}

$(function () {
  fetchAllFields().then((rows) => {
    console.log(rows);
    populateNav();
    refreshSubcategories(rows);
    refreshSearchSuggestions(rows);

    $(".nav-btn").on("click", function () {
      $(".nav-btn").removeClass("active");
      $(this).addClass("active");
      refreshSubcategories(rows);
      refreshSearchSuggestions(rows);
    });
  });
});
