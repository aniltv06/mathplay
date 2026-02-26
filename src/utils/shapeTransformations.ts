/**
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

/**
 * Shape Transformations Utilities
 * Functions for rotating, reflecting, translating, and scaling shapes
 */

export type TransformationType = 'rotate' | 'reflect' | 'translate' | 'scale';

type TransformationParams =
  | { type: 'rotate'; params: { angle: number } }
  | { type: 'reflect'; params: { axis: 'vertical' | 'horizontal' | 'diagonal'; axisValue?: number } }
  | { type: 'translate'; params: { dx: number; dy: number } }
  | { type: 'scale'; params: { scaleX: number; scaleY?: number } };

export interface Point {
  x: number;
  y: number;
}

export interface TransformationResult {
  type: TransformationType;
  originalPath: string;
  transformedPath: string;
  description: string;
  matrix?: string; // SVG transform matrix
}

// ==================== SVG PATH PARSING ====================

/**
 * Parse simple SVG path into points
 * Handles M (moveto), L (lineto), Z (closepath) commands
 */
export function parseSVGPath(path: string): Point[] {
  const points: Point[] = [];
  const commands = path.match(/[ML]\s*[\d\s.,]+|Z/gi) || [];

  commands.forEach(cmd => {
    const type = cmd[0].toUpperCase();
    if (type === 'M' || type === 'L') {
      const coords = cmd.slice(1).trim().split(/[\s,]+/).map(Number);
      for (let i = 0; i < coords.length; i += 2) {
        if (!isNaN(coords[i]) && !isNaN(coords[i + 1])) {
          points.push({ x: coords[i], y: coords[i + 1] });
        }
      }
    }
  });

  return points;
}

/**
 * Convert points array back to SVG path string
 */
export function pointsToSVGPath(points: Point[]): string {
  if (points.length === 0) return '';

  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    path += ` L ${points[i].x} ${points[i].y}`;
  }
  path += ' Z';

  return path;
}

// ==================== ROTATION ====================

/**
 * Rotate a point around a center point by angle (in degrees)
 */
export function rotatePoint(point: Point, center: Point, angleDegrees: number): Point {
  const angleRadians = (angleDegrees * Math.PI) / 180;
  const cos = Math.cos(angleRadians);
  const sin = Math.sin(angleRadians);

  // Translate point to origin
  const translatedX = point.x - center.x;
  const translatedY = point.y - center.y;

  // Rotate
  const rotatedX = translatedX * cos - translatedY * sin;
  const rotatedY = translatedX * sin + translatedY * cos;

  // Translate back
  return {
    x: rotatedX + center.x,
    y: rotatedY + center.y,
  };
}

/**
 * Rotate an SVG path by angle (in degrees) around its center
 */
export function rotatePath(path: string, angleDegrees: number): TransformationResult {
  const points = parseSVGPath(path);

  // Calculate center point
  const sumX = points.reduce((sum, p) => sum + p.x, 0);
  const sumY = points.reduce((sum, p) => sum + p.y, 0);
  const center: Point = {
    x: sumX / points.length,
    y: sumY / points.length,
  };

  // Rotate all points
  const rotatedPoints = points.map(p => rotatePoint(p, center, angleDegrees));
  const transformedPath = pointsToSVGPath(rotatedPoints);

  return {
    type: 'rotate',
    originalPath: path,
    transformedPath,
    description: `Rotated ${angleDegrees}° clockwise around center point (${center.x.toFixed(1)}, ${center.y.toFixed(1)})`,
    matrix: `rotate(${angleDegrees} ${center.x} ${center.y})`,
  };
}

// ==================== REFLECTION ====================

/**
 * Reflect a point across a vertical line (x = axis)
 */
export function reflectPointVertical(point: Point, axis: number): Point {
  return {
    x: 2 * axis - point.x,
    y: point.y,
  };
}

/**
 * Reflect a point across a horizontal line (y = axis)
 */
export function reflectPointHorizontal(point: Point, axis: number): Point {
  return {
    x: point.x,
    y: 2 * axis - point.y,
  };
}

/**
 * Reflect a point across a diagonal line (y = x)
 */
export function reflectPointDiagonal(point: Point): Point {
  return {
    x: point.y,
    y: point.x,
  };
}

/**
 * Reflect an SVG path across an axis
 */
export function reflectPath(
  path: string,
  axis: 'vertical' | 'horizontal' | 'diagonal',
  axisValue?: number
): TransformationResult {
  const points = parseSVGPath(path);

  let reflectedPoints: Point[];
  let description: string;
  let matrix: string;

  if (axis === 'vertical') {
    const axisX = axisValue ?? 50; // Default center
    reflectedPoints = points.map(p => reflectPointVertical(p, axisX));
    description = `Reflected across vertical line x = ${axisX}`;
    matrix = `matrix(-1 0 0 1 ${axisX * 2} 0)`;
  } else if (axis === 'horizontal') {
    const axisY = axisValue ?? 50; // Default center
    reflectedPoints = points.map(p => reflectPointHorizontal(p, axisY));
    description = `Reflected across horizontal line y = ${axisY}`;
    matrix = `matrix(1 0 0 -1 0 ${axisY * 2})`;
  } else {
    reflectedPoints = points.map(p => reflectPointDiagonal(p));
    description = 'Reflected across diagonal line y = x';
    matrix = 'matrix(0 1 1 0 0 0)';
  }

  const transformedPath = pointsToSVGPath(reflectedPoints);

  return {
    type: 'reflect',
    originalPath: path,
    transformedPath,
    description,
    matrix,
  };
}

// ==================== TRANSLATION ====================

/**
 * Translate (move) a point by dx and dy
 */
export function translatePoint(point: Point, dx: number, dy: number): Point {
  return {
    x: point.x + dx,
    y: point.y + dy,
  };
}

/**
 * Translate an SVG path
 */
export function translatePath(path: string, dx: number, dy: number): TransformationResult {
  const points = parseSVGPath(path);
  const translatedPoints = points.map(p => translatePoint(p, dx, dy));
  const transformedPath = pointsToSVGPath(translatedPoints);

  return {
    type: 'translate',
    originalPath: path,
    transformedPath,
    description: `Moved ${dx > 0 ? 'right' : 'left'} by ${Math.abs(dx)} units and ${dy > 0 ? 'down' : 'up'} by ${Math.abs(dy)} units`,
    matrix: `translate(${dx} ${dy})`,
  };
}

// ==================== SCALING ====================

/**
 * Scale a point relative to a center point
 */
export function scalePoint(point: Point, center: Point, scaleX: number, scaleY: number): Point {
  return {
    x: center.x + (point.x - center.x) * scaleX,
    y: center.y + (point.y - center.y) * scaleY,
  };
}

/**
 * Scale an SVG path
 */
export function scalePath(path: string, scaleX: number, scaleY?: number): TransformationResult {
  const sy = scaleY ?? scaleX; // Uniform scaling if scaleY not provided
  const points = parseSVGPath(path);

  // Calculate center point
  const sumX = points.reduce((sum, p) => sum + p.x, 0);
  const sumY = points.reduce((sum, p) => sum + p.y, 0);
  const center: Point = {
    x: sumX / points.length,
    y: sumY / points.length,
  };

  // Scale all points
  const scaledPoints = points.map(p => scalePoint(p, center, scaleX, sy));
  const transformedPath = pointsToSVGPath(scaledPoints);

  const description = scaleX === sy
    ? `Scaled by ${scaleX}× (${scaleX > 1 ? 'enlarged' : 'reduced'})`
    : `Scaled horizontally by ${scaleX}× and vertically by ${sy}×`;

  return {
    type: 'scale',
    originalPath: path,
    transformedPath,
    description,
    matrix: `matrix(${scaleX} 0 0 ${sy} ${center.x * (1 - scaleX)} ${center.y * (1 - sy)})`,
  };
}

// ==================== COMPOSITION ====================

/**
 * Apply multiple transformations in sequence
 */
export function composeTransformations(
  path: string,
  transformations: TransformationParams[]
): TransformationResult[] {
  const results: TransformationResult[] = [];
  let currentPath = path;

  transformations.forEach(transform => {
    let result: TransformationResult;

    switch (transform.type) {
      case 'rotate':
        result = rotatePath(currentPath, transform.params.angle);
        break;
      case 'reflect':
        result = reflectPath(currentPath, transform.params.axis, transform.params.axisValue);
        break;
      case 'translate':
        result = translatePath(currentPath, transform.params.dx, transform.params.dy);
        break;
      case 'scale':
        result = scalePath(currentPath, transform.params.scaleX, transform.params.scaleY);
        break;
      default:
        return;
    }

    results.push(result);
    currentPath = result.transformedPath;
  });

  return results;
}

// ==================== SYMMETRY DETECTION ====================

/**
 * Check if a shape has vertical line symmetry
 */
export function hasVerticalSymmetry(path: string, tolerance = 1): boolean {
  const points = parseSVGPath(path);

  // Find center x
  const minX = Math.min(...points.map(p => p.x));
  const maxX = Math.max(...points.map(p => p.x));
  const centerX = (minX + maxX) / 2;

  // Check if each point has a mirror point
  for (const point of points) {
    const mirroredX = 2 * centerX - point.x;
    const hasMirror = points.some(
      p => Math.abs(p.x - mirroredX) < tolerance && Math.abs(p.y - point.y) < tolerance
    );
    if (!hasMirror) return false;
  }

  return true;
}

/**
 * Check if a shape has horizontal line symmetry
 */
export function hasHorizontalSymmetry(path: string, tolerance = 1): boolean {
  const points = parseSVGPath(path);

  // Find center y
  const minY = Math.min(...points.map(p => p.y));
  const maxY = Math.max(...points.map(p => p.y));
  const centerY = (minY + maxY) / 2;

  // Check if each point has a mirror point
  for (const point of points) {
    const mirroredY = 2 * centerY - point.y;
    const hasMirror = points.some(
      p => Math.abs(p.x - point.x) < tolerance && Math.abs(p.y - mirroredY) < tolerance
    );
    if (!hasMirror) return false;
  }

  return true;
}

/**
 * Check if a shape has rotational symmetry of given order
 */
export function hasRotationalSymmetry(path: string, order: number, tolerance = 1): boolean {
  const angleDegrees = 360 / order;
  const points = parseSVGPath(path);

  // Calculate center
  const sumX = points.reduce((sum, p) => sum + p.x, 0);
  const sumY = points.reduce((sum, p) => sum + p.y, 0);
  const center: Point = { x: sumX / points.length, y: sumY / points.length };

  // Check if rotating by angle gives the same shape
  for (const point of points) {
    const rotated = rotatePoint(point, center, angleDegrees);
    const hasMatch = points.some(
      p => Math.abs(p.x - rotated.x) < tolerance && Math.abs(p.y - rotated.y) < tolerance
    );
    if (!hasMatch) return false;
  }

  return true;
}

/**
 * Get all symmetries of a shape
 */
export function getSymmetries(path: string): {
  vertical: boolean;
  horizontal: boolean;
  rotational: number[]; // Orders of rotational symmetry (e.g., [2, 4] for a square)
} {
  const vertical = hasVerticalSymmetry(path);
  const horizontal = hasHorizontalSymmetry(path);
  const rotational: number[] = [];

  // Check for common rotational symmetries
  for (const order of [2, 3, 4, 5, 6, 8]) {
    if (hasRotationalSymmetry(path, order)) {
      rotational.push(order);
    }
  }

  return { vertical, horizontal, rotational };
}
