/**
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

/**
 * String formatting utilities
 */

/**
 * Converts a name to Title Case (capitalizes first letter of each word)
 * Examples:
 * - "john doe" → "John Doe"
 * - "alice" → "Alice"
 * - "mary ann smith" → "Mary Ann Smith"
 */
export function formatName(name: string): string {
  if (!name) return '';

  return name
    .trim()
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
