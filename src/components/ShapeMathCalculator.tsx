/**
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

/**
 * Shape Mathematics Calculator
 * Interactive calculator for area, perimeter, volume, and surface area
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Calculator, Play, RotateCcw } from 'lucide-react';
import * as shapeMath from '../utils/shapeMath';
import { SHAPES, Shape } from '../utils/shapes';
import { SHAPES_3D, Shape3D } from '../utils/shapes3d';

interface Props {
  onBack: () => void;
  profileId: string;
}

type ShapeType = '2d' | '3d';
type CalculationType = 'area' | 'perimeter' | 'volume' | 'surfaceArea';

export function ShapeMathCalculator({ onBack, profileId }: Props) {
  const [shapeType, setShapeType] = useState<ShapeType>('2d');
  const [selectedShapeId, setSelectedShapeId] = useState<string>('square');
  const [calculationType, setCalculationType] = useState<CalculationType>('area');
  const [dimensions, setDimensions] = useState<Record<string, string>>({});
  const [result, setResult] = useState<shapeMath.ShapeCalculation | null>(null);

  const availableShapes = shapeType === '2d' ? SHAPES : SHAPES_3D;
  const selectedShape = availableShapes.find(s => s.id === selectedShapeId);

  // Get required input fields based on shape and calculation type
  const getRequiredInputs = (): Array<{ name: string; label: string }> => {
    if (!selectedShapeId) return [];

    const inputs: Array<{ name: string; label: string }> = [];

    // 2D Shapes
    if (shapeType === '2d') {
      switch (selectedShapeId) {
        case 'circle':
          inputs.push({ name: 'radius', label: 'Radius' });
          break;
        case 'square':
          inputs.push({ name: 'side', label: 'Side Length' });
          break;
        case 'rectangle':
          inputs.push({ name: 'length', label: 'Length' });
          inputs.push({ name: 'width', label: 'Width' });
          break;
        case 'triangle':
          if (calculationType === 'area') {
            inputs.push({ name: 'base', label: 'Base' });
            inputs.push({ name: 'height', label: 'Height' });
          } else {
            inputs.push({ name: 'side1', label: 'Side 1' });
            inputs.push({ name: 'side2', label: 'Side 2' });
            inputs.push({ name: 'side3', label: 'Side 3' });
          }
          break;
        case 'pentagon':
        case 'hexagon':
          inputs.push({ name: 'side', label: 'Side Length' });
          break;
      }
    } else {
      // 3D Shapes
      switch (selectedShapeId) {
        case 'cube':
          inputs.push({ name: 'side', label: 'Side Length' });
          break;
        case 'sphere':
          inputs.push({ name: 'radius', label: 'Radius' });
          break;
        case 'cylinder':
          inputs.push({ name: 'radius', label: 'Radius' });
          inputs.push({ name: 'height', label: 'Height' });
          break;
        case 'rectangular-prism':
          inputs.push({ name: 'length', label: 'Length' });
          inputs.push({ name: 'width', label: 'Width' });
          inputs.push({ name: 'height', label: 'Height' });
          break;
      }
    }

    return inputs;
  };

  const handleCalculate = () => {
    const inputs = getRequiredInputs();
    const values: Record<string, number> = {};

    // Convert string inputs to numbers
    for (const input of inputs) {
      const value = parseFloat(dimensions[input.name]);
      if (isNaN(value) || value <= 0) {
        alert(`Please enter a valid positive number for ${input.label}`);
        return;
      }
      values[input.name] = value;
    }

    let calculation: shapeMath.ShapeCalculation | null = null;

    // Call appropriate calculation function
    if (shapeType === '2d') {
      if (calculationType === 'area') {
        switch (selectedShapeId) {
          case 'circle':
            calculation = shapeMath.calculateCircleArea(values.radius);
            break;
          case 'square':
            calculation = shapeMath.calculateSquareArea(values.side);
            break;
          case 'rectangle':
            calculation = shapeMath.calculateRectangleArea(values.length, values.width);
            break;
          case 'triangle':
            calculation = shapeMath.calculateTriangleArea(values.base, values.height);
            break;
          case 'pentagon':
            calculation = shapeMath.calculatePentagonArea(values.side);
            break;
          case 'hexagon':
            calculation = shapeMath.calculateHexagonArea(values.side);
            break;
        }
      } else if (calculationType === 'perimeter') {
        switch (selectedShapeId) {
          case 'circle':
            calculation = shapeMath.calculateCirclePerimeter(values.radius);
            break;
          case 'square':
            calculation = shapeMath.calculateSquarePerimeter(values.side);
            break;
          case 'rectangle':
            calculation = shapeMath.calculateRectanglePerimeter(values.length, values.width);
            break;
          case 'triangle':
            calculation = shapeMath.calculateTrianglePerimeter(values.side1, values.side2, values.side3);
            break;
          case 'pentagon':
            calculation = shapeMath.calculatePentagonPerimeter(values.side);
            break;
          case 'hexagon':
            calculation = shapeMath.calculateHexagonPerimeter(values.side);
            break;
        }
      }
    } else {
      if (calculationType === 'volume') {
        switch (selectedShapeId) {
          case 'cube':
            calculation = shapeMath.calculateCubeVolume(values.side);
            break;
          case 'sphere':
            calculation = shapeMath.calculateSphereVolume(values.radius);
            break;
          case 'cylinder':
            calculation = shapeMath.calculateCylinderVolume(values.radius, values.height);
            break;
          case 'rectangular-prism':
            calculation = shapeMath.calculateRectangularPrismVolume(values.length, values.width, values.height);
            break;
        }
      } else if (calculationType === 'surfaceArea') {
        switch (selectedShapeId) {
          case 'cube':
            calculation = shapeMath.calculateCubeSurfaceArea(values.side);
            break;
          case 'sphere':
            calculation = shapeMath.calculateSphereSurfaceArea(values.radius);
            break;
          case 'cylinder':
            calculation = shapeMath.calculateCylinderSurfaceArea(values.radius, values.height);
            break;
          case 'rectangular-prism':
            calculation = shapeMath.calculateRectangularPrismSurfaceArea(values.length, values.width, values.height);
            break;
        }
      }
    }

    setResult(calculation);
  };

  const handleReset = () => {
    setDimensions({});
    setResult(null);
  };

  const handleShapeTypeChange = (type: ShapeType) => {
    setShapeType(type);
    setSelectedShapeId(type === '2d' ? 'square' : 'cube');
    setCalculationType(type === '2d' ? 'area' : 'volume');
    setDimensions({});
    setResult(null);
  };

  const handleCalculationTypeChange = (type: CalculationType) => {
    setCalculationType(type);
    setDimensions({});
    setResult(null);
  };

  const availableCalculations = shapeType === '2d'
    ? [
        { id: 'area' as CalculationType, label: 'Area', icon: '📐' },
        { id: 'perimeter' as CalculationType, label: 'Perimeter', icon: '📏' },
      ]
    : [
        { id: 'volume' as CalculationType, label: 'Volume', icon: '📦' },
        { id: 'surfaceArea' as CalculationType, label: 'Surface Area', icon: '🎨' },
      ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-blue-400 to-indigo-400 relative overflow-hidden">
      {/* Header */}
      <div className="relative z-10 px-4 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all px-4 py-3 rounded-full shadow-lg flex items-center gap-2 text-white"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back</span>
          </button>

          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <Calculator className="w-8 h-8" />
            Shape Calculator
          </h1>

          <div className="w-20"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-4 py-8 flex items-center justify-center">
        <div className="max-w-4xl w-full">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl">
            {/* Shape Type Toggle */}
            <div className="flex justify-center mb-8">
              <div className="bg-gray-100 rounded-xl p-1 flex gap-1">
                <button
                  onClick={() => handleShapeTypeChange('2d')}
                  className={`px-8 py-3 rounded-lg transition-all ${
                    shapeType === '2d'
                      ? 'bg-white shadow-md text-blue-600 font-bold'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  2D Shapes
                </button>
                <button
                  onClick={() => handleShapeTypeChange('3d')}
                  className={`px-8 py-3 rounded-lg transition-all ${
                    shapeType === '3d'
                      ? 'bg-white shadow-md text-blue-600 font-bold'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  3D Shapes
                </button>
              </div>
            </div>

            {/* Calculation Type */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-700 mb-3">What to Calculate:</h3>
              <div className="grid grid-cols-2 gap-3">
                {availableCalculations.map((calc) => (
                  <button
                    key={calc.id}
                    onClick={() => handleCalculationTypeChange(calc.id)}
                    className={`p-4 rounded-xl transition-all ${
                      calculationType === calc.id
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span className="text-3xl mb-2 block">{calc.icon}</span>
                    <span className="font-bold">{calc.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Shape Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-700 mb-3">Select Shape:</h3>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                {availableShapes.slice(0, 8).map((shape) => (
                  <button
                    key={shape.id}
                    onClick={() => {
                      setSelectedShapeId(shape.id);
                      setDimensions({});
                      setResult(null);
                    }}
                    className={`p-4 rounded-xl transition-all ${
                      selectedShapeId === shape.id
                        ? 'ring-4 ring-blue-500 bg-blue-50'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <span className="text-2xl font-bold" style={{ color: shape.color }}>
                      {shape.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Input Fields */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-700 mb-3">Enter Dimensions:</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {getRequiredInputs().map((input) => (
                  <div key={input.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {input.label}
                    </label>
                    <input
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={dimensions[input.name] || ''}
                      onChange={(e) =>
                        setDimensions({ ...dimensions, [input.name]: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-lg"
                      placeholder="Enter value"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={handleCalculate}
                className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-4 rounded-xl text-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-6 h-6" />
                Calculate
              </button>
              <button
                onClick={handleReset}
                className="bg-gray-200 text-gray-700 px-6 py-4 rounded-xl hover:bg-gray-300 transition-all"
              >
                <RotateCcw className="w-6 h-6" />
              </button>
            </div>

            {/* Result Display */}
            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-gradient-to-r from-green-100 to-emerald-100 p-6 rounded-2xl"
                >
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">Result:</h3>

                  {/* Formula */}
                  <div className="bg-white p-4 rounded-xl mb-4">
                    <p className="text-sm text-gray-600 mb-1">Formula:</p>
                    <p className="text-xl font-mono font-bold text-gray-800">{result.formula}</p>
                  </div>

                  {/* Step-by-Step Solution */}
                  <div className="bg-white p-4 rounded-xl mb-4">
                    <p className="text-sm text-gray-600 mb-3">Step-by-Step Solution:</p>
                    <div className="space-y-3">
                      {result.steps.map((step, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="border-l-4 border-blue-500 pl-4"
                        >
                          <p className="text-sm text-gray-600">{step.description}</p>
                          <p className="font-mono text-gray-800">{step.formula}</p>
                          {step.calculation && (
                            <p className="text-sm text-gray-500 italic">{step.calculation}</p>
                          )}
                          {step.result && (
                            <p className="text-sm font-bold text-green-600">{step.result}</p>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Final Answer */}
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-6 rounded-xl text-center">
                    <p className="text-white font-medium mb-2">Final Answer:</p>
                    <p className="text-5xl font-bold text-white">
                      {result.result.toFixed(2)}
                    </p>
                    <p className="text-white text-xl mt-2">{result.unit}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
