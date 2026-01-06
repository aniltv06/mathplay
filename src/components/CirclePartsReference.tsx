/**
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

/**
 * Circle Parts Reference - Complete Overview
 * Consolidated view of all circle parts with diagrams and reference table
 */

import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export function CirclePartsReference({ onBack }: Props) {
  const renderCirclePart = (id: string, title: string, description: string, color: string) => {
    const centerX = 75;
    const centerY = 70;
    const radius = 45;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl p-4 shadow-lg border-2 border-gray-200 hover:border-purple-300 transition-all"
      >
        <div className="text-center mb-2">
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          <p className="text-xs text-gray-600">{description}</p>
        </div>
        <svg width="150" height="140" viewBox="0 0 150 140" className="mx-auto">
          {/* Background circle for all */}
          <circle cx={centerX} cy={centerY} r={radius} fill="none" stroke="#ddd" strokeWidth="2" />

          {id === 'radius' && (
            <>
              <line x1={centerX} y1={centerY} x2={centerX + radius} y2={centerY} stroke={color} strokeWidth="3" />
              <circle cx={centerX} cy={centerY} r="3" fill="#000" />
              <circle cx={centerX + radius} cy={centerY} r="3" fill={color} />
              <text x={centerX + 15} y={centerY - 8} fill={color} fontSize="10" fontWeight="bold">r</text>
            </>
          )}

          {id === 'diameter' && (
            <>
              <line x1={centerX - radius} y1={centerY} x2={centerX + radius} y2={centerY} stroke={color} strokeWidth="3" />
              <circle cx={centerX - radius} cy={centerY} r="3" fill={color} />
              <circle cx={centerX + radius} cy={centerY} r="3" fill={color} />
              <circle cx={centerX} cy={centerY} r="2" fill="#000" />
              <text x={centerX - 5} y={centerY - 8} fill={color} fontSize="10" fontWeight="bold">d</text>
            </>
          )}

          {id === 'circumference' && (
            <circle cx={centerX} cy={centerY} r={radius} fill="none" stroke={color} strokeWidth="3" />
          )}

          {id === 'chord' && (
            <>
              <line x1={centerX - 30} y1={centerY - 35} x2={centerX + 40} y2={centerY + 30} stroke={color} strokeWidth="3" />
              <circle cx={centerX - 30} cy={centerY - 35} r="3" fill={color} />
              <circle cx={centerX + 40} cy={centerY + 30} r="3" fill={color} />
            </>
          )}

          {id === 'arc' && (
            <>
              <path
                d={`M ${centerX + radius} ${centerY} A ${radius} ${radius} 0 0 0 ${centerX} ${centerY - radius}`}
                fill="none"
                stroke="#22C55E"
                strokeWidth="4"
              />
              <path
                d={`M ${centerX + radius} ${centerY} A ${radius} ${radius} 0 1 1 ${centerX} ${centerY - radius}`}
                fill="none"
                stroke="#F59E0B"
                strokeWidth="2"
                strokeDasharray="4,2"
              />
              <circle cx={centerX + radius} cy={centerY} r="3" fill="#666" />
              <circle cx={centerX} cy={centerY - radius} r="3" fill="#666" />
              <text x={centerX + 30} y={centerY - 30} fill="#22C55E" fontSize="8">Minor</text>
              <text x={centerX - 45} y={centerY + 10} fill="#F59E0B" fontSize="8">Major</text>
            </>
          )}

          {id === 'sector' && (
            <>
              <path
                d={`M ${centerX} ${centerY} L ${centerX + radius} ${centerY} A ${radius} ${radius} 0 0 0 ${centerX} ${centerY - radius} Z`}
                fill={color}
                opacity="0.5"
                stroke={color}
                strokeWidth="2"
              />
              <circle cx={centerX} cy={centerY} r="3" fill="#000" />
            </>
          )}

          {id === 'segment' && (() => {
            const chordY = centerY + 30;
            const dy = chordY - centerY;
            const dx = Math.sqrt(radius * radius - dy * dy);
            const x1 = centerX - dx;
            const x2 = centerX + dx;
            return (
              <>
                <path
                  d={`M ${x1} ${chordY} A ${radius} ${radius} 0 0 0 ${x2} ${chordY} Z`}
                  fill={color}
                  opacity="0.5"
                  stroke={color}
                  strokeWidth="2"
                />
                <line x1={x1} y1={chordY} x2={x2} y2={chordY} stroke={color} strokeWidth="2" />
              </>
            );
          })()}

          {id === 'semicircle' && (
            <>
              <path
                d={`M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY} Z`}
                fill={color}
                opacity="0.5"
                stroke={color}
                strokeWidth="2"
              />
              <line x1={centerX - radius} y1={centerY} x2={centerX + radius} y2={centerY} stroke={color} strokeWidth="2" />
            </>
          )}

          {id === 'annulus' && (
            <>
              <circle cx={centerX} cy={centerY} r={radius} fill="none" stroke={color} strokeWidth="15" opacity="0.6" />
              <circle cx={centerX} cy={centerY} r="2" fill="#000" />
            </>
          )}

          {id === 'tangent' && (
            <>
              <line x1={centerX - 50} y1={centerY + radius} x2={centerX + 50} y2={centerY + radius} stroke={color} strokeWidth="3" />
              <line x1={centerX} y1={centerY} x2={centerX} y2={centerY + radius} stroke="#999" strokeWidth="1" strokeDasharray="3,2" />
              <circle cx={centerX} cy={centerY + radius} r="3" fill={color} />
              <rect x={centerX - 5} y={centerY + radius - 5} width="5" height="5" fill="none" stroke="#999" strokeWidth="1" />
            </>
          )}

          {id === 'secant' && (
            <>
              <line x1={centerX - 50} y1={centerY - 25} x2={centerX + 50} y2={centerY + 25} stroke={color} strokeWidth="3" />
              <circle cx={centerX - 30} cy={centerY - 15} r="3" fill={color} />
              <circle cx={centerX + 40} cy={centerY + 20} r="3" fill={color} />
            </>
          )}

          {id === 'concentric' && (
            <>
              <circle cx={centerX} cy={centerY} r={radius * 0.6} fill="none" stroke="#B4A7D6" strokeWidth="2" />
              <circle cx={centerX} cy={centerY} r={radius} fill="none" stroke="#9D8BC0" strokeWidth="2" />
              <circle cx={centerX} cy={centerY} r="2" fill="#000" />
            </>
          )}
        </svg>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-white/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={onBack}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all px-4 py-3 rounded-full shadow-lg flex items-center gap-2 text-white mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-5xl font-bold text-white drop-shadow-lg mb-2">
              Complete Parts of a Circle
            </h1>
            <p className="text-xl text-white/90">All geometric regions and lines in one place</p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Grid of Circle Parts */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Visual Reference Guide</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {renderCirclePart('radius', '1. Radius', 'Center to edge', '#FF6B6B')}
              {renderCirclePart('diameter', '2. Diameter', 'Longest chord (2r)', '#4ECDC4')}
              {renderCirclePart('circumference', '3. Circumference', 'Outer edge (2πr)', '#FFD93D')}
              {renderCirclePart('chord', '4. Chord', 'Line between 2 points', '#95E1D3')}
              {renderCirclePart('arc', '5. Arc', 'Curved portion', '#6BCB77')}
              {renderCirclePart('sector', '6. Sector', 'Pie slice shape', '#AA96DA')}
              {renderCirclePart('segment', '7. Segment', 'Chord + arc region', '#FCBAD3')}
              {renderCirclePart('semicircle', '8. Semicircle', 'Half circle (180°)', '#FFB6B9')}
              {renderCirclePart('annulus', '9. Annulus', 'Ring shape', '#FEC8D8')}
              {renderCirclePart('tangent', '10. Tangent', 'Touches at 1 point', '#A8E6CF')}
              {renderCirclePart('secant', '11. Secant', 'Crosses at 2 points', '#FFD3B6')}
              {renderCirclePart('concentric', '12. Concentric', 'Same center circles', '#9D8BC0')}
            </div>
          </motion.div>

          {/* Reference Table */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 shadow-2xl mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Complete Reference Table</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    <th className="px-4 py-3 text-left font-bold">Part Name</th>
                    <th className="px-4 py-3 text-left font-bold">Category</th>
                    <th className="px-4 py-3 text-left font-bold">Definition</th>
                    <th className="px-4 py-3 text-left font-bold">Key Property / Formula</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200 hover:bg-purple-50 transition-colors">
                    <td className="px-4 py-3 font-bold text-gray-800">Radius</td>
                    <td className="px-4 py-3"><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">LINE</span></td>
                    <td className="px-4 py-3 text-gray-700">Segment from center to circumference</td>
                    <td className="px-4 py-3 text-gray-700">All radii are equal (= r)</td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-purple-50 transition-colors">
                    <td className="px-4 py-3 font-bold text-gray-800">Diameter</td>
                    <td className="px-4 py-3"><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">LINE</span></td>
                    <td className="px-4 py-3 text-gray-700">Chord through the center</td>
                    <td className="px-4 py-3 text-gray-700">Longest chord, d = 2r</td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-purple-50 transition-colors">
                    <td className="px-4 py-3 font-bold text-gray-800">Circumference</td>
                    <td className="px-4 py-3"><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">BOUNDARY</span></td>
                    <td className="px-4 py-3 text-gray-700">The outer perimeter/edge</td>
                    <td className="px-4 py-3 text-gray-700">C = 2πr or πd</td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-purple-50 transition-colors">
                    <td className="px-4 py-3 font-bold text-gray-800">Chord</td>
                    <td className="px-4 py-3"><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">LINE</span></td>
                    <td className="px-4 py-3 text-gray-700">Segment connecting 2 points on circle</td>
                    <td className="px-4 py-3 text-gray-700">Diameter is the longest chord</td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-purple-50 transition-colors">
                    <td className="px-4 py-3 font-bold text-gray-800">Arc</td>
                    <td className="px-4 py-3"><span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">BOUNDARY</span></td>
                    <td className="px-4 py-3 text-gray-700">Curved portion of the circumference</td>
                    <td className="px-4 py-3 text-gray-700">Minor (&lt; 180°) or Major (&gt; 180°)</td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-purple-50 transition-colors">
                    <td className="px-4 py-3 font-bold text-gray-800">Sector</td>
                    <td className="px-4 py-3"><span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-semibold">REGION</span></td>
                    <td className="px-4 py-3 text-gray-700">Pie-shaped region (2 radii + arc)</td>
                    <td className="px-4 py-3 text-gray-700">Area = (θ/360°) × πr²</td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-purple-50 transition-colors">
                    <td className="px-4 py-3 font-bold text-gray-800">Segment</td>
                    <td className="px-4 py-3"><span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-semibold">REGION</span></td>
                    <td className="px-4 py-3 text-gray-700">Region between chord and arc</td>
                    <td className="px-4 py-3 text-gray-700">Area = Sector - Triangle</td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-purple-50 transition-colors">
                    <td className="px-4 py-3 font-bold text-gray-800">Semicircle</td>
                    <td className="px-4 py-3"><span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-semibold">REGION</span></td>
                    <td className="px-4 py-3 text-gray-700">Half of a circle (diameter divides it)</td>
                    <td className="px-4 py-3 text-gray-700">Area = πr²/2, Inscribed ∠ = 90°</td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-purple-50 transition-colors">
                    <td className="px-4 py-3 font-bold text-gray-800">Annulus</td>
                    <td className="px-4 py-3"><span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-semibold">REGION</span></td>
                    <td className="px-4 py-3 text-gray-700">Ring between 2 concentric circles</td>
                    <td className="px-4 py-3 text-gray-700">Area = π(R² - r²)</td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-purple-50 transition-colors">
                    <td className="px-4 py-3 font-bold text-gray-800">Tangent</td>
                    <td className="px-4 py-3"><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">LINE</span></td>
                    <td className="px-4 py-3 text-gray-700">Line touching circle at 1 point</td>
                    <td className="px-4 py-3 text-gray-700">⊥ to radius at tangency point</td>
                  </tr>
                  <tr className="border-b border-gray-200 hover:bg-purple-50 transition-colors">
                    <td className="px-4 py-3 font-bold text-gray-800">Secant</td>
                    <td className="px-4 py-3"><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">LINE</span></td>
                    <td className="px-4 py-3 text-gray-700">Line intersecting circle at 2 points</td>
                    <td className="px-4 py-3 text-gray-700">Contains a chord</td>
                  </tr>
                  <tr className="hover:bg-purple-50 transition-colors">
                    <td className="px-4 py-3 font-bold text-gray-800">Concentric Circles</td>
                    <td className="px-4 py-3"><span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-semibold">SYSTEM</span></td>
                    <td className="px-4 py-3 text-gray-700">2+ circles with same center</td>
                    <td className="px-4 py-3 text-gray-700">Forms annulus between them</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Summary Box */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-6 border-2 border-yellow-300"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="text-2xl">📌</span>
              Quick Summary
            </h3>
            <div className="grid md:grid-cols-4 gap-4 text-gray-700">
              <div>
                <strong className="text-blue-700">Lines:</strong><br />
                Radius, Diameter, Chord, Tangent, Secant
              </div>
              <div>
                <strong className="text-green-700">Boundaries:</strong><br />
                Circumference, Arc
              </div>
              <div>
                <strong className="text-purple-700">Regions:</strong><br />
                Sector, Segment, Semicircle, Annulus
              </div>
              <div>
                <strong className="text-orange-700">System:</strong><br />
                Concentric Circles
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
