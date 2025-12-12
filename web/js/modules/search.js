/**
 * @file search.js
 * @description Search bar + suggestions with keyboard navigation
 */

import { getSelectedCategory } from "./nav.js";
import { groupBySubcategory } from "./grouping.js";

export function refreshSearchSuggestions(rows) {
  const selectedCategory = getSelectedCategory();
  if (!selectedCategory) return;

  const allNames = Object.values(groupBySubcategory(rows, selectedCategory))
    .flat()
    .map(([name]) => name);

  attachSearchSuggestions($(".search-bar"), $("#suggestions"), allNames);
}

function attachSearchSuggestions($input, $suggestionsBox, dataList) {
  let currentIndex = -1; // track highlighted suggestion

  $input.on("input", function () {
    const query = $(this).val().toLowerCase();
    $suggestionsBox.empty();
    currentIndex = -1;

    if (query) {
      const filtered = dataList.filter((item) =>
        item.toLowerCase().includes(query)
      );

      filtered.forEach((item) => {
        $("<div>")
          .addClass("suggestion-item")
          .text(item)
          .on("click", () => selectSuggestion(item))
          .appendTo($suggestionsBox);
      });

      $suggestionsBox.toggle(filtered.length > 0);
    } else {
      $suggestionsBox.hide();
    }
  });

  // Keyboard navigation
  $input.on("keydown", function (e) {
    const $items = $suggestionsBox.children(".suggestion-item");
    if (!$items.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      currentIndex = (currentIndex + 1) % $items.length;
      updateHighlight($items, currentIndex);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      currentIndex = (currentIndex - 1 + $items.length) % $items.length;
      updateHighlight($items, currentIndex);
    } else if (e.key === "Enter" && currentIndex >= 0) {
      e.preventDefault();
      const item = $items.eq(currentIndex).text();
      selectSuggestion(item);
    }
  });

  function updateHighlight($items, index) {
    $items.removeClass("highlighted");
    $items.eq(index).addClass("highlighted");
  }

  function selectSuggestion(item) {
    $input.val(item);
    $suggestionsBox.hide();

    const safeId = `dropdown-${item.replace(/\s+/g, "-")}`;
    const $target = $("#" + safeId);
    if ($target.length) {
      $(".subcategory-dropdown").show();
      $("html, body").animate({ scrollTop: $target.offset().top }, 500);
      $target.addClass("highlight");
    }
  }

  // Show suggestions on focus if there's text
  $input.on("focus", function () {
    if ($(this).val()) $suggestionsBox.show();
  });

  // Hide suggestions when clicking outside
  $(document).on("click", (e) => {
    if (!$(e.target).closest(".search").length) $suggestionsBox.hide();
  });
}
