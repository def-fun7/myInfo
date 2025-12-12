/**
 * @file grouping.js
 * @description Group rows by subcategory
 */

/**
 * Group rows by subcategory, filtered by selected category.
 * @param {Array<Object>} rows
 * @param {string} selectedCategory
 * @returns {Object} subcategory → [[name, multiplicity]]
 */
export function groupBySubcategory(rows, selectedCategory) {
  return rows.reduce((acc, row) => {
    if (row.category === selectedCategory) {
      acc[row.subcategory] = acc[row.subcategory] || [];
      acc[row.subcategory].push([row.name, row.multiplicity]);
    }
    return acc;
  }, {});
}

/**
 * Get a list of names filtered by selected category.
 * @param {Array<Object>} rows - Array of row objects, each containing at least `category` and `name`.
 * @param {string} selectedCategory - The category to filter rows by.
 * @returns {Array<string>} A list of names belonging to the selected category.
 */

export function getNamesByCategory(rows, selectedCategory) {
  return rows
    .filter(row => row.category === selectedCategory)
    .map(row => row.name);
}
