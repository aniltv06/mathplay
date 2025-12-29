/**
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

/**
 * Shape Transformations Playground
 * Interactive tool for rotating, reflecting, translating, and scaling shapes
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, RotateCw, FlipHorizontal, Move, Maximize2, Undo, Play } from 'lucide-react';
import { SHAPES, Shape } from '../utils/shapes';
import * as transforms from '../utils/shapeTransformations';
import { useVoiceFeedback } from '../hooks/useVoiceFeedback';

interface Props {
  onBack: () => void;
  profileId: string;
}

type TransformationType = 'rotate' | 'reflect' | 'translate' | 'scale';

export function ShapeTransformationsPlayground({ onBack, profileId }: Props) {
  const [selectedShape, setSelectedShape] = useState<Shape>(SHAPES[1]); // square
  const [transformType, setTransformType] = useState<TransformationType>('rotate');
  const [transformedPath, setTransformedPath] = useState<string | null>(null);
  const [transformDescription, setTransformDescription] = useState<string>('');
  const { speak } = useVoiceFeedback();

  // Transform parameters
  const [rotateAngle, setRotateAngle] = useState(90);
  const [reflectAxis, setReflectAxis] = useState<'vertical' | 'horizontal' | 'diagonal'>('vertical');
  const [translateX, setTranslateX] = useState(20);
  const [translateY, setTranslateY] = useState(10);
  const [scaleValue, setScaleValue] = useState(1.5);

  const handleApplyTransform = () => {
    let result: transforms.TransformationResult;

    switch (transformType) {
      case 'rotate':
        result = transforms.rotatePath(selectedShape.svgPath, rotateAngle);
        speak(`Rotated ${selectedShape.name} by ${rotateAngle} degrees`);
        break;
      case 'reflect':
        result = transforms.reflectPath(selectedShape.svgPath, reflectAxis);
        speak(`Reflected ${selectedShape.name} across ${reflectAxis} axis`);
        break;
      case 'translate':
        result = transforms.translatePath(selectedShape.svgPath, translateX, translateY);
        speak(`Moved ${selectedShape.name} by ${translateX} and ${translateY} units`);
        break;
      case 'scale':
        result = transforms.scalePath(selectedShape.svgPath, scaleValue);
        speak(`Scaled ${selectedShape.name} by ${scaleValue} times`);
        break;
      default:
        return;
    }

    setTransformedPath(result.transformedPath);
    setTransformDescription(result.description);
  };

  const handleReset = () => {
    setTransformedPath(null);
    setTransformDescription('');
  };

  const transformOptions = [
    {
      id: 'rotate' as TransformationType,
      name: 'Rotate',
      icon: RotateCw,
      description: 'Turn the shape around',
      color: 'from-red-400 to-pink-500',
    },
    {
      id: 'reflect' as TransformationType,
      name: 'Reflect',
      icon: FlipHorizontal,
      description: 'Mirror the shape',
      color: 'from-blue-400 to-cyan-500',
    },
    {
      id: 'translate' as TransformationType,
      name: 'Translate',
      icon: Move,
      description: 'Move the shape',
      color: 'from-green-400 to-emerald-500',
    },
    {
      id: 'scale' as TransformationType,
      name: 'Scale',
      icon: Maximize2,
      description: 'Resize the shape',
      color: 'from-purple-400 to-violet-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-400 to-pink-400 relative overflow-hidden">
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

          <h1 className="text-2xl md:text-3xl font-bold text-white">Shape Transformations</h1>

          <div className="w-20"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Panel: Controls */}
            <div className="bg-white rounded-3xl p-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Controls</h2>

              {/* Shape Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-700 mb-3">Select Shape:</h3>
                <div className="grid grid-cols-3 gap-3">
                  {SHAPES.slice(0, 6).map((shape) => (
                    <button
                      key={shape.id}
                      onClick={() => {
                        setSelectedShape(shape);
                        handleReset();
                      }}
                      className={`p-4 rounded-xl transition-all ${
                        selectedShape.id === shape.id
                          ? 'ring-4 ring-blue-500 bg-blue-50'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <svg width="50" height="50" viewBox="0 0 100 100" className="mx-auto">
                        <path d={shape.svgPath} fill={shape.color} />
                      </svg>
                      <p className="text-xs mt-2 text-center font-medium">{shape.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Transformation Type */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-700 mb-3">Transform Type:</h3>
                <div className="grid grid-cols-2 gap-3">
                  {transformOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        setTransformType(option.id);
                        handleReset();
                      }}
                      className={`p-4 rounded-xl transition-all ${
                        transformType === option.id
                          ? `bg-gradient-to-r ${option.color} text-white shadow-lg`
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <option.icon className="w-6 h-6 mx-auto mb-2" />
                      <p className="font-bold text-sm">{option.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Transformation Parameters */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-700 mb-3">Parameters:</h3>

                {transformType === 'rotate' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Angle: {rotateAngle}°
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      step="15"
                      value={rotateAngle}
                      onChange={(e) => setRotateAngle(Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0°</span>
                      <span>180°</span>
                      <span>360°</span>
                    </div>
                  </div>
                )}

                {transformType === 'reflect' && (
                  <div className="space-y-2">
                    {(['vertical', 'horizontal', 'diagonal'] as const).map((axis) => (
                      <button
                        key={axis}
                        onClick={() => setReflectAxis(axis)}
                        className={`w-full p-3 rounded-xl transition-all ${
                          reflectAxis === axis
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {axis.charAt(0).toUpperCase() + axis.slice(1)} Axis
                      </button>
                    ))}
                  </div>
                )}

                {transformType === 'translate' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Horizontal: {translateX} units
                      </label>
                      <input
                        type="range"
                        min="-40"
                        max="40"
                        step="5"
                        value={translateX}
                        onChange={(e) => setTranslateX(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Vertical: {translateY} units
                      </label>
                      <input
                        type="range"
                        min="-40"
                        max="40"
                        step="5"
                        value={translateY}
                        onChange={(e) => setTranslateY(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>
                )}

                {transformType === 'scale' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Scale: {scaleValue}×
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={scaleValue}
                      onChange={(e) => setScaleValue(Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0.5×</span>
                      <span>1×</span>
                      <span>2×</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleApplyTransform}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-4 rounded-xl text-lg font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  Apply
                </button>
                <button
                  onClick={handleReset}
                  className="bg-gray-200 text-gray-700 px-6 py-4 rounded-xl hover:bg-gray-300 transition-all"
                >
                  <Undo className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Right Panel: Visualization */}
            <div className="bg-white rounded-3xl p-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Visualization</h2>

              {/* SVG Canvas */}
              <div className="bg-gray-50 rounded-2xl p-8 mb-6 min-h-[400px] flex items-center justify-center">
                <svg
                  width="100%"
                  height="400"
                  viewBox="0 0 100 100"
                  className="max-w-full"
                  style={{ background: 'white' }}
                >
                  {/* Grid */}
                  <defs>
                    <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                      <path
                        d="M 10 0 L 0 0 0 10"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="0.5"
                      />
                    </pattern>
                  </defs>
                  <rect width="100" height="100" fill="url(#grid)" />

                  {/* Axes */}
                  <line x1="0" y1="50" x2="100" y2="50" stroke="#9ca3af" strokeWidth="0.5" />
                  <line x1="50" y1="0" x2="50" y2="100" stroke="#9ca3af" strokeWidth="0.5" />

                  {/* Original Shape */}
                  <motion.path
                    d={selectedShape.svgPath}
                    fill={selectedShape.color}
                    fillOpacity="0.5"
                    stroke={selectedShape.color}
                    strokeWidth="1"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.5 }}
                  />

                  {/* Transformed Shape */}
                  <AnimatePresence>
                    {transformedPath && (
                      <motion.path
                        d={transformedPath}
                        fill={selectedShape.color}
                        fillOpacity="0.9"
                        stroke={selectedShape.color}
                        strokeWidth="2"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.5 }}
                      />
                    )}
                  </AnimatePresence>
                </svg>
              </div>

              {/* Description */}
              <AnimatePresence>
                {transformDescription && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-gradient-to-r from-blue-100 to-cyan-100 p-6 rounded-2xl"
                  >
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Transformation:</h3>
                    <p className="text-gray-700 text-lg">{transformDescription}</p>

                    <div className="mt-4 pt-4 border-t border-blue-200">
                      <h4 className="text-sm font-bold text-gray-700 mb-2">Legend:</h4>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded"
                            style={{
                              backgroundColor: selectedShape.color,
                              opacity: 0.5,
                            }}
                          ></div>
                          <span className="text-sm text-gray-600">Original</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-6 h-6 rounded border-2"
                            style={{
                              backgroundColor: selectedShape.color,
                              borderColor: selectedShape.color,
                            }}
                          ></div>
                          <span className="text-sm text-gray-600">Transformed</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {!transformDescription && (
                <div className="bg-gray-100 p-6 rounded-2xl text-center">
                  <p className="text-gray-500">
                    Select a transformation and click Apply to see the result!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
