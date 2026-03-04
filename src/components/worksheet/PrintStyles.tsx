/**
 * Print Styles Component
 * Handles the dynamic body cursor/selection styles during column resizing.
 * All static worksheet styles live in src/styles/worksheet.css.
 */

interface PrintStylesProps {
  isResizing: boolean;
}

export function PrintStyles({ isResizing }: PrintStylesProps) {
  if (!isResizing) return null;
  return (
    <style>{`
      body {
        user-select: none;
        cursor: col-resize;
      }
    `}</style>
  );
}
