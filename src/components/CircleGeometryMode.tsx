/**
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

/**
 * Circle Geometry Mode
 * Interactive learning for all parts of a circle
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ChevronLeft, ChevronRight, Volume2 } from 'lucide-react';
import { useVoiceFeedback } from '../hooks/useVoiceFeedback';

interface Props {
  onBack: () => void;
  profileId: string;
}

interface CirclePart {
  id: string;
  name: string;
  description: string;
  formula?: string;
  properties: string[];
  realWorldExamples: string[];
  funFact: string;
  color: string;
}

const CIRCLE_PARTS: CirclePart[] = [
  {
    id: 'all-parts',
    name: 'All Parts Overview',
    description: 'See all the parts of a circle: center, radius, diameter, chord, tangent, secant, circumference, arc, sector, segment, semicircle, and annulus.',
    properties: [
      'Linear Elements - center, radius, diameter, chord, tangent, secant',
      'Curved & Area Elements - circumference, arc, sector, segment, semicircle, annulus',
    ],
    realWorldExamples: ['Complete circle diagram', 'Geometry textbook illustration', 'Mathematical reference'],
    funFact: 'Understanding all these parts helps you master circle geometry!',
    color: '#8B5CF6',
  },
  {
    id: 'center',
    name: 'Center',
    description: 'The point that is exactly in the middle of the circle. All points on the circle are the same distance from the center.',
    properties: [
      'Fixed point in the middle',
      'Equidistant from all points on circle',
      'Used to define the circle',
    ],
    realWorldExamples: ['Center of a wheel', 'Bullseye of a dartboard', 'Hub of a bicycle wheel'],
    funFact: 'The center is not actually part of the circle itself!',
    color: '#FF6B6B',
  },
  {
    id: 'radius',
    name: 'Radius',
    description: 'A straight line from the center to any point on the circle.',
    formula: 'r (half of diameter)',
    properties: [
      'Goes from center to edge',
      'All radii are equal length',
      'Half of the diameter',
    ],
    realWorldExamples: ['Spoke of a wheel', 'Clock hand', 'Pizza slice edge'],
    funFact: 'The word radius comes from Latin meaning "ray" or "spoke"!',
    color: '#4ECDC4',
  },
  {
    id: 'diameter',
    name: 'Diameter',
    description: 'A straight line that passes through the center and touches two points on the circle.',
    formula: 'd = 2r',
    properties: [
      'Longest chord in a circle',
      'Passes through the center',
      'Twice the radius',
    ],
    realWorldExamples: ['Width of a pizza', 'Full width of a wheel', 'Across a circular table'],
    funFact: 'The diameter is always exactly twice the radius!',
    color: '#95E1D3',
  },
  {
    id: 'circumference',
    name: 'Circumference',
    description: 'The distance around the circle - like the perimeter of other shapes.',
    formula: 'C = 2πr or C = πd',
    properties: [
      'Total distance around circle',
      'Uses π (pi) ≈ 3.14159',
      'Like the perimeter',
    ],
    realWorldExamples: ['Track around a circular field', 'Edge of a round plate', 'Rim of a cup'],
    funFact: 'If you know the diameter, multiply by π (about 3.14) to get circumference!',
    color: '#F38181',
  },
  {
    id: 'chord',
    name: 'Chord',
    description: 'A straight line connecting any two points on the circle.',
    properties: [
      'Connects two points on circle',
      'Does not pass through center',
      'Diameter is the longest chord',
    ],
    realWorldExamples: ['String across a circular drum', 'Bridge across a circular lake', 'Line across moon phases'],
    funFact: 'A diameter is actually a special type of chord - the longest one!',
    color: '#AA96DA',
  },
  {
    id: 'tangent',
    name: 'Tangent',
    description: 'A straight line that touches the circle at exactly one point.',
    properties: [
      'Touches circle at one point only',
      'Perpendicular to radius at touch point',
      'Never enters the circle',
    ],
    realWorldExamples: ['Road touching a roundabout', 'Horizon line to Earth', 'Edge of a ruler touching a coin'],
    funFact: 'A tangent line is always at a 90° angle to the radius at the point of contact!',
    color: '#FF6B9D',
  },
  {
    id: 'secant',
    name: 'Secant',
    description: 'A straight line that intersects the circle at two points.',
    properties: [
      'Crosses through circle',
      'Intersects at two points',
      'Contains a chord',
    ],
    realWorldExamples: ['Road passing through a circular park', 'Tunnel through a circular tunnel', 'Stick through a ball'],
    funFact: 'If you extend a chord beyond the circle, it becomes a secant!',
    color: '#FFD93D',
  },
  {
    id: 'arc',
    name: 'Arc',
    description: 'A curved portion of the circumference between two points on the circle.',
    formula: 'Arc length = (θ/360°) × 2πr',
    properties: [
      'Part of the circumference',
      'Measured by angle or length',
      'Can be major or minor',
    ],
    realWorldExamples: ['Slice of pizza crust', 'Part of a rainbow', 'Curved path on a track'],
    funFact: 'A full circle is an arc of 360 degrees!',
    color: '#6BCB77',
  },
  {
    id: 'sector',
    name: 'Sector',
    description: 'A "pizza slice" shape - the region between two radii and an arc.',
    formula: 'Area = (θ/360°) × πr²',
    properties: [
      'Like a slice of pie',
      'Bounded by two radii and arc',
      'Area depends on angle',
    ],
    realWorldExamples: ['Pizza slice', 'Pie chart section', 'Windshield wiper area'],
    funFact: 'A sector with a 180° angle is exactly half the circle!',
    color: '#FFB84C',
  },
  {
    id: 'segment',
    name: 'Segment',
    description: 'A region bounded by a chord and the arc between the chord\'s endpoints.',
    properties: [
      'Region cut off by a chord',
      'Has both straight and curved sides',
      'Can be major or minor',
    ],
    realWorldExamples: ['Crescent moon shape', 'Orange slice', 'Lens shape'],
    funFact: 'A segment is different from a sector - it uses a chord instead of radii!',
    color: '#C44569',
  },
  {
    id: 'semicircle',
    name: 'Semicircle',
    description: 'Exactly half of a circle, formed when a diameter divides the circle.',
    formula: 'Area = πr²/2',
    properties: [
      'Half of a circle',
      'Created by diameter',
      'Has 180° arc',
    ],
    realWorldExamples: ['Half moon', 'Protractor shape', 'Arch doorway'],
    funFact: 'Any angle inscribed in a semicircle is always a right angle (90°)!',
    color: '#4DD0E1',
  },
  {
    id: 'annulus',
    name: 'Annulus (Ring)',
    description: 'The region between two concentric circles (circles with the same center).',
    formula: 'Area = π(R² - r²)',
    properties: [
      'Ring or donut shape',
      'Two circles, same center',
      'Has inner and outer radius',
    ],
    realWorldExamples: ['Donut', 'Ring', 'Washer', 'Olympic rings'],
    funFact: 'The word "annulus" means "little ring" in Latin!',
    color: '#9B59B6',
  },
];

export function CircleGeometryMode({ onBack }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { speak } = useVoiceFeedback();

  const currentPart = CIRCLE_PARTS[currentIndex];

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < CIRCLE_PARTS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSpeak = () => {
    const text = `${currentPart.name}. ${currentPart.description} ${currentPart.funFact}`;
    speak(text);
  };

  // Render SVG visualization for each circle part
  const renderVisualization = () => {
    const centerX = 150;
    const centerY = 150;
    const radius = 80;

    switch (currentPart.id) {
      case 'all-parts':
        return (
          <div className="w-full">
            <div className="flex flex-col gap-8">
              {/* Diagram 1: Linear Elements */}
              <div className="flex flex-col items-center">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Linear Elements</h3>
                <svg width="400" height="400" viewBox="0 0 400 400">
                  {/* Main circle - center (200, 200), radius 120 */}
                  <circle cx="200" cy="200" r="120" fill="none" stroke="#333" strokeWidth="3" />

                  {/* Chord (blue) - upper portion */}
                  {(() => {
                    // Chord at y = 130 (70 pixels above center)
                    const cy = 130;
                    const dy = 200 - cy; // 70
                    const dx = Math.sqrt(120 * 120 - dy * dy); // ~97.98
                    const x1 = 200 - dx;
                    const x2 = 200 + dx;
                    return (
                      <>
                        <line x1={x1} y1={cy} x2={x2} y2={cy} stroke="#5B8DEE" strokeWidth="3" />
                        <circle cx={x1} cy={cy} r="4" fill="#5B8DEE" />
                        <circle cx={x2} cy={cy} r="4" fill="#5B8DEE" />
                        <text x="220" y="115" fill="#5B8DEE" fontSize="13" fontWeight="bold">Chord</text>
                      </>
                    );
                  })()}

                  {/* Radius (cyan) - from center to upper right */}
                  {(() => {
                    const angle = -Math.PI / 4; // 45 degrees up-right
                    const endX = 200 + 120 * Math.cos(angle);
                    const endY = 200 + 120 * Math.sin(angle);
                    return (
                      <>
                        <line x1="200" y1="200" x2={endX} y2={endY} stroke="#06B6D4" strokeWidth="3" />
                        <circle cx={endX} cy={endY} r="4" fill="#06B6D4" />
                        <text x="255" y="155" fill="#06B6D4" fontSize="13" fontWeight="bold">Radius</text>
                      </>
                    );
                  })()}

                  {/* Diameter (magenta/pink) - horizontal through center */}
                  <line x1="80" y1="200" x2="320" y2="200" stroke="#EC4899" strokeWidth="3" />
                  <circle cx="80" cy="200" r="4" fill="#EC4899" />
                  <circle cx="320" cy="200" r="4" fill="#EC4899" />
                  <line x1="320" y1="200" x2="360" y2="200" stroke="#EC4899" strokeWidth="2" />
                  <path d="M 355 195 L 360 200 L 355 205" fill="none" stroke="#EC4899" strokeWidth="2" />
                  <text x="200" y="235" fill="#EC4899" fontSize="13" fontWeight="bold">Diameter</text>

                  {/* Secant (teal/green) - lower portion crossing through circle */}
                  {(() => {
                    // Secant line crossing bottom portion of circle
                    // Using angles to ensure proper intersection
                    const angle1 = (3.5 * Math.PI) / 4; // ~157.5 degrees (upper left)
                    const angle2 = (2 * Math.PI) / 3; // ~240 degrees (lower right)
                    const x1 = 200 + 120 * Math.cos(angle1);
                    const y1 = 200 + 120 * Math.sin(angle1);
                    const x2 = 200 + 120 * Math.cos(angle2);
                    const y2 = 200 + 120 * Math.sin(angle2);

                    // Extend the line beyond the circle
                    const dx = x2 - x1;
                    const dy = y2 - y1;
                    const len = Math.sqrt(dx * dx + dy * dy);
                    const extX1 = x1 - (dx / len) * 50;
                    const extY1 = y1 - (dy / len) * 50;
                    const extX2 = x2 + (dx / len) * 50;
                    const extY2 = y2 + (dy / len) * 50;

                    return (
                      <>
                        <line x1={extX1} y1={extY1} x2={extX2} y2={extY2} stroke="#14B8A6" strokeWidth="3" />
                        <circle cx={x1} cy={y1} r="4" fill="#14B8A6" />
                        <circle cx={x2} cy={y2} r="4" fill="#14B8A6" />
                        <text x="95" y="330" fill="#14B8A6" fontSize="13" fontWeight="bold">Secant</text>
                      </>
                    );
                  })()}

                  {/* Tangent (red) - right side vertical touching at one point */}
                  <line x1="320" y1="140" x2="320" y2="350" stroke="#DC2626" strokeWidth="3" />
                  <path d="M 315 345 L 320 350 L 325 345" fill="none" stroke="#DC2626" strokeWidth="2" />
                  <circle cx="320" cy="200" r="4" fill="#DC2626" />
                  <text x="328" y="260" fill="#DC2626" fontSize="13" fontWeight="bold">Tangent</text>

                  {/* Right angle indicator for tangent */}
                  <rect x="315" y="195" width="10" height="10" fill="none" stroke="#999" strokeWidth="1" />

                  {/* Radius line to tangent point (dashed) */}
                  <line x1="200" y1="200" x2="320" y2="200" stroke="#999" strokeWidth="1" strokeDasharray="4,4" />

                  {/* Center point - drawn last so it's on top */}
                  <circle cx="200" cy="200" r="5" fill="#FF6B6B" />
                  <text x="165" y="195" fill="#FF6B6B" fontSize="12" fontWeight="bold">Center</text>
                </svg>
              </div>

              {/* Diagram 2: Curved & Area Elements */}
              <div className="flex flex-col items-center">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Curved & Area Elements</h3>
                <svg width="400" height="400" viewBox="0 0 400 400">
                  {/* Main circle - center (200, 200), radius 120 */}
                  <circle cx="200" cy="200" r="120" fill="none" stroke="#333" strokeWidth="3" />

                  {/* Center point */}
                  <circle cx="200" cy="200" r="5" fill="#333" />

                  {/* Circumference (purple) - the circle itself with special styling */}
                  <circle cx="200" cy="200" r="120" fill="none" stroke="#9333EA" strokeWidth="4" strokeDasharray="10,5" opacity="0.6" />
                  <text x="240" y="75" fill="#9333EA" fontSize="13" fontWeight="bold">Circumference</text>

                  {/* Arc (orange) - upper right curved portion */}
                  {(() => {
                    const startAngle = 0; // 0 degrees (right)
                    const endAngle = Math.PI / 2; // 90 degrees (top)
                    const startX = 200 + 120 * Math.cos(startAngle);
                    const startY = 200 + 120 * Math.sin(startAngle);
                    const endX = 200 + 120 * Math.cos(endAngle);
                    const endY = 200 + 120 * Math.sin(endAngle);
                    return (
                      <>
                        <path
                          d={`M ${startX} ${startY} A 120 120 0 0 1 ${endX} ${endY}`}
                          fill="none"
                          stroke="#F97316"
                          strokeWidth="6"
                        />
                        <circle cx={startX} cy={startY} r="4" fill="#F97316" />
                        <circle cx={endX} cy={endY} r="4" fill="#F97316" />
                        <text x="270" y="120" fill="#F97316" fontSize="13" fontWeight="bold">Arc</text>
                      </>
                    );
                  })()}

                  {/* Sector (yellow) - upper left pizza slice */}
                  {(() => {
                    const angle1 = (3 * Math.PI) / 4; // 135 degrees (upper left)
                    const angle2 = (5 * Math.PI) / 4; // 225 degrees (lower left)
                    const x1 = 200 + 120 * Math.cos(angle1);
                    const y1 = 200 + 120 * Math.sin(angle1);
                    const x2 = 200 + 120 * Math.cos(angle2);
                    const y2 = 200 + 120 * Math.sin(angle2);
                    return (
                      <>
                        <path
                          d={`M 200 200 L ${x1} ${y1} A 120 120 0 0 1 ${x2} ${y2} Z`}
                          fill="#EAB308"
                          opacity="0.4"
                          stroke="#EAB308"
                          strokeWidth="3"
                        />
                        <line x1="200" y1="200" x2={x1} y2={y1} stroke="#EAB308" strokeWidth="2" />
                        <line x1="200" y1="200" x2={x2} y2={y2} stroke="#EAB308" strokeWidth="2" />
                        <text x="95" y="235" fill="#EAB308" fontSize="13" fontWeight="bold">Sector</text>
                      </>
                    );
                  })()}

                  {/* Segment (green) - bottom right portion */}
                  {(() => {
                    const chordY = 250; // Below center
                    const dy = chordY - 200;
                    const dx = Math.sqrt(120 * 120 - dy * dy);
                    const x1 = 200 - dx;
                    const x2 = 200 + dx;
                    return (
                      <>
                        <path
                          d={`M ${x1} ${chordY} A 120 120 0 0 0 ${x2} ${chordY} Z`}
                          fill="#22C55E"
                          opacity="0.4"
                          stroke="#22C55E"
                          strokeWidth="3"
                        />
                        <line x1={x1} y1={chordY} x2={x2} y2={chordY} stroke="#22C55E" strokeWidth="3" />
                        <text x="240" y="295" fill="#22C55E" fontSize="13" fontWeight="bold">Segment</text>
                      </>
                    );
                  })()}

                  {/* Semicircle (cyan) - left half */}
                  <path
                    d={`M 200 80 A 120 120 0 0 0 200 320 Z`}
                    fill="none"
                    stroke="#06B6D4"
                    strokeWidth="5"
                    strokeDasharray="8,4"
                  />
                  <text x="85" y="200" fill="#06B6D4" fontSize="13" fontWeight="bold">Semicircle</text>
                  <line x1="200" y1="80" x2="200" y2="320" stroke="#06B6D4" strokeWidth="2" strokeDasharray="4,2" />

                  {/* Annulus (pink) - ring shape at center */}
                  {(() => {
                    const centerX = 200;
                    const centerY = 200;
                    const outerR = 55;
                    const innerR = 35;
                    return (
                      <>
                        {/* Outer circle */}
                        <circle cx={centerX} cy={centerY} r={outerR} fill="#EC4899" opacity="0.25" stroke="#EC4899" strokeWidth="3" />
                        {/* Inner circle (white to create ring effect) */}
                        <circle cx={centerX} cy={centerY} r={innerR} fill="white" stroke="#EC4899" strokeWidth="3" />
                        {/* Radius lines to show inner and outer radii */}
                        <line x1={centerX} y1={centerY} x2={centerX - innerR} y2={centerY} stroke="#EC4899" strokeWidth="2" strokeDasharray="3,2" />
                        <line x1={centerX} y1={centerY} x2={centerX - outerR} y2={centerY} stroke="#EC4899" strokeWidth="2" strokeDasharray="3,2" />
                        <text x={centerX - innerR - 15} y={centerY - 5} fill="#EC4899" fontSize="10" fontWeight="bold">r</text>
                        <text x={centerX - outerR - 15} y={centerY - 5} fill="#EC4899" fontSize="10" fontWeight="bold">R</text>
                        <text x={centerX - 30} y={centerY + 15} fill="#EC4899" fontSize="13" fontWeight="bold">Annulus</text>
                      </>
                    );
                  })()}
                </svg>
              </div>
            </div>
          </div>
        );

      case 'center':
        return (
          <svg width="300" height="300" viewBox="0 0 300 300">
            <circle cx={centerX} cy={centerY} r={radius} fill="none" stroke="#ddd" strokeWidth="2" />
            <motion.circle
              cx={centerX}
              cy={centerY}
              r="8"
              fill={currentPart.color}
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <text x={centerX + 15} y={centerY - 10} fill={currentPart.color} fontSize="14" fontWeight="bold">
              Center
            </text>
          </svg>
        );

      case 'radius':
        return (
          <svg width="300" height="300" viewBox="0 0 300 300">
            <circle cx={centerX} cy={centerY} r={radius} fill="none" stroke="#ddd" strokeWidth="2" />
            <circle cx={centerX} cy={centerY} r="4" fill="#333" />
            <motion.line
              x1={centerX}
              y1={centerY}
              x2={centerX + radius}
              y2={centerY}
              stroke={currentPart.color}
              strokeWidth="4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <circle cx={centerX + radius} cy={centerY} r="5" fill={currentPart.color} />
            <text x={centerX + 30} y={centerY - 10} fill={currentPart.color} fontSize="14" fontWeight="bold">
              r
            </text>
          </svg>
        );

      case 'diameter':
        return (
          <svg width="300" height="300" viewBox="0 0 300 300">
            <circle cx={centerX} cy={centerY} r={radius} fill="none" stroke="#ddd" strokeWidth="2" />
            <circle cx={centerX} cy={centerY} r="4" fill="#333" />
            <motion.line
              x1={centerX - radius}
              y1={centerY}
              x2={centerX + radius}
              y2={centerY}
              stroke={currentPart.color}
              strokeWidth="4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <circle cx={centerX - radius} cy={centerY} r="5" fill={currentPart.color} />
            <circle cx={centerX + radius} cy={centerY} r="5" fill={currentPart.color} />
            <text x={centerX - 10} y={centerY - 10} fill={currentPart.color} fontSize="14" fontWeight="bold">
              d
            </text>
          </svg>
        );

      case 'circumference':
        return (
          <svg width="300" height="300" viewBox="0 0 300 300">
            <motion.circle
              cx={centerX}
              cy={centerY}
              r={radius}
              fill="none"
              stroke={currentPart.color}
              strokeWidth="4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, repeat: Infinity }}
              strokeDasharray="1"
            />
            <circle cx={centerX} cy={centerY} r="4" fill="#333" />
            <text x={centerX + radius + 10} y={centerY} fill={currentPart.color} fontSize="14" fontWeight="bold">
              C = 2πr
            </text>
          </svg>
        );

      case 'chord':
        return (
          <svg width="300" height="300" viewBox="0 0 300 300">
            <circle cx={centerX} cy={centerY} r={radius} fill="none" stroke="#ddd" strokeWidth="2" />
            <circle cx={centerX} cy={centerY} r="4" fill="#333" />
            <motion.line
              x1={centerX - 50}
              y1={centerY - 60}
              x2={centerX + 60}
              y2={centerY + 50}
              stroke={currentPart.color}
              strokeWidth="4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <circle cx={centerX - 50} cy={centerY - 60} r="5" fill={currentPart.color} />
            <circle cx={centerX + 60} cy={centerY + 50} r="5" fill={currentPart.color} />
            <text x={centerX + 20} y={centerY} fill={currentPart.color} fontSize="14" fontWeight="bold">
              Chord
            </text>
          </svg>
        );

      case 'tangent':
        return (
          <svg width="300" height="300" viewBox="0 0 300 300">
            <circle cx={centerX} cy={centerY} r={radius} fill="none" stroke="#ddd" strokeWidth="2" />
            <circle cx={centerX} cy={centerY} r="4" fill="#333" />
            <line
              x1={centerX}
              y1={centerY}
              x2={centerX + radius}
              y2={centerY}
              stroke="#999"
              strokeWidth="2"
              strokeDasharray="4"
            />
            <motion.line
              x1={centerX + radius}
              y1={centerY - 60}
              x2={centerX + radius}
              y2={centerY + 60}
              stroke={currentPart.color}
              strokeWidth="4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <circle cx={centerX + radius} cy={centerY} r="5" fill={currentPart.color} />
            <text x={centerX + radius + 10} y={centerY - 20} fill={currentPart.color} fontSize="14" fontWeight="bold">
              Tangent
            </text>
            <text x={centerX + radius - 15} y={centerY + 25} fill="#999" fontSize="12">
              90°
            </text>
          </svg>
        );

      case 'secant':
        return (
          <svg width="300" height="300" viewBox="0 0 300 300">
            <circle cx={centerX} cy={centerY} r={radius} fill="none" stroke="#ddd" strokeWidth="2" />
            <circle cx={centerX} cy={centerY} r="4" fill="#333" />
            <motion.line
              x1={centerX - 100}
              y1={centerY - 80}
              x2={centerX + 100}
              y2={centerY + 20}
              stroke={currentPart.color}
              strokeWidth="4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <circle cx={centerX - 55} cy={centerY - 52} r="5" fill={currentPart.color} />
            <circle cx={centerX + 79} cy={centerY + 10} r="5" fill={currentPart.color} />
            <text x={centerX + 20} y={centerY - 30} fill={currentPart.color} fontSize="14" fontWeight="bold">
              Secant
            </text>
          </svg>
        );

      case 'arc':
        return (
          <svg width="300" height="300" viewBox="0 0 300 300">
            <circle cx={centerX} cy={centerY} r={radius} fill="none" stroke="#ddd" strokeWidth="2" />
            <circle cx={centerX} cy={centerY} r="4" fill="#333" />
            <motion.path
              d={`M ${centerX + radius} ${centerY} A ${radius} ${radius} 0 0 0 ${centerX} ${centerY - radius}`}
              fill="none"
              stroke={currentPart.color}
              strokeWidth="6"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <circle cx={centerX + radius} cy={centerY} r="5" fill={currentPart.color} />
            <circle cx={centerX} cy={centerY - radius} r="5" fill={currentPart.color} />
            <text x={centerX + 40} y={centerY - 40} fill={currentPart.color} fontSize="14" fontWeight="bold">
              Arc
            </text>
          </svg>
        );

      case 'sector':
        return (
          <svg width="300" height="300" viewBox="0 0 300 300">
            <circle cx={centerX} cy={centerY} r={radius} fill="none" stroke="#ddd" strokeWidth="2" />
            <motion.path
              d={`M ${centerX} ${centerY} L ${centerX + radius} ${centerY} A ${radius} ${radius} 0 0 0 ${centerX} ${centerY - radius} Z`}
              fill={currentPart.color}
              opacity="0.4"
              stroke={currentPart.color}
              strokeWidth="3"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1 }}
            />
            <line x1={centerX} y1={centerY} x2={centerX + radius} y2={centerY} stroke={currentPart.color} strokeWidth="3" />
            <line x1={centerX} y1={centerY} x2={centerX} y2={centerY - radius} stroke={currentPart.color} strokeWidth="3" />
            <circle cx={centerX} cy={centerY} r="5" fill={currentPart.color} />
            <text x={centerX + 30} y={centerY - 30} fill={currentPart.color} fontSize="14" fontWeight="bold">
              Sector
            </text>
          </svg>
        );

      case 'segment':
        return (
          <svg width="300" height="300" viewBox="0 0 300 300">
            <circle cx={centerX} cy={centerY} r={radius} fill="none" stroke="#ddd" strokeWidth="2" />
            <circle cx={centerX} cy={centerY} r="4" fill="#333" />
            {/* Calculate chord endpoints on the circle */}
            {(() => {
              const chordY = centerY + 45; // Chord below center
              const dx = Math.sqrt(radius * radius - (chordY - centerY) * (chordY - centerY));
              const x1 = centerX - dx;
              const x2 = centerX + dx;

              return (
                <>
                  {/* Segment - region between chord and arc */}
                  <motion.path
                    d={`M ${x1} ${chordY} A ${radius} ${radius} 0 0 0 ${x2} ${chordY} L ${x1} ${chordY} Z`}
                    fill={currentPart.color}
                    opacity="0.4"
                    stroke={currentPart.color}
                    strokeWidth="3"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1 }}
                  />
                  {/* Chord line */}
                  <line
                    x1={x1}
                    y1={chordY}
                    x2={x2}
                    y2={chordY}
                    stroke={currentPart.color}
                    strokeWidth="3"
                  />
                  <circle cx={x1} cy={chordY} r="5" fill={currentPart.color} />
                  <circle cx={x2} cy={chordY} r="5" fill={currentPart.color} />
                  <text x={centerX - 30} y={chordY - 20} fill={currentPart.color} fontSize="14" fontWeight="bold">
                    Segment
                  </text>
                </>
              );
            })()}
          </svg>
        );

      case 'semicircle':
        return (
          <svg width="300" height="300" viewBox="0 0 300 300">
            <circle cx={centerX} cy={centerY} r={radius} fill="none" stroke="#ddd" strokeWidth="2" strokeDasharray="5,5" />
            <motion.path
              d={`M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY} Z`}
              fill={currentPart.color}
              opacity="0.4"
              stroke={currentPart.color}
              strokeWidth="3"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1 }}
            />
            <line
              x1={centerX - radius}
              y1={centerY}
              x2={centerX + radius}
              y2={centerY}
              stroke={currentPart.color}
              strokeWidth="3"
            />
            <circle cx={centerX} cy={centerY} r="5" fill={currentPart.color} />
            <text x={centerX - 30} y={centerY - 40} fill={currentPart.color} fontSize="14" fontWeight="bold">
              Semicircle
            </text>
          </svg>
        );

      case 'annulus':
        return (
          <svg width="300" height="300" viewBox="0 0 300 300">
            <motion.circle
              cx={centerX}
              cy={centerY}
              r={radius}
              fill="none"
              stroke={currentPart.color}
              strokeWidth="30"
              opacity="0.5"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1 }}
            />
            <circle cx={centerX} cy={centerY} r="4" fill="#333" />
            <line x1={centerX} y1={centerY} x2={centerX + radius - 15} y2={centerY} stroke="#666" strokeWidth="2" strokeDasharray="3" />
            <line x1={centerX} y1={centerY} x2={centerX + radius + 15} y2={centerY} stroke="#999" strokeWidth="2" strokeDasharray="3" />
            <text x={centerX + 30} y={centerY - 10} fill="#666" fontSize="12" fontWeight="bold">
              r
            </text>
            <text x={centerX + radius + 20} y={centerY - 10} fill="#999" fontSize="12" fontWeight="bold">
              R
            </text>
            <text x={centerX - 40} y={centerY + 50} fill={currentPart.color} fontSize="14" fontWeight="bold">
              Annulus
            </text>
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-white/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-36 h-36 bg-white/10 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>

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

          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
              Circle Geometry
            </h1>
            <p className="text-white/90 text-sm md:text-base">
              Learn all parts of a circle
            </p>
          </div>

          <button
            onClick={handleSpeak}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all p-3 rounded-full shadow-lg text-white"
            title="Speak info"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-4 py-8 flex items-center justify-center min-h-[calc(100vh-120px)]">
        <div className="max-w-5xl w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl p-6 md:p-12 shadow-2xl"
            >
              {/* Circle Part Display */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Left: Visualization */}
                <div className="flex flex-col items-center justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="relative"
                  >
                    {renderVisualization()}
                  </motion.div>
                  <h2 className="text-4xl md:text-5xl font-bold mt-6" style={{ color: currentPart.color }}>
                    {currentPart.name}
                  </h2>
                  {currentPart.formula && (
                    <div className="mt-3 bg-gray-100 px-4 py-2 rounded-lg">
                      <code className="text-lg font-mono text-gray-800">{currentPart.formula}</code>
                    </div>
                  )}
                </div>

                {/* Right: Information */}
                <div className="flex flex-col justify-center">
                  {/* Description */}
                  <div className="mb-6">
                    <p className="text-gray-700 text-lg leading-relaxed">{currentPart.description}</p>
                  </div>

                  {/* Properties */}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-3">Properties:</h3>
                    <ul className="space-y-2">
                      {currentPart.properties.map((prop, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-center gap-2 text-gray-700"
                        >
                          <span className="text-xl">✓</span>
                          <span>{prop}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Fun Fact */}
              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-6 rounded-2xl mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <span className="text-2xl">💡</span>
                  Fun Fact:
                </h3>
                <p className="text-gray-700 text-lg">{currentPart.funFact}</p>
              </div>

              {/* Real World Examples */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Real World Examples:
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {currentPart.realWorldExamples.map((example, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-gradient-to-br from-gray-100 to-gray-200 p-4 rounded-xl text-center"
                    >
                      <span className="text-gray-700 font-medium">{example}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <button
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
                    currentIndex === 0
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg'
                  }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                  Previous
                </button>

                <div className="text-gray-600 font-medium">
                  {currentIndex + 1} / {CIRCLE_PARTS.length}
                </div>

                <button
                  onClick={handleNext}
                  disabled={currentIndex === CIRCLE_PARTS.length - 1}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
                    currentIndex === CIRCLE_PARTS.length - 1
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg'
                  }`}
                >
                  Next
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
