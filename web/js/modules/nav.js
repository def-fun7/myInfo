/**
 * @file nav.js
 * @description Navigation bar logic
 */

export const categories = [
  "Education",
  "Finance",
  "Personal",
  "Social",
  "Work",
];

/**
 * Populate navigation bar with category buttons.
 * Default: 'Personal' is active on load.
 */
export function populateNav() {
  const nav = document.querySelector("nav");
  nav.innerHTML = "";

  categories.forEach((category) => {
    const div = document.createElement("div");
    div.className = "nav-btn";
    div.id = `btn-${category.toLowerCase()}`;
    div.textContent = category;

    if (category === "Personal") div.classList.add("active");

    div.addEventListener("click", () => {
      document
        .querySelectorAll(".nav-btn")
        .forEach((btn) => btn.classList.remove("active"));
      div.classList.add("active");
    });

    nav.appendChild(div);
  });
}

/** Get currently selected category */
export function getSelectedCategory() {
  const activeBtn = document.querySelector(".nav-btn.active");
  return activeBtn ? activeBtn.textContent : null;
}
