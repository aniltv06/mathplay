/**
 * Interactive Graph Calculator Page
 * Graphing calculator for visualizing mathematical functions using Desmos
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { GradientButton } from '../components/GradientButton';

interface Props {
  onBack: () => void;
  profileId: string;
}

interface Example {
  name: string;
  formula: string;
  description: string;
}

const examples: Example[] = [
  {
    name: 'Basic Parabola',
    formula: 'y=x^2',
    description: 'Standard y = x²'
  },
  {
    name: 'Sine Wave',
    formula: 'y=\\sin(x)',
    description: 'Trigonometric sine'
  },
  {
    name: 'Cosine Wave',
    formula: 'y=\\cos(x)',
    description: 'Trigonometric cosine'
  },
  {
    name: 'Cubic Function',
    formula: 'y=x^3-3x',
    description: 'S-shaped curve'
  },
  {
    name: 'Absolute Value',
    formula: 'y=\\left|x\\right|',
    description: 'V-shaped graph'
  },
  {
    name: 'Exponential',
    formula: 'y=e^{x/2}',
    description: 'Growth curve'
  },
  {
    name: 'Square Root',
    formula: 'y=\\sqrt{x}',
    description: 'Half parabola'
  },
  {
    name: 'Tangent Wave',
    formula: 'y=\\tan(x)',
    description: 'Trigonometric tangent'
  }
];

// Declare Desmos global type
declare global {
  interface Window {
    Desmos: any;
  }
}

export function GraphCalculatorPage({ onBack, profileId }: Props) {
  const calculatorRef = useRef<HTMLDivElement>(null);
  const [calculator, setCalculator] = useState<any>(null);
  const [customInput, setCustomInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [activeExample, setActiveExample] = useState(0);
  const [desmosLoaded, setDesmosLoaded] = useState(false);

  // Load Desmos script
  useEffect(() => {
    if (window.Desmos) {
      setDesmosLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://www.desmos.com/api/v1.9/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6';
    script.async = true;
    script.onload = () => setDesmosLoaded(true);
    document.body.appendChild(script);

    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = 'https://www.desmos.com/api/v1.9/calculator.css';
    document.head.appendChild(style);

    return () => {
      document.body.removeChild(script);
      document.head.removeChild(style);
    };
  }, []);

  // Initialize calculator
  useEffect(() => {
    if (desmosLoaded && calculatorRef.current && !calculator) {
      const calc = window.Desmos.GraphingCalculator(calculatorRef.current, {
        keypad: false,
        expressions: true,
        settingsMenu: true,
        zoomButtons: true,
        expressionsTopbar: true,
        border: false
      });
      setCalculator(calc);

      // Load first example
      calc.setExpression({ id: 'example-0', latex: examples[0].formula, color: '#2E86AB' });
    }
  }, [desmosLoaded, calculator]);

  // Load example
  const loadExample = (index: number) => {
    if (!calculator) return;

    calculator.setBlank();
    calculator.setExpression({
      id: `example-${index}`,
      latex: examples[index].formula,
      color: '#2E86AB',
      lineWidth: 3
    });

    setActiveExample(index);
    setErrorMsg('');
  };

  // Add custom equation
  const addCustom = () => {
    if (!calculator || !customInput.trim()) {
      setErrorMsg('Please enter an equation');
      return;
    }

    try {
      // Convert user input to Desmos latex if needed
      let latex = customInput.trim();

      // Basic conversions
      if (!latex.includes('=')) {
        latex = 'y=' + latex;
      }

      calculator.setExpression({
        id: `custom-${Date.now()}`,
        latex: latex,
        color: '#A23B72',
        lineWidth: 3
      });

      setErrorMsg('');
      setCustomInput('');
    } catch (error) {
      setErrorMsg('Invalid equation format');
    }
  };

  // Add circle
  const addCircle = () => {
    if (!calculator) return;
    calculator.setBlank();
    calculator.setExpression({
      id: 'circle',
      latex: 'x^2+y^2=9',
      color: '#10b981',
      lineWidth: 3
    });
    setErrorMsg('');
  };

  // Add oval
  const addOval = () => {
    if (!calculator) return;
    calculator.setBlank();
    calculator.setExpression({
      id: 'oval',
      latex: '\\frac{x^2}{25}+\\frac{y^2}{9}=1',
      color: '#f59e0b',
      lineWidth: 3
    });
    setErrorMsg('');
  };

  // Add hyperbola
  const addHyperbola = () => {
    if (!calculator) return;
    calculator.setBlank();
    calculator.setExpression({
      id: 'hyperbola',
      latex: 'y=\\frac{1}{x}',
      color: '#8b5cf6',
      lineWidth: 3
    });
    setErrorMsg('');
  };

  // Add butterfly curve
  const addButterfly = () => {
    if (!calculator) return;
    calculator.setBlank();

    // Butterfly curve parametric equations - use proper Desmos parametric format
    calculator.setExpression({
      id: 'butterfly',
      latex: '(\\sin(t)\\cdot(e^{\\cos(t)}-2\\cos(4t)-(\\sin(t/12))^5), \\cos(t)\\cdot(e^{\\cos(t)}-2\\cos(4t)-(\\sin(t/12))^5))',
      color: '#ec4899',
      lineWidth: 2,
      parametricDomain: { min: '0', max: '12\\pi' }
    });

    setErrorMsg('');
  };

  // Animated Shapes
  const addRotatingSquare = () => {
    if (!calculator) return;
    calculator.setBlank();

    // Add animated parameter
    calculator.setExpression({
      id: 'a-slider',
      latex: 'a=0',
      sliderBounds: { min: '0', max: '6.28', step: '0.05' }
    });

    // Rotating square vertices
    const vertices = [
      '(\\cos(a)-\\sin(a), \\sin(a)+\\cos(a))',
      '(\\cos(a)+\\sin(a), \\sin(a)-\\cos(a))',
      '(-\\cos(a)+\\sin(a), -\\sin(a)-\\cos(a))',
      '(-\\cos(a)-\\sin(a), -\\sin(a)+\\cos(a))',
      '(\\cos(a)-\\sin(a), \\sin(a)+\\cos(a))'
    ];

    calculator.setExpression({
      id: 'square',
      latex: `[(${vertices.join('), (')})]`,
      color: '#3b82f6',
      lineWidth: 3,
      lineStyle: window.Desmos.Styles.SOLID
    });

    // Start animation
    calculator.setExpression({ id: 'a-slider', latex: 'a=0' });
    setTimeout(() => {
      const helper = calculator.HelperExpression({ latex: 'a' });
      helper.observe('numericValue', () => {
        const val = helper.numericValue;
        if (val >= 6.28) {
          calculator.setExpression({ id: 'a-slider', latex: 'a=0' });
        }
      });
      calculator.setExpression({ id: 'a-slider', latex: 'a=6.28' });
    }, 100);

    setErrorMsg('');
  };

  const addSpiral = () => {
    if (!calculator) return;
    calculator.setBlank();

    // Add animated parameter
    calculator.setExpression({
      id: 'a-slider',
      latex: 'a=0',
      sliderBounds: { min: '0', max: '20', step: '0.1' }
    });

    // Animated spiral
    calculator.setExpression({
      id: 'spiral',
      latex: '(t\\cos(t), t\\sin(t))',
      color: '#8b5cf6',
      lineWidth: 3,
      parametricDomain: { min: '0', max: 'a' }
    });

    // Start animation
    setTimeout(() => calculator.setExpression({ id: 'a-slider', latex: 'a=20' }), 100);

    setErrorMsg('');
  };

  const addWaveInterference = () => {
    if (!calculator) return;
    calculator.setBlank();

    // Add animated parameter
    calculator.setExpression({
      id: 'a-slider',
      latex: 'a=0',
      sliderBounds: { min: '0', max: '6.28', step: '0.05' }
    });

    // Wave 1
    calculator.setExpression({
      id: 'wave1',
      latex: 'y=\\sin(x+a)',
      color: '#3b82f6',
      lineWidth: 2
    });

    // Wave 2
    calculator.setExpression({
      id: 'wave2',
      latex: 'y=\\sin(2x-a)',
      color: '#ec4899',
      lineWidth: 2
    });

    // Interference pattern
    calculator.setExpression({
      id: 'interference',
      latex: 'y=\\sin(x+a)+\\sin(2x-a)',
      color: '#10b981',
      lineWidth: 3
    });

    // Start animation
    setTimeout(() => calculator.setExpression({ id: 'a-slider', latex: 'a=6.28' }), 100);

    setErrorMsg('');
  };

  const addRoseCurve = () => {
    if (!calculator) return;
    calculator.setBlank();

    // Add animated parameter
    calculator.setExpression({
      id: 'a-slider',
      latex: 'a=1',
      sliderBounds: { min: '1', max: '10', step: '0.1' }
    });

    // Rose curve with animated petals
    calculator.setExpression({
      id: 'rose',
      latex: '(a\\cos(5t)\\cos(t), a\\cos(5t)\\sin(t))',
      color: '#ec4899',
      lineWidth: 3,
      parametricDomain: { min: '0', max: '2\\pi' }
    });

    // Start animation
    setTimeout(() => calculator.setExpression({ id: 'a-slider', latex: 'a=10' }), 100);

    setErrorMsg('');
  };

  const addHeartBeat = () => {
    if (!calculator) return;
    calculator.setBlank();

    // Add animated parameter
    calculator.setExpression({
      id: 'a-slider',
      latex: 'a=1',
      sliderBounds: { min: '0.8', max: '1.2', step: '0.01' }
    });

    // Heart curve with pulsing animation
    calculator.setExpression({
      id: 'heart',
      latex: '(a\\cdot16\\sin^3(t), a\\cdot(13\\cos(t)-5\\cos(2t)-2\\cos(3t)-\\cos(4t)))',
      color: '#ef4444',
      lineWidth: 3,
      fill: true,
      fillOpacity: 0.3,
      parametricDomain: { min: '0', max: '2\\pi' }
    });

    // Ping-pong animation
    let growing = true;
    const animate = () => {
      const currentVal = calculator.HelperExpression({ latex: 'a' }).numericValue;
      if (growing && currentVal >= 1.2) growing = false;
      if (!growing && currentVal <= 0.8) growing = true;

      calculator.setExpression({
        id: 'a-slider',
        latex: growing ? 'a=1.2' : 'a=0.8'
      });
    };

    setTimeout(animate, 100);

    setErrorMsg('');
  };

  const addLissajous = () => {
    if (!calculator) return;
    calculator.setBlank();

    // Add animated parameter
    calculator.setExpression({
      id: 'a-slider',
      latex: 'a=0',
      sliderBounds: { min: '0', max: '6.28', step: '0.05' }
    });

    // Lissajous curve
    calculator.setExpression({
      id: 'lissajous',
      latex: '(3\\sin(3t+a), 2\\sin(2t))',
      color: '#8b5cf6',
      lineWidth: 3,
      parametricDomain: { min: '0', max: '2\\pi' }
    });

    // Start animation
    setTimeout(() => calculator.setExpression({ id: 'a-slider', latex: 'a=6.28' }), 100);

    setErrorMsg('');
  };

  // Clear graph
  const clearGraph = () => {
    if (!calculator) return;
    calculator.setBlank();
    setErrorMsg('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addCustom();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={onBack}
            className="mb-4 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl backdrop-blur-sm transition-all flex items-center gap-2"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-4xl md:text-5xl text-white mb-2 drop-shadow-lg">
            📊 Interactive Graph Calculator
          </h1>
          <p className="text-white/90 text-lg">Visualize mathematical functions with Desmos</p>
        </motion.div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Graph Area */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 bg-white rounded-3xl shadow-2xl p-6"
          >
            <div
              ref={calculatorRef}
              style={{ width: '100%', height: '600px' }}
              className="rounded-xl overflow-hidden"
            />
            {!desmosLoaded && (
              <div className="flex items-center justify-center h-[600px]">
                <p className="text-gray-500">Loading calculator...</p>
              </div>
            )}
          </motion.div>

          {/* Sidebar */}
          <div className="w-full lg:w-80 flex flex-col gap-6">
            {/* Examples Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl shadow-2xl p-6"
            >
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                📈 Function Examples
              </h3>
              <div className="space-y-2">
                {examples.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => loadExample(index)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                      activeExample === index
                        ? 'bg-purple-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <div className="font-medium">{example.name}</div>
                    <div className={`text-xs mt-1 ${activeExample === index ? 'text-white/80' : 'text-gray-500'}`}>
                      {example.description}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Special Shapes Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-3xl shadow-2xl p-6"
            >
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                ✨ Special Shapes
              </h3>
              <div className="space-y-2">
                <GradientButton
                  onClick={addCircle}
                  fromColor="#10b981"
                  toColor="#059669"
                  className="w-full"
                >
                  ⭕ Circle
                </GradientButton>
                <GradientButton
                  onClick={addOval}
                  fromColor="#f59e0b"
                  toColor="#d97706"
                  className="w-full"
                >
                  🥚 Oval
                </GradientButton>
                <GradientButton
                  onClick={addHyperbola}
                  fromColor="#8b5cf6"
                  toColor="#7c3aed"
                  className="w-full"
                >
                  ∞ Hyperbola
                </GradientButton>
                <GradientButton
                  onClick={addButterfly}
                  fromColor="#ec4899"
                  toColor="#db2777"
                  className="w-full"
                >
                  🦋 Butterfly
                </GradientButton>
              </div>
            </motion.div>

            {/* Animated Shapes Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl shadow-2xl p-6"
            >
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                🎬 Animated Shapes
              </h3>
              <div className="space-y-2">
                <GradientButton
                  onClick={addRotatingSquare}
                  fromColor="#3b82f6"
                  toColor="#1d4ed8"
                  className="w-full"
                >
                  🔄 Rotating Square
                </GradientButton>
                <GradientButton
                  onClick={addSpiral}
                  fromColor="#8b5cf6"
                  toColor="#6d28d9"
                  className="w-full"
                >
                  🌀 Growing Spiral
                </GradientButton>
                <GradientButton
                  onClick={addWaveInterference}
                  fromColor="#10b981"
                  toColor="#059669"
                  className="w-full"
                >
                  🌊 Wave Interference
                </GradientButton>
                <GradientButton
                  onClick={addRoseCurve}
                  fromColor="#ec4899"
                  toColor="#db2777"
                  className="w-full"
                >
                  🌹 Blooming Rose
                </GradientButton>
                <GradientButton
                  onClick={addHeartBeat}
                  fromColor="#ef4444"
                  toColor="#dc2626"
                  className="w-full"
                >
                  💗 Beating Heart
                </GradientButton>
                <GradientButton
                  onClick={addLissajous}
                  fromColor="#8b5cf6"
                  toColor="#7c3aed"
                  className="w-full"
                >
                  ∞ Lissajous Curve
                </GradientButton>
              </div>
            </motion.div>

            {/* Custom Equation Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl shadow-2xl p-6"
            >
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                ✏️ Custom Equation
              </h3>
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="x^2 + 1"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none font-mono text-sm mb-3"
              />
              <GradientButton
                onClick={addCustom}
                fromColor="#8b5cf6"
                toColor="#ec4899"
                className="w-full"
              >
                Add to Graph
              </GradientButton>
              {errorMsg && (
                <div className="mt-3 bg-red-50 border-l-4 border-red-500 p-3 rounded text-sm text-red-700">
                  {errorMsg}
                </div>
              )}
            </motion.div>

            {/* Controls Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-3xl shadow-2xl p-6"
            >
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                🎛️ Controls
              </h3>
              <button
                onClick={clearGraph}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-xl transition-all font-medium"
              >
                Clear Graph
              </button>
              <div className="mt-4 bg-blue-50 border-l-4 border-blue-500 p-3 rounded text-sm text-blue-700">
                💡 Tip: Type equations like "y=x^2+2x" or "y=sin(x)"
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
