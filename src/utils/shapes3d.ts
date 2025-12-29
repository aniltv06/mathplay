/**
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

/**
 * 3D Shapes Learning Data
 * Comprehensive 3D shape definitions with properties, formulas, and examples
 */

export interface Shape3D {
  id: string;
  name: string;
  faces: number;
  edges: number;
  vertices: number;
  properties: string[];
  realWorldExamples: string[];
  color: string;
  difficulty: 'easy' | 'medium' | 'hard';
  volumeFormula: string;
  surfaceAreaFormula: string;
  funFact: string;
  // Isometric SVG path for visual representation
  svgIsometric: string;
  // Net diagram (unfolded shape) as array of 2D shapes
  netDiagram: {
    shape: string; // 'square', 'rectangle', 'triangle', 'circle'
    position: { x: number; y: number };
    size: { width: number; height: number };
  }[];
}

export const SHAPES_3D: Shape3D[] = [
  // Easy 3D Shapes
  {
    id: 'cube',
    name: 'Cube',
    faces: 6,
    edges: 12,
    vertices: 8,
    properties: [
      'All faces are squares',
      'All edges are equal length',
      'All angles are 90 degrees',
      'Has 8 corners',
    ],
    realWorldExamples: ['Dice', 'Rubik\'s Cube', 'Ice cube', 'Gift box', 'Building block', 'Sugar cube'],
    color: '#FF6B6B',
    difficulty: 'easy',
    volumeFormula: 'V = side³',
    surfaceAreaFormula: 'SA = 6 × side²',
    funFact: 'A cube is the only shape where all faces, edges, and angles are exactly the same!',
    svgIsometric: 'M 50 20 L 80 35 L 80 65 L 50 80 L 20 65 L 20 35 Z M 50 20 L 50 50 M 80 35 L 50 50 M 50 50 L 50 80',
    netDiagram: [
      { shape: 'square', position: { x: 50, y: 0 }, size: { width: 30, height: 30 } },
      { shape: 'square', position: { x: 20, y: 30 }, size: { width: 30, height: 30 } },
      { shape: 'square', position: { x: 50, y: 30 }, size: { width: 30, height: 30 } },
      { shape: 'square', position: { x: 80, y: 30 }, size: { width: 30, height: 30 } },
      { shape: 'square', position: { x: 110, y: 30 }, size: { width: 30, height: 30 } },
      { shape: 'square', position: { x: 50, y: 60 }, size: { width: 30, height: 30 } },
    ],
  },
  {
    id: 'sphere',
    name: 'Sphere',
    faces: 1,
    edges: 0,
    vertices: 0,
    properties: [
      'Perfectly round',
      'No edges or corners',
      'Every point on surface is same distance from center',
      'Rolls smoothly',
    ],
    realWorldExamples: ['Basketball', 'Globe', 'Orange', 'Marble', 'Bubble', 'Earth'],
    color: '#4ECDC4',
    difficulty: 'easy',
    volumeFormula: 'V = (4/3) × π × radius³',
    surfaceAreaFormula: 'SA = 4 × π × radius²',
    funFact: 'A sphere has the smallest surface area of any shape with the same volume!',
    svgIsometric: 'M 50 50 m -30 0 a 30 30 0 1 0 60 0 a 30 30 0 1 0 -60 0',
    netDiagram: [
      { shape: 'circle', position: { x: 50, y: 50 }, size: { width: 60, height: 60 } },
    ],
  },
  {
    id: 'cylinder',
    name: 'Cylinder',
    faces: 3,
    edges: 2,
    vertices: 0,
    properties: [
      'Two circular faces',
      'One curved surface',
      'Faces are parallel',
      'Rolls sideways',
    ],
    realWorldExamples: ['Soda can', 'Toilet paper roll', 'Drum', 'Pipe', 'Battery', 'Coin stack'],
    color: '#95E1D3',
    difficulty: 'easy',
    volumeFormula: 'V = π × radius² × height',
    surfaceAreaFormula: 'SA = 2πr² + 2πrh',
    funFact: 'Ancient Egyptians used cylinders to transport heavy stone blocks for pyramids!',
    svgIsometric: 'M 30 30 A 20 8 0 0 0 70 30 L 70 70 A 20 8 0 0 0 30 70 Z M 30 30 A 20 8 0 0 1 70 30',
    netDiagram: [
      { shape: 'circle', position: { x: 30, y: 0 }, size: { width: 40, height: 40 } },
      { shape: 'rectangle', position: { x: 0, y: 40 }, size: { width: 100, height: 40 } },
      { shape: 'circle', position: { x: 30, y: 80 }, size: { width: 40, height: 40 } },
    ],
  },
  {
    id: 'cone',
    name: 'Cone',
    faces: 2,
    edges: 1,
    vertices: 1,
    properties: [
      'One circular base',
      'One curved surface',
      'Comes to a point at top',
      'One vertex (tip)',
    ],
    realWorldExamples: ['Ice cream cone', 'Party hat', 'Traffic cone', 'Funnel', 'Megaphone', 'Volcano'],
    color: '#FFB84C',
    difficulty: 'easy',
    volumeFormula: 'V = (1/3) × π × radius² × height',
    surfaceAreaFormula: 'SA = πr² + πrl',
    funFact: 'Volcanoes naturally form cone shapes because lava flows equally in all directions!',
    svgIsometric: 'M 50 15 L 75 70 A 25 8 0 0 0 25 70 Z M 25 70 A 25 8 0 0 1 75 70',
    netDiagram: [
      { shape: 'circle', position: { x: 35, y: 60 }, size: { width: 30, height: 30 } },
      { shape: 'triangle', position: { x: 25, y: 0 }, size: { width: 50, height: 60 } },
    ],
  },

  // Medium 3D Shapes
  {
    id: 'rectangular-prism',
    name: 'Rectangular Prism',
    faces: 6,
    edges: 12,
    vertices: 8,
    properties: [
      'All faces are rectangles',
      'Opposite faces are equal',
      '12 edges',
      '8 vertices',
    ],
    realWorldExamples: ['Book', 'Shoebox', 'Brick', 'Cereal box', 'Smartphone', 'Building'],
    color: '#F38181',
    difficulty: 'medium',
    volumeFormula: 'V = length × width × height',
    surfaceAreaFormula: 'SA = 2(lw + lh + wh)',
    funFact: 'Most buildings are rectangular prisms because they use space efficiently!',
    svgIsometric: 'M 35 25 L 70 25 L 70 55 L 35 55 Z M 35 25 L 45 15 L 80 15 L 70 25 M 70 25 L 80 15 L 80 45 L 70 55',
    netDiagram: [
      { shape: 'rectangle', position: { x: 40, y: 0 }, size: { width: 40, height: 25 } },
      { shape: 'rectangle', position: { x: 10, y: 25 }, size: { width: 30, height: 40 } },
      { shape: 'rectangle', position: { x: 40, y: 25 }, size: { width: 40, height: 40 } },
      { shape: 'rectangle', position: { x: 80, y: 25 }, size: { width: 30, height: 40 } },
      { shape: 'rectangle', position: { x: 110, y: 25 }, size: { width: 40, height: 40 } },
      { shape: 'rectangle', position: { x: 40, y: 65 }, size: { width: 40, height: 25 } },
    ],
  },
  {
    id: 'pyramid',
    name: 'Square Pyramid',
    faces: 5,
    edges: 8,
    vertices: 5,
    properties: [
      'Square base',
      '4 triangular faces',
      '1 vertex at top',
      'All triangles meet at apex',
    ],
    realWorldExamples: ['Egyptian pyramids', 'Roof', 'Tent', 'Mountain peak', 'Pyramid toy'],
    color: '#AA96DA',
    difficulty: 'medium',
    volumeFormula: 'V = (1/3) × base² × height',
    surfaceAreaFormula: 'SA = base² + 2 × base × slant',
    funFact: 'The Great Pyramid of Giza was the tallest building for over 3,800 years!',
    svgIsometric: 'M 50 15 L 75 65 L 50 75 L 25 65 Z M 50 15 L 25 65 M 50 15 L 75 65',
    netDiagram: [
      { shape: 'square', position: { x: 40, y: 40 }, size: { width: 40, height: 40 } },
      { shape: 'triangle', position: { x: 40, y: 0 }, size: { width: 40, height: 40 } },
      { shape: 'triangle', position: { x: 0, y: 40 }, size: { width: 40, height: 40 } },
      { shape: 'triangle', position: { x: 80, y: 40 }, size: { width: 40, height: 40 } },
      { shape: 'triangle', position: { x: 40, y: 80 }, size: { width: 40, height: 40 } },
    ],
  },
  {
    id: 'triangular-prism',
    name: 'Triangular Prism',
    faces: 5,
    edges: 9,
    vertices: 6,
    properties: [
      '2 triangular faces',
      '3 rectangular faces',
      '9 edges',
      '6 vertices',
    ],
    realWorldExamples: ['Toblerone box', 'Tent', 'Roof', 'Prism toy', 'Camping shelter'],
    color: '#6BCB77',
    difficulty: 'medium',
    volumeFormula: 'V = (1/2) × base × height × length',
    surfaceAreaFormula: 'SA = bh + (a+b+c)l',
    funFact: 'Glass prisms split white light into rainbow colors!',
    svgIsometric: 'M 50 20 L 70 50 L 30 50 Z M 30 50 L 35 60 L 75 60 L 70 50 M 75 60 L 55 30 L 50 20',
    netDiagram: [
      { shape: 'triangle', position: { x: 0, y: 25 }, size: { width: 40, height: 35 } },
      { shape: 'rectangle', position: { x: 40, y: 0 }, size: { width: 50, height: 25 } },
      { shape: 'rectangle', position: { x: 40, y: 25 }, size: { width: 50, height: 35 } },
      { shape: 'rectangle', position: { x: 40, y: 60 }, size: { width: 50, height: 25 } },
      { shape: 'triangle', position: { x: 90, y: 25 }, size: { width: 40, height: 35 } },
    ],
  },
  {
    id: 'torus',
    name: 'Torus',
    faces: 1,
    edges: 0,
    vertices: 0,
    properties: [
      'Donut shape',
      'Circular hole in middle',
      'No edges or vertices',
      'Continuous curved surface',
    ],
    realWorldExamples: ['Donut', 'Life preserver', 'Ring', 'Tire', 'Bagel', 'Hula hoop'],
    color: '#FF6B9D',
    difficulty: 'hard',
    volumeFormula: 'V = 2π²Rr²',
    surfaceAreaFormula: 'SA = 4π²Rr',
    funFact: 'A torus is topologically equivalent to a coffee cup with a handle!',
    svgIsometric: 'M 50 50 m -35 0 a 35 35 0 1 0 70 0 a 35 35 0 1 0 -70 0 M 50 50 m -20 0 a 20 20 0 1 0 40 0 a 20 20 0 1 0 -40 0',
    netDiagram: [
      { shape: 'circle', position: { x: 20, y: 20 }, size: { width: 60, height: 60 } },
      { shape: 'circle', position: { x: 35, y: 35 }, size: { width: 30, height: 30 } },
    ],
  },
];

// Helper functions
export function getShape3DByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): Shape3D[] {
  return SHAPES_3D.filter(shape => shape.difficulty === difficulty);
}

export function getRandomShape3D(): Shape3D {
  return SHAPES_3D[Math.floor(Math.random() * SHAPES_3D.length)];
}

export function getRandomShapes3D(count: number): Shape3D[] {
  const shuffled = [...SHAPES_3D].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, SHAPES_3D.length));
}

export function getShape3DById(id: string): Shape3D | undefined {
  return SHAPES_3D.find(shape => shape.id === id);
}

// Calculate volume based on shape type and dimensions
export function calculateVolume(shapeId: string, dimensions: Record<string, number>): number {
  const shape = getShape3DById(shapeId);
  if (!shape) return 0;

  switch (shapeId) {
    case 'cube':
      return Math.pow(dimensions.side || 0, 3);
    case 'sphere':
      return (4 / 3) * Math.PI * Math.pow(dimensions.radius || 0, 3);
    case 'cylinder':
      return Math.PI * Math.pow(dimensions.radius || 0, 2) * (dimensions.height || 0);
    case 'cone':
      return (1 / 3) * Math.PI * Math.pow(dimensions.radius || 0, 2) * (dimensions.height || 0);
    case 'rectangular-prism':
      return (dimensions.length || 0) * (dimensions.width || 0) * (dimensions.height || 0);
    case 'pyramid':
      return (1 / 3) * Math.pow(dimensions.base || 0, 2) * (dimensions.height || 0);
    case 'triangular-prism':
      return (1 / 2) * (dimensions.base || 0) * (dimensions.height || 0) * (dimensions.length || 0);
    case 'torus':
      const R = dimensions.majorRadius || 0;
      const r = dimensions.minorRadius || 0;
      return 2 * Math.PI * Math.PI * R * r * r;
    default:
      return 0;
  }
}

// Calculate surface area based on shape type and dimensions
export function calculateSurfaceArea(shapeId: string, dimensions: Record<string, number>): number {
  const shape = getShape3DById(shapeId);
  if (!shape) return 0;

  switch (shapeId) {
    case 'cube':
      return 6 * Math.pow(dimensions.side || 0, 2);
    case 'sphere':
      return 4 * Math.PI * Math.pow(dimensions.radius || 0, 2);
    case 'cylinder':
      const r = dimensions.radius || 0;
      const h = dimensions.height || 0;
      return 2 * Math.PI * r * r + 2 * Math.PI * r * h;
    case 'cone':
      const rc = dimensions.radius || 0;
      const l = dimensions.slant || 0;
      return Math.PI * rc * rc + Math.PI * rc * l;
    case 'rectangular-prism':
      const length = dimensions.length || 0;
      const width = dimensions.width || 0;
      const height = dimensions.height || 0;
      return 2 * (length * width + length * height + width * height);
    case 'pyramid':
      const base = dimensions.base || 0;
      const slant = dimensions.slant || 0;
      return base * base + 2 * base * slant;
    case 'triangular-prism':
      const b = dimensions.base || 0;
      const hp = dimensions.height || 0;
      const len = dimensions.length || 0;
      const a = dimensions.sideA || b;
      const c = dimensions.sideB || b;
      return b * hp + (a + b + c) * len;
    case 'torus':
      const majorR = dimensions.majorRadius || 0;
      const minorR = dimensions.minorRadius || 0;
      return 4 * Math.PI * Math.PI * majorR * minorR;
    default:
      return 0;
  }
}
