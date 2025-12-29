/**
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

/**
 * Shapes Learning Data
 * Comprehensive shape definitions with properties, examples, and SVG paths
 */

export interface Shape {
  id: string;
  name: string;
  sides: number;
  corners: number;
  properties: string[];
  realWorldExamples: string[];
  color: string;
  difficulty: 'easy' | 'medium' | 'hard';
  svgPath: string;
  funFact: string;
}

export const SHAPES: Shape[] = [
  // Easy Shapes (Ages 3-5)
  {
    id: 'circle',
    name: 'Circle',
    sides: 0,
    corners: 0,
    properties: ['Round', 'No corners', 'No straight sides', 'Same from all sides'],
    realWorldExamples: ['Sun', 'Ball', 'Pizza', 'Wheel', 'Clock', 'Cookie'],
    color: '#FF6B6B',
    difficulty: 'easy',
    svgPath: 'M 50 50 m -40 0 a 40 40 0 1 0 80 0 a 40 40 0 1 0 -80 0',
    funFact: 'A circle has the longest perimeter of any shape with the same area!',
  },
  {
    id: 'square',
    name: 'Square',
    sides: 4,
    corners: 4,
    properties: ['4 equal sides', '4 equal corners', 'All corners are 90 degrees'],
    realWorldExamples: ['Window', 'Dice', 'Chocolate', 'Chess board', 'Cracker', 'Picture frame'],
    color: '#4ECDC4',
    difficulty: 'easy',
    svgPath: 'M 20 20 L 80 20 L 80 80 L 20 80 Z',
    funFact: 'All squares are rectangles, but not all rectangles are squares!',
  },
  {
    id: 'triangle',
    name: 'Triangle',
    sides: 3,
    corners: 3,
    properties: ['3 sides', '3 corners', 'The strongest shape'],
    realWorldExamples: ['Pizza slice', 'Mountain', 'Roof', 'Traffic sign', 'Sandwich', 'Pyramid'],
    color: '#95E1D3',
    difficulty: 'easy',
    svgPath: 'M 50 15 L 85 75 L 15 75 Z',
    funFact: 'Triangles are used in bridges and buildings because they are very strong!',
  },
  {
    id: 'rectangle',
    name: 'Rectangle',
    sides: 4,
    corners: 4,
    properties: ['4 sides', 'Opposite sides are equal', 'All corners are 90 degrees'],
    realWorldExamples: ['Door', 'Book', 'Phone', 'TV', 'Envelope', 'Ruler'],
    color: '#F38181',
    difficulty: 'easy',
    svgPath: 'M 15 30 L 85 30 L 85 70 L 15 70 Z',
    funFact: 'A rectangle has two long sides and two short sides!',
  },

  // Medium Shapes (Ages 6-8)
  {
    id: 'oval',
    name: 'Oval',
    sides: 0,
    corners: 0,
    properties: ['Elongated circle', 'Round', 'No corners', 'Symmetrical'],
    realWorldExamples: ['Egg', 'Rugby ball', 'Watermelon', 'Mirror', 'Track', 'Face'],
    color: '#AA96DA',
    difficulty: 'medium',
    svgPath: 'M 50 50 m -35 0 a 35 25 0 1 0 70 0 a 35 25 0 1 0 -70 0',
    funFact: 'An oval is also called an ellipse in geometry!',
  },
  {
    id: 'heart',
    name: 'Heart',
    sides: 0,
    corners: 1,
    properties: ['Curved', '1 pointy bottom', 'Symmetrical', 'Symbol of love'],
    realWorldExamples: ['Valentine card', 'Love emoji', 'Cookie cutter', 'Balloon', 'Jewelry'],
    color: '#FF6B9D',
    difficulty: 'medium',
    svgPath: 'M 50 75 C 50 75, 20 50, 20 35 C 20 25, 25 20, 35 20 C 45 20, 50 25, 50 35 C 50 25, 55 20, 65 20 C 75 20, 80 25, 80 35 C 80 50, 50 75, 50 75 Z',
    funFact: 'The heart shape doesn\'t look like a real heart, but it represents love!',
  },
  {
    id: 'star',
    name: 'Star',
    sides: 10,
    corners: 10,
    properties: ['5 points', 'Symmetrical', 'Shiny appearance', 'Used for ratings'],
    realWorldExamples: ['Night sky', 'Flag', 'Award', 'Sticker', 'Christmas tree top', 'Sheriff badge'],
    color: '#FFD93D',
    difficulty: 'medium',
    svgPath: 'M 50 15 L 55 38 L 78 38 L 60 52 L 67 75 L 50 62 L 33 75 L 40 52 L 22 38 L 45 38 Z',
    funFact: 'Stars in the sky are actually giant balls of hot gas!',
  },
  {
    id: 'pentagon',
    name: 'Pentagon',
    sides: 5,
    corners: 5,
    properties: ['5 equal sides', '5 equal corners', 'Found in nature'],
    realWorldExamples: ['Home plate (baseball)', 'Pentagon building', 'Flower petals', 'Starfish'],
    color: '#6BCB77',
    difficulty: 'medium',
    svgPath: 'M 50 15 L 85 40 L 70 80 L 30 80 L 15 40 Z',
    funFact: 'The Pentagon building in the US is shaped like a perfect pentagon!',
  },
  {
    id: 'hexagon',
    name: 'Hexagon',
    sides: 6,
    corners: 6,
    properties: ['6 equal sides', '6 equal corners', 'Fits together perfectly'],
    realWorldExamples: ['Honeycomb', 'Turtle shell', 'Snowflake', 'Nut (hardware)', 'Soccer ball patch'],
    color: '#FFB84C',
    difficulty: 'medium',
    svgPath: 'M 50 15 L 75 30 L 75 60 L 50 75 L 25 60 L 25 30 Z',
    funFact: 'Bees use hexagons in their honeycombs because it uses the least wax!',
  },

  // Hard Shapes (Ages 9+)
  {
    id: 'octagon',
    name: 'Octagon',
    sides: 8,
    corners: 8,
    properties: ['8 equal sides', '8 equal corners', 'Used for signs'],
    realWorldExamples: ['Stop sign', 'Umbrella', 'Gazebo roof', 'Table', 'Clock frame'],
    color: '#C44569',
    difficulty: 'hard',
    svgPath: 'M 50 15 L 70 20 L 80 35 L 80 55 L 70 70 L 50 75 L 30 70 L 20 55 L 20 35 L 30 20 Z',
    funFact: 'Octagon means "eight angles" in Greek!',
  },
  {
    id: 'diamond',
    name: 'Diamond',
    sides: 4,
    corners: 4,
    properties: ['4 equal sides', 'Tilted square', '2 acute and 2 obtuse angles', 'Symmetrical'],
    realWorldExamples: ['Playing cards', 'Kite', 'Baseball field', 'Road sign', 'Jewelry'],
    color: '#4DD0E1',
    difficulty: 'hard',
    svgPath: 'M 50 15 L 75 50 L 50 85 L 25 50 Z',
    funFact: 'In geometry, this shape is actually called a rhombus!',
  },
  {
    id: 'trapezoid',
    name: 'Trapezoid',
    sides: 4,
    corners: 4,
    properties: ['4 sides', 'One pair of parallel sides', 'Like a stretched rectangle'],
    realWorldExamples: ['Bucket', 'Boat', 'Table', 'Popcorn box', 'Lamp shade'],
    color: '#9B59B6',
    difficulty: 'hard',
    svgPath: 'M 30 25 L 70 25 L 85 75 L 15 75 Z',
    funFact: 'A trapezoid has exactly one pair of parallel sides!',
  },
];

// Helper functions
export function getShapesByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): Shape[] {
  return SHAPES.filter(shape => shape.difficulty === difficulty);
}

export function getRandomShape(): Shape {
  return SHAPES[Math.floor(Math.random() * SHAPES.length)];
}

export function getRandomShapes(count: number): Shape[] {
  const shuffled = [...SHAPES].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, SHAPES.length));
}

export function getShapeById(id: string): Shape | undefined {
  return SHAPES.find(shape => shape.id === id);
}
