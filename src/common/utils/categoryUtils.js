/**
 * Utility functions for Category Range Mapping in Finance Desktop App.
 *
 * Exact Category Ranges:
 * - Category B: 1 – 299
 * - Category A: 300 – 600
 * - Category C: 601 – 1000
 * - Category D: 1001 – 1500
 * - Category E: 1501 – 2000
 * - Category F: 2001 – 2500
 * - Category G: 2501 – 3000
 * - Subsequent categories follow the same 500-count range pattern.
 */

/**
 * Get min and max number range for a given category name.
 * @param {string} category 
 * @returns {{ min: number, max: number } | null}
 */
export const getCategoryRange = (category) => {
  if (!category) return null;
  const cat = category.toString().trim().toUpperCase();
  if (cat === 'B') return { min: 1, max: 299 };
  if (cat === 'A') return { min: 300, max: 600 };
  if (cat === 'C') return { min: 601, max: 1000 };

  // Calculate index for letters starting from D (idx >= 3)
  let idx = 0;
  for (let i = 0; i < cat.length; i++) {
    idx = idx * 26 + (cat.charCodeAt(i) - 65 + 1);
  }
  idx = idx - 1; // 0 for A, 1 for B, 2 for C, 3 for D, 4 for E, etc.

  if (idx < 3) return null; // A, B, C handled explicitly above

  const min = 1001 + (idx - 3) * 500;
  const max = min + 499;
  return { min, max };
};

/**
 * Get category name for a given customer number.
 * @param {number | string} num 
 * @returns {string | null}
 */
export const getCategoryFromNumber = (num) => {
  const n = Number(num);
  if (isNaN(n) || n < 1) return null;

  if (n >= 1 && n <= 299) return 'B';
  if (n >= 300 && n <= 600) return 'A';
  if (n >= 601 && n <= 1000) return 'C';

  // For n >= 1001, calculate category from D onwards
  const offset = n - 1001;
  const index = Math.floor(offset / 500); // 0 for D, 1 for E, 2 for F, 3 for G, ...
  const categoryIdx = 3 + index; // 3 for D, 4 for E, etc.

  let idx = categoryIdx;
  let result = '';
  while (idx >= 0) {
    result = String.fromCharCode((idx % 26) + 65) + result;
    idx = Math.floor(idx / 26) - 1;
  }
  return result;
};

/**
 * Validate if a customer number falls within the specified category's range.
 * @param {number | string} num 
 * @param {string} category 
 * @returns {boolean}
 */
export const isNumberInCategory = (num, category) => {
  const range = getCategoryRange(category);
  if (!range) return false;
  const n = Number(num);
  if (isNaN(n)) return false;
  return n >= range.min && n <= range.max;
};
