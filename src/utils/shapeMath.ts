/**
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

/**
 * Shape Mathematics Utilities
 * Calculations for area, perimeter, volume, and surface area with step-by-step solutions
 */

export interface CalculationStep {
  description: string;
  formula: string;
  calculation: string;
  result: string;
}

export interface ShapeCalculation {
  result: number;
  unit: string;
  formula: string;
  steps: CalculationStep[];
}

// ==================== 2D SHAPE CALCULATIONS ====================

// Circle
export function calculateCircleArea(radius: number): ShapeCalculation {
  const area = Math.PI * radius * radius;
  return {
    result: area,
    unit: 'square units',
    formula: 'Area = π × r²',
    steps: [
      {
        description: 'Start with the formula',
        formula: 'A = π × r²',
        calculation: '',
        result: '',
      },
      {
        description: 'Substitute the radius',
        formula: `A = π × ${radius}²`,
        calculation: '',
        result: '',
      },
      {
        description: 'Square the radius',
        formula: `A = π × ${radius * radius}`,
        calculation: `${radius} × ${radius} = ${radius * radius}`,
        result: '',
      },
      {
        description: 'Multiply by π',
        formula: `A = ${area.toFixed(2)}`,
        calculation: `π × ${radius * radius} = ${area.toFixed(2)}`,
        result: `${area.toFixed(2)} square units`,
      },
    ],
  };
}

export function calculateCirclePerimeter(radius: number): ShapeCalculation {
  const perimeter = 2 * Math.PI * radius;
  return {
    result: perimeter,
    unit: 'units',
    formula: 'Perimeter = 2 × π × r',
    steps: [
      {
        description: 'Start with the formula',
        formula: 'P = 2 × π × r',
        calculation: '',
        result: '',
      },
      {
        description: 'Substitute the radius',
        formula: `P = 2 × π × ${radius}`,
        calculation: '',
        result: '',
      },
      {
        description: 'Multiply',
        formula: `P = ${perimeter.toFixed(2)}`,
        calculation: `2 × π × ${radius} = ${perimeter.toFixed(2)}`,
        result: `${perimeter.toFixed(2)} units`,
      },
    ],
  };
}

// Square
export function calculateSquareArea(side: number): ShapeCalculation {
  const area = side * side;
  return {
    result: area,
    unit: 'square units',
    formula: 'Area = side²',
    steps: [
      {
        description: 'Start with the formula',
        formula: 'A = side²',
        calculation: '',
        result: '',
      },
      {
        description: 'Substitute the side length',
        formula: `A = ${side}²`,
        calculation: '',
        result: '',
      },
      {
        description: 'Square the side',
        formula: `A = ${area}`,
        calculation: `${side} × ${side} = ${area}`,
        result: `${area} square units`,
      },
    ],
  };
}

export function calculateSquarePerimeter(side: number): ShapeCalculation {
  const perimeter = 4 * side;
  return {
    result: perimeter,
    unit: 'units',
    formula: 'Perimeter = 4 × side',
    steps: [
      {
        description: 'Start with the formula',
        formula: 'P = 4 × side',
        calculation: '',
        result: '',
      },
      {
        description: 'Substitute the side length',
        formula: `P = 4 × ${side}`,
        calculation: '',
        result: '',
      },
      {
        description: 'Multiply',
        formula: `P = ${perimeter}`,
        calculation: `4 × ${side} = ${perimeter}`,
        result: `${perimeter} units`,
      },
    ],
  };
}

// Rectangle
export function calculateRectangleArea(length: number, width: number): ShapeCalculation {
  const area = length * width;
  return {
    result: area,
    unit: 'square units',
    formula: 'Area = length × width',
    steps: [
      {
        description: 'Start with the formula',
        formula: 'A = length × width',
        calculation: '',
        result: '',
      },
      {
        description: 'Substitute the values',
        formula: `A = ${length} × ${width}`,
        calculation: '',
        result: '',
      },
      {
        description: 'Multiply',
        formula: `A = ${area}`,
        calculation: `${length} × ${width} = ${area}`,
        result: `${area} square units`,
      },
    ],
  };
}

export function calculateRectanglePerimeter(length: number, width: number): ShapeCalculation {
  const perimeter = 2 * (length + width);
  return {
    result: perimeter,
    unit: 'units',
    formula: 'Perimeter = 2 × (length + width)',
    steps: [
      {
        description: 'Start with the formula',
        formula: 'P = 2 × (length + width)',
        calculation: '',
        result: '',
      },
      {
        description: 'Substitute the values',
        formula: `P = 2 × (${length} + ${width})`,
        calculation: '',
        result: '',
      },
      {
        description: 'Add inside parentheses',
        formula: `P = 2 × ${length + width}`,
        calculation: `${length} + ${width} = ${length + width}`,
        result: '',
      },
      {
        description: 'Multiply by 2',
        formula: `P = ${perimeter}`,
        calculation: `2 × ${length + width} = ${perimeter}`,
        result: `${perimeter} units`,
      },
    ],
  };
}

// Triangle
export function calculateTriangleArea(base: number, height: number): ShapeCalculation {
  const area = (base * height) / 2;
  return {
    result: area,
    unit: 'square units',
    formula: 'Area = (1/2) × base × height',
    steps: [
      {
        description: 'Start with the formula',
        formula: 'A = (1/2) × base × height',
        calculation: '',
        result: '',
      },
      {
        description: 'Substitute the values',
        formula: `A = (1/2) × ${base} × ${height}`,
        calculation: '',
        result: '',
      },
      {
        description: 'Multiply base and height',
        formula: `A = (1/2) × ${base * height}`,
        calculation: `${base} × ${height} = ${base * height}`,
        result: '',
      },
      {
        description: 'Divide by 2',
        formula: `A = ${area}`,
        calculation: `${base * height} ÷ 2 = ${area}`,
        result: `${area} square units`,
      },
    ],
  };
}

export function calculateTrianglePerimeter(side1: number, side2: number, side3: number): ShapeCalculation {
  const perimeter = side1 + side2 + side3;
  return {
    result: perimeter,
    unit: 'units',
    formula: 'Perimeter = side1 + side2 + side3',
    steps: [
      {
        description: 'Start with the formula',
        formula: 'P = side1 + side2 + side3',
        calculation: '',
        result: '',
      },
      {
        description: 'Substitute the values',
        formula: `P = ${side1} + ${side2} + ${side3}`,
        calculation: '',
        result: '',
      },
      {
        description: 'Add all sides',
        formula: `P = ${perimeter}`,
        calculation: `${side1} + ${side2} + ${side3} = ${perimeter}`,
        result: `${perimeter} units`,
      },
    ],
  };
}

// Pentagon (regular)
export function calculatePentagonArea(side: number): ShapeCalculation {
  const area = (5 * side * side) / (4 * Math.tan(Math.PI / 5));
  return {
    result: area,
    unit: 'square units',
    formula: 'Area = (5 × side²) / (4 × tan(36°))',
    steps: [
      {
        description: 'Start with the formula for a regular pentagon',
        formula: 'A = (5 × side²) / (4 × tan(36°))',
        calculation: '',
        result: '',
      },
      {
        description: 'Substitute the side length',
        formula: `A = (5 × ${side}²) / (4 × tan(36°))`,
        calculation: '',
        result: '',
      },
      {
        description: 'Calculate',
        formula: `A = ${area.toFixed(2)}`,
        calculation: `Using tan(36°) ≈ 0.7265`,
        result: `${area.toFixed(2)} square units`,
      },
    ],
  };
}

export function calculatePentagonPerimeter(side: number): ShapeCalculation {
  const perimeter = 5 * side;
  return {
    result: perimeter,
    unit: 'units',
    formula: 'Perimeter = 5 × side',
    steps: [
      {
        description: 'Start with the formula',
        formula: 'P = 5 × side',
        calculation: '',
        result: '',
      },
      {
        description: 'Substitute the side length',
        formula: `P = 5 × ${side}`,
        calculation: '',
        result: '',
      },
      {
        description: 'Multiply',
        formula: `P = ${perimeter}`,
        calculation: `5 × ${side} = ${perimeter}`,
        result: `${perimeter} units`,
      },
    ],
  };
}

// Hexagon (regular)
export function calculateHexagonArea(side: number): ShapeCalculation {
  const area = (3 * Math.sqrt(3) * side * side) / 2;
  return {
    result: area,
    unit: 'square units',
    formula: 'Area = (3√3 × side²) / 2',
    steps: [
      {
        description: 'Start with the formula for a regular hexagon',
        formula: 'A = (3√3 × side²) / 2',
        calculation: '',
        result: '',
      },
      {
        description: 'Substitute the side length',
        formula: `A = (3√3 × ${side}²) / 2`,
        calculation: '',
        result: '',
      },
      {
        description: 'Calculate',
        formula: `A = ${area.toFixed(2)}`,
        calculation: `Using √3 ≈ 1.732`,
        result: `${area.toFixed(2)} square units`,
      },
    ],
  };
}

export function calculateHexagonPerimeter(side: number): ShapeCalculation {
  const perimeter = 6 * side;
  return {
    result: perimeter,
    unit: 'units',
    formula: 'Perimeter = 6 × side',
    steps: [
      {
        description: 'Start with the formula',
        formula: 'P = 6 × side',
        calculation: '',
        result: '',
      },
      {
        description: 'Substitute the side length',
        formula: `P = 6 × ${side}`,
        calculation: '',
        result: '',
      },
      {
        description: 'Multiply',
        formula: `P = ${perimeter}`,
        calculation: `6 × ${side} = ${perimeter}`,
        result: `${perimeter} units`,
      },
    ],
  };
}

// ==================== 3D SHAPE CALCULATIONS ====================

// Cube
export function calculateCubeVolume(side: number): ShapeCalculation {
  const volume = Math.pow(side, 3);
  return {
    result: volume,
    unit: 'cubic units',
    formula: 'Volume = side³',
    steps: [
      {
        description: 'Start with the formula',
        formula: 'V = side³',
        calculation: '',
        result: '',
      },
      {
        description: 'Substitute the side length',
        formula: `V = ${side}³`,
        calculation: '',
        result: '',
      },
      {
        description: 'Cube the side',
        formula: `V = ${volume}`,
        calculation: `${side} × ${side} × ${side} = ${volume}`,
        result: `${volume} cubic units`,
      },
    ],
  };
}

export function calculateCubeSurfaceArea(side: number): ShapeCalculation {
  const surfaceArea = 6 * side * side;
  return {
    result: surfaceArea,
    unit: 'square units',
    formula: 'Surface Area = 6 × side²',
    steps: [
      {
        description: 'Start with the formula (6 faces, each is a square)',
        formula: 'SA = 6 × side²',
        calculation: '',
        result: '',
      },
      {
        description: 'Substitute the side length',
        formula: `SA = 6 × ${side}²`,
        calculation: '',
        result: '',
      },
      {
        description: 'Square the side',
        formula: `SA = 6 × ${side * side}`,
        calculation: `${side}² = ${side * side}`,
        result: '',
      },
      {
        description: 'Multiply by 6',
        formula: `SA = ${surfaceArea}`,
        calculation: `6 × ${side * side} = ${surfaceArea}`,
        result: `${surfaceArea} square units`,
      },
    ],
  };
}

// Sphere
export function calculateSphereVolume(radius: number): ShapeCalculation {
  const volume = (4 / 3) * Math.PI * Math.pow(radius, 3);
  return {
    result: volume,
    unit: 'cubic units',
    formula: 'Volume = (4/3) × π × r³',
    steps: [
      {
        description: 'Start with the formula',
        formula: 'V = (4/3) × π × r³',
        calculation: '',
        result: '',
      },
      {
        description: 'Substitute the radius',
        formula: `V = (4/3) × π × ${radius}³`,
        calculation: '',
        result: '',
      },
      {
        description: 'Cube the radius',
        formula: `V = (4/3) × π × ${Math.pow(radius, 3)}`,
        calculation: `${radius}³ = ${Math.pow(radius, 3)}`,
        result: '',
      },
      {
        description: 'Calculate',
        formula: `V = ${volume.toFixed(2)}`,
        calculation: `(4/3) × π × ${Math.pow(radius, 3)} = ${volume.toFixed(2)}`,
        result: `${volume.toFixed(2)} cubic units`,
      },
    ],
  };
}

export function calculateSphereSurfaceArea(radius: number): ShapeCalculation {
  const surfaceArea = 4 * Math.PI * radius * radius;
  return {
    result: surfaceArea,
    unit: 'square units',
    formula: 'Surface Area = 4 × π × r²',
    steps: [
      {
        description: 'Start with the formula',
        formula: 'SA = 4 × π × r²',
        calculation: '',
        result: '',
      },
      {
        description: 'Substitute the radius',
        formula: `SA = 4 × π × ${radius}²`,
        calculation: '',
        result: '',
      },
      {
        description: 'Square the radius',
        formula: `SA = 4 × π × ${radius * radius}`,
        calculation: `${radius}² = ${radius * radius}`,
        result: '',
      },
      {
        description: 'Calculate',
        formula: `SA = ${surfaceArea.toFixed(2)}`,
        calculation: `4 × π × ${radius * radius} = ${surfaceArea.toFixed(2)}`,
        result: `${surfaceArea.toFixed(2)} square units`,
      },
    ],
  };
}

// Cylinder
export function calculateCylinderVolume(radius: number, height: number): ShapeCalculation {
  const volume = Math.PI * radius * radius * height;
  return {
    result: volume,
    unit: 'cubic units',
    formula: 'Volume = π × r² × h',
    steps: [
      {
        description: 'Start with the formula',
        formula: 'V = π × r² × h',
        calculation: '',
        result: '',
      },
      {
        description: 'Substitute the values',
        formula: `V = π × ${radius}² × ${height}`,
        calculation: '',
        result: '',
      },
      {
        description: 'Square the radius',
        formula: `V = π × ${radius * radius} × ${height}`,
        calculation: `${radius}² = ${radius * radius}`,
        result: '',
      },
      {
        description: 'Calculate',
        formula: `V = ${volume.toFixed(2)}`,
        calculation: `π × ${radius * radius} × ${height} = ${volume.toFixed(2)}`,
        result: `${volume.toFixed(2)} cubic units`,
      },
    ],
  };
}

export function calculateCylinderSurfaceArea(radius: number, height: number): ShapeCalculation {
  const surfaceArea = 2 * Math.PI * radius * radius + 2 * Math.PI * radius * height;
  return {
    result: surfaceArea,
    unit: 'square units',
    formula: 'Surface Area = 2πr² + 2πrh',
    steps: [
      {
        description: 'Start with the formula (2 circles + curved surface)',
        formula: 'SA = 2πr² + 2πrh',
        calculation: '',
        result: '',
      },
      {
        description: 'Substitute the values',
        formula: `SA = 2π(${radius})² + 2π(${radius})(${height})`,
        calculation: '',
        result: '',
      },
      {
        description: 'Calculate the two parts',
        formula: `SA = ${(2 * Math.PI * radius * radius).toFixed(2)} + ${(2 * Math.PI * radius * height).toFixed(2)}`,
        calculation: `Top and bottom circles: ${(2 * Math.PI * radius * radius).toFixed(2)}, Curved surface: ${(2 * Math.PI * radius * height).toFixed(2)}`,
        result: '',
      },
      {
        description: 'Add them together',
        formula: `SA = ${surfaceArea.toFixed(2)}`,
        calculation: `${(2 * Math.PI * radius * radius).toFixed(2)} + ${(2 * Math.PI * radius * height).toFixed(2)} = ${surfaceArea.toFixed(2)}`,
        result: `${surfaceArea.toFixed(2)} square units`,
      },
    ],
  };
}

// Rectangular Prism
export function calculateRectangularPrismVolume(length: number, width: number, height: number): ShapeCalculation {
  const volume = length * width * height;
  return {
    result: volume,
    unit: 'cubic units',
    formula: 'Volume = length × width × height',
    steps: [
      {
        description: 'Start with the formula',
        formula: 'V = length × width × height',
        calculation: '',
        result: '',
      },
      {
        description: 'Substitute the values',
        formula: `V = ${length} × ${width} × ${height}`,
        calculation: '',
        result: '',
      },
      {
        description: 'Multiply',
        formula: `V = ${volume}`,
        calculation: `${length} × ${width} × ${height} = ${volume}`,
        result: `${volume} cubic units`,
      },
    ],
  };
}

export function calculateRectangularPrismSurfaceArea(length: number, width: number, height: number): ShapeCalculation {
  const surfaceArea = 2 * (length * width + length * height + width * height);
  return {
    result: surfaceArea,
    unit: 'square units',
    formula: 'Surface Area = 2(lw + lh + wh)',
    steps: [
      {
        description: 'Start with the formula (6 rectangular faces)',
        formula: 'SA = 2(lw + lh + wh)',
        calculation: '',
        result: '',
      },
      {
        description: 'Substitute the values',
        formula: `SA = 2(${length}×${width} + ${length}×${height} + ${width}×${height})`,
        calculation: '',
        result: '',
      },
      {
        description: 'Calculate each product',
        formula: `SA = 2(${length * width} + ${length * height} + ${width * height})`,
        calculation: `${length}×${width}=${length * width}, ${length}×${height}=${length * height}, ${width}×${height}=${width * height}`,
        result: '',
      },
      {
        description: 'Add inside parentheses',
        formula: `SA = 2(${length * width + length * height + width * height})`,
        calculation: `${length * width} + ${length * height} + ${width * height} = ${length * width + length * height + width * height}`,
        result: '',
      },
      {
        description: 'Multiply by 2',
        formula: `SA = ${surfaceArea}`,
        calculation: `2 × ${length * width + length * height + width * height} = ${surfaceArea}`,
        result: `${surfaceArea} square units`,
      },
    ],
  };
}
