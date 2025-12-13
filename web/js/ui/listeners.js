import { getCheckedItems } from "../utils/dom.js";
import { toReadableLabel } from "../utils/ids.js";
import { addFormRow, enableInputKeyNavigation } from "../modules/forms.js";
import { saveData } from "../modules/save.js";
import { createMyInfoPage, updateUserData } from "../modules/api.js";
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
    $btn.attr("title", isOpen ? "Expand" : "Collapse");
  });
}

// Function to be called by your 'Save' button
export async function handleSaveClick(dataToSave) {
  const $button = $("#save-button"); // Assuming your save button has this ID
  $button.prop("disabled", true).html("Saving...");

  try {
    // Assume you have a similar JS Promise wrapper for updateUserData
    const result = await updateUserData(dataToSave);
    console.log(result);

    if (result.status === "success") {
      $button.html("✅ Saved!");
    } else if (result.status === "unchanged") {
      $button.html("No Changes.");
    } else {
      // status === 'error'
      alert("Save Error: " + result.message);
      $button.html("❌ Error!");
    }
  } catch (error) {
    alert("Communication Error: " + error);
    $button.html("❌ Error!");
  } finally {
    setTimeout(() => {
      $button
        .prop("disabled", false)
        .html("💾Click me / Press CTRL + ENTER to Save changes💾");
    }, 2000);
  }
}
export function attachSaveData() {
  $(document).on("click", "#save-button", () => {
    saveData();
  });
  $(document).on("keydown", (event) => {
    // 1. Check for the Enter key press
    const isEnter = event.key === "Enter";

    // 2. Check for the Control key (Windows/Linux) or Command key (Mac)
    const isControlOrCommand = event.ctrlKey || event.metaKey;
    if (isControlOrCommand && isEnter) {
      event.preventDefault();
      $("#save-button").click();
    }
  });
}

export function attachDownloadBtn() {
  // The event handler is attached using jQuery's .on('click', ...)
  $(".download-btn").on("click", async function () {
    // Cache the button element
    const $button = $(this);

    // Initial setup: Disable button and set loading text
    $button.prop("disabled", true);
    $button.html("Generating..."); // Use .html() to clear the icon

    try {
      // Assuming your JS function (createMyInfoPage) is accessible globally
      const message = await createMyInfoPage();

      // Success feedback
      alert("Success! " + message);
      console.log(message);
      $button.html("✅ Page Generated!");
    } catch (error) {
      // Error feedback
      alert("Error: " + error);
      console.error("Generation error:", error);
      $button.html("❌ Failed! Try Again");
    } finally {
      // Re-enable button after a moment
      setTimeout(() => {
        $button.prop("disabled", false);
        // Reset button text back to the original text with the icon
        $button.html("📥Generate HTML📥");
      }, 3000);
    }
  });
  $(document).on("keydown", (event) => {
    // 1. Check for the Enter key press
    const isEnter = event.key === "Enter";

    // 2. Check for the Control key (Windows/Linux) or Command key (Mac)
    const isAltKey = event.altKey;
    if (isAltKey && isEnter) {
      event.preventDefault();
      $(".download-btn").click();
    }
  });
}