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
