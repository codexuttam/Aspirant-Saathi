/**
 * Counts the number of words in a given text string.
 * @param {string} text - The input text.
 * @returns {number} The word count.
 */
export function countWords(text) {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter((word) => word.length > 0).length;
}
