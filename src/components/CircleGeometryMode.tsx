/**
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

/**
 * Circle Geometry Mode - Enhanced
 * Interactive learning for all parts of a circle with rich animations
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ChevronLeft, ChevronRight, Volume2, Sparkles, Grid3x3 } from 'lucide-react';
import { useVoiceFeedback } from '../hooks/useVoiceFeedback';
import { CirclePartsReference } from './CirclePartsReference';

interface Props {
  onBack: () => void;
  profileId: string;
}

interface CirclePart {
  id: string;
  name: string;
  description: string;
  detailedDescription: string;
  formula?: string;
  properties: string[];
  realWorldExamples: string[];
  funFact: string;
  mathInsight: string;
  color: string;
}

const CIRCLE_PARTS: CirclePart[] = [
  {
    id: 'all-parts',
    name: 'All Parts Overview',
    description: 'A circle is one of the most perfect shapes in mathematics! Let\'s explore all its amazing parts together.',
    detailedDescription: 'Every circle has many special parts that help us understand and use it. From the center point to the curved edge, each part has its own name and special properties. Understanding these parts helps us solve problems in geometry, art, engineering, and everyday life!',
    properties: [
      '🔵 Linear Elements - Lines and points that help define the circle',
      '🌀 Curved & Area Elements - Curves and regions within the circle',
    ],
    realWorldExamples: ['Math textbooks', 'Geometry classes', 'Engineering diagrams', 'Architecture plans'],
    funFact: 'Ancient Greek mathematicians like Euclid studied circles over 2,300 years ago!',
    mathInsight: 'A circle is the set of all points that are exactly the same distance from a center point. This simple definition leads to all the beautiful properties we see!',
    color: '#8B5CF6',
  },
  {
    id: 'center',
    name: 'Center',
    description: 'The magical point right in the middle of every circle - the heart from which everything else is measured!',
    detailedDescription: 'The center is the most important point of a circle. It\'s the reference point for everything else. Every single point on the circle\'s edge is exactly the same distance from the center. This special property is what makes a circle so perfect and symmetrical!',
    properties: [
      'Fixed point in the exact middle',
      'Equidistant from all points on the circle',
      'Used to define and draw the circle',
      'The starting point for all measurements',
    ],
    realWorldExamples: ['Bullseye on a dartboard', 'Hub of a bicycle wheel', 'Center of a clock face', 'Middle of a roundabout', 'Axis of a spinning top'],
    funFact: 'Interestingly, the center point is NOT actually part of the circle itself - it just defines where the circle is!',
    mathInsight: 'In coordinate geometry, if a circle has its center at point (h, k), the equation is (x - h)² + (y - k)² = r²',
    color: '#FF6B6B',
  },
  {
    id: 'radius',
    name: 'Radius',
    description: 'A straight line from the heart of the circle (center) to any point on its edge - like a spoke on a wheel!',
    detailedDescription: 'The radius is one of the most fundamental measurements of a circle. No matter which point on the circle you measure to, the radius is always the same length. This consistency is what gives circles their perfect roundness!',
    formula: 'r = d/2 (radius equals half the diameter)',
    properties: [
      'Extends from center to the edge',
      'All radii in a circle are equal length',
      'Exactly half of the diameter',
      'Used to calculate area and circumference',
    ],
    realWorldExamples: ['Spoke of a bicycle wheel', 'Hands on a clock', 'Pizza slice from center to crust', 'Umbrella rib', 'Ferris wheel spoke'],
    funFact: 'The word "radius" comes from the Latin word meaning "ray" or "spoke of a wheel"!',
    mathInsight: 'The radius is the key to all circle calculations. Circle area = πr² and circumference = 2πr both depend on the radius!',
    color: '#4ECDC4',
  },
  {
    id: 'diameter',
    name: 'Diameter',
    description: 'The longest line you can draw across a circle - it passes straight through the center from edge to edge!',
    detailedDescription: 'The diameter is special because it\'s the longest possible straight line that can fit inside a circle. It always passes through the center and connects two points on opposite sides of the circle. It\'s exactly twice as long as the radius!',
    formula: 'd = 2r (diameter equals 2 times radius)',
    properties: [
      'The longest chord in any circle',
      'Always passes through the center',
      'Exactly twice the length of radius',
      'Divides the circle into two equal halves',
    ],
    realWorldExamples: ['Width across a pizza', 'Full width of a wheel', 'Diameter of a circular table', 'Width of a round mirror', 'Distance across a full moon'],
    funFact: 'Every diameter is also a chord, but it\'s the LONGEST chord possible in a circle!',
    mathInsight: 'If you know the diameter, you can quickly find circumference: C = πd. This is why π (pi) is approximately 3.14 - it\'s the ratio of circumference to diameter!',
    color: '#95E1D3',
  },
  {
    id: 'circumference',
    name: 'Circumference',
    description: 'The distance all the way around the circle - like walking around the edge of a circular track!',
    detailedDescription: 'The circumference is the perimeter of a circle - the total distance around its edge. Unlike polygons with straight sides, a circle\'s perimeter is curved. We use the special number π (pi) to calculate it!',
    formula: 'C = 2πr or C = πd',
    properties: [
      'Total distance around the circle',
      'Uses the special number π (pi ≈ 3.14159...)',
      'Like perimeter, but for circles',
      'Grows larger as radius increases',
    ],
    realWorldExamples: ['Running track around a circular field', 'Edge of a dinner plate', 'Rim of a coffee cup', 'Circumference of Earth at equator', 'Distance around a merry-go-round'],
    funFact: 'If you measure ANY circle\'s circumference and divide by its diameter, you always get π (pi) - approximately 3.14159!',
    mathInsight: 'The number π is infinite and never repeats! Mathematicians have calculated it to over 100 trillion digits, but we usually just use 3.14.',
    color: '#F38181',
  },
  {
    id: 'chord',
    name: 'Chord',
    description: 'A straight line connecting any two points on the circle - like a bridge from one side to another!',
    detailedDescription: 'A chord is any straight line segment whose endpoints both lie on the circle. Chords can be any length, but they can never be longer than the diameter. The closer a chord passes to the center, the longer it is!',
    properties: [
      'Connects any two points on the circle',
      'Does NOT pass through the center (unless it\'s a diameter)',
      'The longest chord is the diameter',
      'Divides the circle into two segments',
    ],
    realWorldExamples: ['String stretched across a drum', 'Bridge across a circular pond', 'Line connecting two points on a clock face', 'Horizon line across the moon', 'Rope across a circular tent'],
    funFact: 'The diameter is actually a special type of chord - the only chord that passes through the center and the longest possible chord!',
    mathInsight: 'If you draw a line from the center perpendicular to any chord, it will bisect (split in half) that chord perfectly!',
    color: '#AA96DA',
  },
  {
    id: 'tangent',
    name: 'Tangent',
    description: 'A special line that kisses the circle at exactly one point - touching but never crossing inside!',
    detailedDescription: 'A tangent line is unique because it touches the circle at precisely one point and never enters the inside of the circle. At the point where it touches, the tangent forms a perfect 90-degree angle with the radius!',
    properties: [
      'Touches circle at exactly one point only',
      'Forms a 90° angle with the radius at touch point',
      'Never enters the inside of the circle',
      'Represents the instantaneous direction of motion',
    ],
    realWorldExamples: ['Road touching the edge of a roundabout', 'Horizon line touching Earth\'s curve', 'Ruler edge touching a coin', 'Train track tangent to a curve', 'Ladder leaning against a circular silo'],
    funFact: 'When a ball rolls in a circular path and you let it go, it flies off along the tangent line!',
    mathInsight: 'The perpendicular relationship (90°) between a tangent and radius is one of the most important properties in circle geometry!',
    color: '#FF6B9D',
  },
  {
    id: 'secant',
    name: 'Secant',
    description: 'A line that slices through the circle, crossing it at two points - like a sword through a donut!',
    detailedDescription: 'A secant is a line that intersects a circle at two distinct points. Unlike a tangent that just touches, a secant cuts through the circle. The part of the secant inside the circle is actually a chord!',
    properties: [
      'Crosses through the circle completely',
      'Intersects the circle at two points',
      'Contains a chord between intersection points',
      'Extends beyond the circle on both sides',
    ],
    realWorldExamples: ['Road passing through a circular park', 'Tunnel through a mountain (circular cross-section)', 'Stick poked through a ball', 'Arrow through a circular target', 'Skewer through a circular fruit'],
    funFact: 'If you extend any chord into a line that goes on forever in both directions, it becomes a secant!',
    mathInsight: 'The Secant-Secant Theorem helps us calculate distances and angles when two secants are drawn from the same external point!',
    color: '#FFD93D',
  },
  {
    id: 'arc',
    name: 'Arc',
    description: 'A curved section of the circle\'s edge - like taking a bite from the crust of a circular pizza!',
    detailedDescription: 'An arc is a continuous piece of the circle\'s circumference between two points. Arcs can be measured by their length (in units like cm or inches) or by the angle they make at the center (in degrees). There are two types: a Minor Arc (less than 180° - the shorter path) and a Major Arc (more than 180° - the longer path around).',
    formula: 'Arc length = (θ/360°) × 2πr (where θ is angle in degrees)',
    properties: [
      'Part of the circle\'s circumference',
      'Measured by angle or by length',
      'Minor Arc: Less than 180° (shorter path)',
      'Major Arc: More than 180° (longer path)',
      'Forms part of the circle\'s edge',
    ],
    realWorldExamples: ['Pizza crust on one slice', 'Part of a rainbow', 'Curved section of a running track', 'Arc of a basketball shot', 'Curved path of a swing'],
    funFact: 'A complete circle is actually an arc of 360 degrees - a full revolution! A semicircle (exactly 180°) is neither minor nor major.',
    mathInsight: 'The ratio of an arc\'s length to the full circumference equals the ratio of its angle to 360°. Minor arc + Major arc = full circle (360°)!',
    color: '#6BCB77',
  },
  {
    id: 'sector',
    name: 'Sector',
    description: 'A "pizza slice" shape - the pie-shaped region between two radii and an arc. Delicious and mathematical!',
    detailedDescription: 'A sector looks like a slice of pie or pizza! It\'s the region enclosed by two radii and the arc between them. Sectors are used everywhere - from pie charts showing data to windshield wipers sweeping across glass!',
    formula: 'Area = (θ/360°) × πr² (where θ is angle in degrees)',
    properties: [
      'Shaped like a slice of pie or pizza',
      'Bounded by two radii and one arc',
      'Area depends on the central angle',
      'Used in pie charts and data visualization',
    ],
    realWorldExamples: ['Slice of pizza', 'Pie chart section', 'Windshield wiper sweep area', 'Radar detection zone', 'Slice of circular cake'],
    funFact: 'When the angle is exactly 180°, the sector is a perfect semicircle - exactly half the circle!',
    mathInsight: 'Just like arc length, the ratio of sector area to total circle area equals the ratio of the angle to 360°!',
    color: '#FFB84C',
  },
  {
    id: 'segment',
    name: 'Segment',
    description: 'The region between a chord and its arc - comes in two types: Minor Segment (smaller) and Major Segment (larger)!',
    detailedDescription: 'A segment is the region cut off by a chord. When a chord divides a circle, it creates two segments: the Minor Segment (the smaller piece, less than half the circle) and the Major Segment (the larger piece, more than half the circle). Each segment is bounded by a straight line (the chord) on one side and a curved line (the arc) on the other. Unlike a sector which uses two radii, a segment uses just one chord!',
    properties: [
      'Region cut off by a chord and its arc',
      'Has one straight side (chord) and one curved side (arc)',
      'Minor Segment: Smaller region, less than half circle',
      'Major Segment: Larger region, more than half circle',
      'Different from sector - uses chord, not radii',
    ],
    realWorldExamples: ['Crescent moon shape (minor)', 'Orange slice (minor)', 'Lens shape in optics', 'Contact lens shape', 'Arch window'],
    funFact: 'A chord always creates both a minor segment and a major segment! The only exception is when the chord is a diameter - then both segments are equal semicircles!',
    mathInsight: 'To find segment area, calculate the sector area and subtract the triangle area formed by the two radii and chord! Minor segment + Major segment = Full circle area (πr²)!',
    color: '#C44569',
  },
  {
    id: 'semicircle',
    name: 'Semicircle',
    description: 'Exactly half of a circle - created when a diameter perfectly splits the circle into two equal parts!',
    detailedDescription: 'A semicircle is precisely one-half of a circle. It\'s formed when a diameter divides the circle into two equal parts. Semicircles have special properties, including the amazing fact that any angle inscribed in a semicircle is always a right angle (90°)!',
    formula: 'Area = πr²/2',
    properties: [
      'Exactly half of a complete circle',
      'Created by a diameter dividing the circle',
      'Has a 180° arc',
      'Any inscribed angle is 90° (Thales\' Theorem)',
    ],
    realWorldExamples: ['Half moon', 'Protractor (measuring tool)', 'Arched doorway', 'Half-pipe in skateboarding', 'Rainbow (appears as semicircle)'],
    funFact: 'Thales\' Theorem states that any angle inscribed in a semicircle is ALWAYS exactly 90° - this was discovered over 2,500 years ago!',
    mathInsight: 'The area of a semicircle is exactly half the full circle: πr²/2. The perimeter includes the diameter plus the curved arc: πr + 2r.',
    color: '#4DD0E1',
  },
  {
    id: 'annulus',
    name: 'Annulus (Ring)',
    description: 'A ring or donut shape - the region between two circles that share the same center!',
    detailedDescription: 'An annulus (plural: annuli) is formed when you have two concentric circles (circles with the same center). The ring-shaped region between them is called an annulus. Think of it like a donut or a ring!',
    formula: 'Area = π(R² - r²) where R is outer radius, r is inner radius',
    properties: [
      'Ring or donut shape',
      'Formed by two concentric circles (same center)',
      'Has both inner radius (r) and outer radius (R)',
      'Width of ring = R - r',
    ],
    realWorldExamples: ['Donut', 'Wedding ring', 'Metal washer', 'Olympic rings', 'Circular running track', 'Ring toss game'],
    funFact: 'The word "annulus" comes from the Latin word for "little ring"! Saturn\'s rings are giant annuli in space!',
    mathInsight: 'The annulus area is found by subtracting the smaller circle\'s area from the larger circle\'s area: π(R² - r²) = πR² - πr²',
    color: '#9B59B6',
  },
  {
    id: 'point-of-tangency',
    name: 'Point of Tangency',
    description: 'The exact spot where a tangent line kisses the circle - a special point of contact!',
    detailedDescription: 'The point of tangency is the single, precise point where a tangent line touches the circle. At this magical point, the tangent line is perfectly perpendicular (90°) to the radius drawn to that point. It\'s the only point where the tangent and circle meet!',
    properties: [
      'Single point where tangent touches circle',
      'Forms 90° angle with radius at that point',
      'Only one point of contact per tangent',
      'Critical for circle-line relationships',
      'Used to find tangent from external point',
    ],
    realWorldExamples: ['Point where wheel touches ground', 'Contact point of ruler on coin', 'Spot where ladder touches circular tank', 'Ball\'s contact point on curved track'],
    funFact: 'From any external point, you can draw exactly TWO tangent lines to a circle, and both tangent segments are equal in length!',
    mathInsight: 'The perpendicular relationship at the point of tangency is one of the most important properties in circle geometry. If a line is perpendicular to a radius at a point on the circle, that line must be a tangent!',
    color: '#E74C3C',
  },
  {
    id: 'sagitta',
    name: 'Sagitta (Arrow)',
    description: 'The height of the MINOR segment - measures how much the arc bulges from the chord. Only applies to the smaller segment!',
    detailedDescription: 'The sagitta (also called the "versine" or "arrow") is the perpendicular distance from the middle of a chord to the middle of the arc in the MINOR SEGMENT (the smaller region). It measures how much the arc "bulges" outward from the chord. The sagitta ONLY applies to the minor segment - it\'s not measured on the major segment. When a chord divides a circle, the sagitta is always on the side with the smaller arc. The name comes from Latin, meaning "arrow"!',
    formula: 'h = r - √(r² - (c/2)²) where h is sagitta, r is radius, c is chord length',
    properties: [
      'Perpendicular distance from chord to arc',
      'Measured at the midpoint of the chord',
      'Always perpendicular to the chord',
      'Only applies to MINOR SEGMENT (smaller side)',
      'Height of the circular segment',
      'Used in engineering and architecture',
    ],
    realWorldExamples: ['Height of arch bridge', 'Dome ceiling height', 'Lens thickness measurement', 'Satellite dish depth', 'Rainbow height above horizon'],
    funFact: 'Ancient architects used the sagitta to design perfect arches and domes! The Roman Pantheon\'s dome was designed using sagitta calculations over 2,000 years ago!',
    mathInsight: 'The sagitta ONLY measures the minor segment\'s bulge! For a shallow arc, the approximate formula is h ≈ c²/(8r). Minor segment + Major segment = Full circle, but sagitta is NEVER on the major segment side!',
    color: '#16A085',
  },
];

// Category structure for menu navigation
const CATEGORIES = [
  {
    id: 'basic',
    name: 'Basic Elements',
    icon: '📐',
    description: 'Foundation concepts',
    color: 'from-blue-400 to-cyan-500',
    parts: ['all-parts', 'center', 'radius', 'diameter'],
  },
  {
    id: 'lines',
    name: 'Lines & Points',
    icon: '📏',
    description: 'Linear elements',
    color: 'from-purple-400 to-pink-500',
    parts: ['chord', 'tangent', 'secant', 'point-of-tangency'],
  },
  {
    id: 'curves',
    name: 'Curves & Arcs',
    icon: '🌊',
    description: 'Boundaries & edges',
    color: 'from-green-400 to-emerald-500',
    parts: ['circumference', 'arc'],
  },
  {
    id: 'regions',
    name: 'Regions & Areas',
    icon: '🎨',
    description: 'Filled shapes',
    color: 'from-orange-400 to-red-500',
    parts: ['sector', 'segment', 'semicircle', 'annulus'],
  },
  {
    id: 'measurements',
    name: 'Measurements',
    icon: '📊',
    description: 'Special calculations',
    color: 'from-teal-400 to-cyan-500',
    parts: ['sagitta'],
  },
];

export function CircleGeometryMode({ onBack }: Props) {
  const [viewMode, setViewMode] = useState<'menu' | 'learning' | 'reference'>('menu');
  const [currentIndex, setCurrentIndex] = useState(0);
  const { speak } = useVoiceFeedback();

  const currentPart = CIRCLE_PARTS[currentIndex];

  // If showing reference view, render that instead
  if (viewMode === 'reference') {
    return <CirclePartsReference onBack={() => setViewMode('menu')} />;
  }

  // If showing menu, render category selection
  if (viewMode === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 20, 0],
              y: [0, -10, 0]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-40 h-40 bg-white/10 rounded-full blur-xl"
            animate={{
              scale: [1, 1.3, 1],
              x: [0, -20, 0],
              y: [0, 15, 0]
            }}
            transition={{ duration: 5, repeat: Infinity }}
          />
        </div>

        {/* Header */}
        <div className="relative z-10 px-4 py-6">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <motion.button
              onClick={onBack}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all px-4 py-3 rounded-full shadow-lg flex items-center gap-2 text-white"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back</span>
            </motion.button>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg flex items-center justify-center gap-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  ⭕
                </motion.span>
                Circle Geometry
              </h1>
              <p className="text-white/90 text-sm md:text-base">
                Choose a category to explore
              </p>
            </motion.div>

            <motion.button
              onClick={() => setViewMode('reference')}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all p-3 rounded-full shadow-lg text-white"
              title="View all parts"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Grid3x3 className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Category Grid */}
        <div className="relative z-10 px-4 py-8 min-h-[calc(100vh-120px)] flex items-center justify-center">
          <div className="max-w-5xl w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {CATEGORIES.map((category, index) => {
                const categoryParts = CIRCLE_PARTS.filter(part => category.parts.includes(part.id));
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-2xl hover:shadow-3xl transition-all"
                  >
                    <div className={`w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center`}>
                      <span className="text-3xl">{category.icon}</span>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {category.name}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      {category.description}
                    </p>

                    <div className="space-y-2">
                      {categoryParts.map((part) => (
                        <motion.button
                          key={part.id}
                          onClick={() => {
                            const partIndex = CIRCLE_PARTS.findIndex(p => p.id === part.id);
                            setCurrentIndex(partIndex);
                            setViewMode('learning');
                          }}
                          className="w-full text-left px-4 py-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-all flex items-center justify-between group"
                          whileHover={{ x: 5 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span className="text-gray-800 font-medium">{part.name}</span>
                          <motion.span
                            className="text-gray-400 group-hover:text-gray-600"
                            initial={{ x: 0 }}
                            whileHover={{ x: 5 }}
                          >
                            →
                          </motion.span>
                        </motion.button>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500">
                        {categoryParts.length} part{categoryParts.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <motion.span
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    🔵
                  </motion.span>
                  Linear Elements
                </h3>
                <svg width="400" height="400" viewBox="0 0 400 400">
                  {/* Main circle - center (200, 200), radius 120 */}
                  <motion.circle
                    cx="200"
                    cy="200"
                    r="120"
                    fill="none"
                    stroke="#333"
                    strokeWidth="3"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  />

                  {/* Chord (blue) - upper portion */}
                  {(() => {
                    const cy = 130;
                    const dy = 200 - cy;
                    const dx = Math.sqrt(120 * 120 - dy * dy);
                    const x1 = 200 - dx;
                    const x2 = 200 + dx;
                    return (
                      <motion.g
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                      >
                        <motion.line
                          x1={x1}
                          y1={cy}
                          x2={x2}
                          y2={cy}
                          stroke="#5B8DEE"
                          strokeWidth="3"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ delay: 0.5, duration: 0.8 }}
                        />
                        <motion.circle
                          cx={x1}
                          cy={cy}
                          r="4"
                          fill="#5B8DEE"
                          initial={{ scale: 0 }}
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ delay: 0.8, duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
                        />
                        <motion.circle
                          cx={x2}
                          cy={cy}
                          r="4"
                          fill="#5B8DEE"
                          initial={{ scale: 0 }}
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ delay: 0.8, duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
                        />
                        <motion.text
                          x="220"
                          y="115"
                          fill="#5B8DEE"
                          fontSize="13"
                          fontWeight="bold"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1 }}
                        >
                          Chord
                        </motion.text>
                      </motion.g>
                    );
                  })()}

                  {/* Radius (cyan) - from center to upper right */}
                  {(() => {
                    const angle = -Math.PI / 4;
                    const endX = 200 + 120 * Math.cos(angle);
                    const endY = 200 + 120 * Math.sin(angle);
                    return (
                      <motion.g
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                      >
                        <motion.line
                          x1="200"
                          y1="200"
                          x2={endX}
                          y2={endY}
                          stroke="#06B6D4"
                          strokeWidth="3"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ delay: 0.6, duration: 0.8 }}
                        />
                        <motion.circle
                          cx={endX}
                          cy={endY}
                          r="4"
                          fill="#06B6D4"
                          initial={{ scale: 0 }}
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ delay: 0.9, duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
                        />
                        <motion.text
                          x="255"
                          y="155"
                          fill="#06B6D4"
                          fontSize="13"
                          fontWeight="bold"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.1 }}
                        >
                          Radius
                        </motion.text>
                      </motion.g>
                    );
                  })()}

                  {/* Diameter (magenta/pink) - horizontal through center */}
                  <motion.g
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <motion.line
                      x1="80"
                      y1="200"
                      x2="320"
                      y2="200"
                      stroke="#EC4899"
                      strokeWidth="3"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 0.7, duration: 0.8 }}
                    />
                    <circle cx="80" cy="200" r="4" fill="#EC4899" />
                    <circle cx="320" cy="200" r="4" fill="#EC4899" />
                    <line x1="320" y1="200" x2="360" y2="200" stroke="#EC4899" strokeWidth="2" />
                    <path d="M 355 195 L 360 200 L 355 205" fill="none" stroke="#EC4899" strokeWidth="2" />
                    <motion.text
                      x="200"
                      y="235"
                      fill="#EC4899"
                      fontSize="13"
                      fontWeight="bold"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2 }}
                    >
                      Diameter
                    </motion.text>
                  </motion.g>

                  {/* Secant (teal/green) */}
                  {(() => {
                    const angle1 = (3.5 * Math.PI) / 4;
                    const angle2 = (2 * Math.PI) / 3;
                    const x1 = 200 + 120 * Math.cos(angle1);
                    const y1 = 200 + 120 * Math.sin(angle1);
                    const x2 = 200 + 120 * Math.cos(angle2);
                    const y2 = 200 + 120 * Math.sin(angle2);
                    const dx = x2 - x1;
                    const dy = y2 - y1;
                    const len = Math.sqrt(dx * dx + dy * dy);
                    const extX1 = x1 - (dx / len) * 50;
                    const extY1 = y1 - (dy / len) * 50;
                    const extX2 = x2 + (dx / len) * 50;
                    const extY2 = y2 + (dy / len) * 50;

                    return (
                      <motion.g
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                      >
                        <motion.line
                          x1={extX1}
                          y1={extY1}
                          x2={extX2}
                          y2={extY2}
                          stroke="#14B8A6"
                          strokeWidth="3"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ delay: 0.8, duration: 0.8 }}
                        />
                        <circle cx={x1} cy={y1} r="4" fill="#14B8A6" />
                        <circle cx={x2} cy={y2} r="4" fill="#14B8A6" />
                        <motion.text
                          x="95"
                          y="330"
                          fill="#14B8A6"
                          fontSize="13"
                          fontWeight="bold"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.3 }}
                        >
                          Secant
                        </motion.text>
                      </motion.g>
                    );
                  })()}

                  {/* Tangent (red) */}
                  <motion.g
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                  >
                    <motion.line
                      x1="320"
                      y1="140"
                      x2="320"
                      y2="350"
                      stroke="#DC2626"
                      strokeWidth="3"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 0.9, duration: 0.8 }}
                    />
                    <path d="M 315 345 L 320 350 L 325 345" fill="none" stroke="#DC2626" strokeWidth="2" />
                    <circle cx="320" cy="200" r="4" fill="#DC2626" />
                    <motion.text
                      x="328"
                      y="260"
                      fill="#DC2626"
                      fontSize="13"
                      fontWeight="bold"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.4 }}
                    >
                      Tangent
                    </motion.text>
                    <rect x="315" y="195" width="10" height="10" fill="none" stroke="#999" strokeWidth="1" />
                    <line x1="200" y1="200" x2="320" y2="200" stroke="#999" strokeWidth="1" strokeDasharray="4,4" />
                  </motion.g>

                  {/* Center point */}
                  <motion.g
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1.5, type: "spring", stiffness: 200 }}
                  >
                    <motion.circle
                      cx="200"
                      cy="200"
                      r="5"
                      fill="#FF6B6B"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ delay: 2, duration: 1, repeat: Infinity, repeatDelay: 1 }}
                    />
                    <text x="165" y="195" fill="#FF6B6B" fontSize="12" fontWeight="bold">Center</text>
                  </motion.g>
                </svg>
              </motion.div>

              {/* Diagram 2: Curved & Area Elements */}
              <motion.div
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🌀
                  </motion.span>
                  Curved & Area Elements
                </h3>
                <svg width="400" height="400" viewBox="0 0 400 400">
                  {/* Main circle */}
                  <motion.circle
                    cx="200"
                    cy="200"
                    r="120"
                    fill="none"
                    stroke="#333"
                    strokeWidth="3"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  />

                  <circle cx="200" cy="200" r="5" fill="#333" />

                  {/* Circumference */}
                  <motion.circle
                    cx="200"
                    cy="200"
                    r="120"
                    fill="none"
                    stroke="#9333EA"
                    strokeWidth="4"
                    strokeDasharray="10,5"
                    opacity="0.6"
                    initial={{ pathLength: 0, rotate: 0 }}
                    animate={{ pathLength: 1, rotate: 360 }}
                    transition={{ duration: 3, ease: "easeInOut" }}
                  />
                  <motion.text
                    x="240"
                    y="75"
                    fill="#9333EA"
                    fontSize="13"
                    fontWeight="bold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    Circumference
                  </motion.text>

                  {/* Arc */}
                  {(() => {
                    const startAngle = (5 * Math.PI) / 4;
                    const endAngle = (7 * Math.PI) / 4;
                    const startX = 200 + 120 * Math.cos(startAngle);
                    const startY = 200 + 120 * Math.sin(startAngle);
                    const endX = 200 + 120 * Math.cos(endAngle);
                    const endY = 200 + 120 * Math.sin(endAngle);
                    return (
                      <motion.g
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        <motion.path
                          d={`M ${startX} ${startY} A 120 120 0 0 1 ${endX} ${endY}`}
                          fill="none"
                          stroke="#F97316"
                          strokeWidth="6"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ delay: 0.8, duration: 1 }}
                        />
                        <circle cx={startX} cy={startY} r="4" fill="#F97316" />
                        <circle cx={endX} cy={endY} r="4" fill="#F97316" />
                        <motion.text
                          x="170"
                          y="335"
                          fill="#F97316"
                          fontSize="13"
                          fontWeight="bold"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.3 }}
                        >
                          Arc
                        </motion.text>
                      </motion.g>
                    );
                  })()}

                  {/* Sector */}
                  {(() => {
                    const angle1 = (3 * Math.PI) / 4;
                    const angle2 = (5 * Math.PI) / 4;
                    const x1 = 200 + 120 * Math.cos(angle1);
                    const y1 = 200 + 120 * Math.sin(angle1);
                    const x2 = 200 + 120 * Math.cos(angle2);
                    const y2 = 200 + 120 * Math.sin(angle2);
                    return (
                      <motion.g
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7, duration: 0.8, type: "spring" }}
                      >
                        <path
                          d={`M 200 200 L ${x1} ${y1} A 120 120 0 0 1 ${x2} ${y2} Z`}
                          fill="#EAB308"
                          opacity="0.4"
                          stroke="#EAB308"
                          strokeWidth="3"
                        />
                        <line x1="200" y1="200" x2={x1} y2={y1} stroke="#EAB308" strokeWidth="2" />
                        <line x1="200" y1="200" x2={x2} y2={y2} stroke="#EAB308" strokeWidth="2" />
                        <motion.text
                          x="95"
                          y="235"
                          fill="#EAB308"
                          fontSize="13"
                          fontWeight="bold"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.4 }}
                        >
                          Sector
                        </motion.text>
                      </motion.g>
                    );
                  })()}

                  {/* Segment */}
                  {(() => {
                    const chordY = 250;
                    const dy = chordY - 200;
                    const dx = Math.sqrt(120 * 120 - dy * dy);
                    const x1 = 200 - dx;
                    const x2 = 200 + dx;
                    return (
                      <motion.g
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8, duration: 0.8, type: "spring" }}
                      >
                        <path
                          d={`M ${x1} ${chordY} A 120 120 0 0 0 ${x2} ${chordY} Z`}
                          fill="#22C55E"
                          opacity="0.4"
                          stroke="#22C55E"
                          strokeWidth="3"
                        />
                        <line x1={x1} y1={chordY} x2={x2} y2={chordY} stroke="#22C55E" strokeWidth="3" />
                        <motion.text
                          x="240"
                          y="295"
                          fill="#22C55E"
                          fontSize="13"
                          fontWeight="bold"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.5 }}
                        >
                          Segment
                        </motion.text>
                      </motion.g>
                    );
                  })()}

                  {/* Semicircle */}
                  <motion.g
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                  >
                    <motion.path
                      d={`M 200 80 A 120 120 0 0 0 200 320 Z`}
                      fill="none"
                      stroke="#06B6D4"
                      strokeWidth="5"
                      strokeDasharray="8,4"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 1.1, duration: 1.2 }}
                    />
                    <motion.text
                      x="85"
                      y="200"
                      fill="#06B6D4"
                      fontSize="13"
                      fontWeight="bold"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.6 }}
                    >
                      Semicircle
                    </motion.text>
                    <line x1="200" y1="80" x2="200" y2="320" stroke="#06B6D4" strokeWidth="2" strokeDasharray="4,2" />
                  </motion.g>

                  {/* Annulus */}
                  {(() => {
                    const centerX = 200;
                    const centerY = 200;
                    const outerR = 55;
                    const innerR = 35;
                    return (
                      <motion.g
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1, duration: 0.8, type: "spring" }}
                      >
                        <motion.circle
                          cx={centerX}
                          cy={centerY}
                          r={outerR}
                          fill="#EC4899"
                          opacity="0.25"
                          stroke="#EC4899"
                          strokeWidth="3"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ delay: 2, duration: 2, repeat: Infinity }}
                        />
                        <circle cx={centerX} cy={centerY} r={innerR} fill="white" stroke="#EC4899" strokeWidth="3" />
                        <line x1={centerX} y1={centerY} x2={centerX - innerR} y2={centerY} stroke="#EC4899" strokeWidth="2" strokeDasharray="3,2" />
                        <line x1={centerX} y1={centerY} x2={centerX - outerR} y2={centerY} stroke="#EC4899" strokeWidth="2" strokeDasharray="3,2" />
                        <text x={centerX - innerR - 15} y={centerY - 5} fill="#EC4899" fontSize="10" fontWeight="bold">r</text>
                        <text x={centerX - outerR - 15} y={centerY - 5} fill="#EC4899" fontSize="10" fontWeight="bold">R</text>
                        <motion.text
                          x={centerX - 30}
                          y={centerY + 15}
                          fill="#EC4899"
                          fontSize="13"
                          fontWeight="bold"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.7 }}
                        >
                          Annulus
                        </motion.text>
                      </motion.g>
                    );
                  })()}
                </svg>
              </motion.div>
            </div>
          </div>
        );

      case 'center':
        return (
          <svg width="300" height="300" viewBox="0 0 300 300">
            <motion.circle
              cx={centerX}
              cy={centerY}
              r={radius}
              fill="none"
              stroke="#ddd"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8 }}
            />
            {/* Radiating circles */}
            <motion.circle
              cx={centerX}
              cy={centerY}
              r="20"
              fill="none"
              stroke={currentPart.color}
              strokeWidth="2"
              opacity="0.3"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [1, 2, 3], opacity: [0.5, 0.2, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.circle
              cx={centerX}
              cy={centerY}
              r="8"
              fill={currentPart.color}
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <motion.text
              x={centerX + 15}
              y={centerY - 10}
              fill={currentPart.color}
              fontSize="14"
              fontWeight="bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Center
            </motion.text>
          </svg>
        );

      case 'radius':
        return (
          <svg width="300" height="300" viewBox="0 0 300 300">
            <motion.circle
              cx={centerX}
              cy={centerY}
              r={radius}
              fill="none"
              stroke="#ddd"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8 }}
            />
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
              transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 0.5 }}
            />
            <motion.circle
              cx={centerX + radius}
              cy={centerY}
              r="5"
              fill={currentPart.color}
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            {/* Measurement arc */}
            <motion.path
              d={`M ${centerX + 30} ${centerY} A 30 30 0 0 1 ${centerX + 30 * Math.cos(Math.PI/6)} ${centerY + 30 * Math.sin(Math.PI/6)}`}
              fill="none"
              stroke={currentPart.color}
              strokeWidth="1"
              strokeDasharray="2,2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            />
            <motion.text
              x={centerX + 30}
              y={centerY - 10}
              fill={currentPart.color}
              fontSize="14"
              fontWeight="bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              r
            </motion.text>
          </svg>
        );

      case 'diameter':
        return (
          <svg width="300" height="300" viewBox="0 0 300 300">
            <motion.circle
              cx={centerX}
              cy={centerY}
              r={radius}
              fill="none"
              stroke="#ddd"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8 }}
            />
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
              transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 0.5 }}
            />
            <motion.circle
              cx={centerX - radius}
              cy={centerY}
              r="5"
              fill={currentPart.color}
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <motion.circle
              cx={centerX + radius}
              cy={centerY}
              r="5"
              fill={currentPart.color}
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
            />
            <motion.text
              x={centerX - 10}
              y={centerY - 10}
              fill={currentPart.color}
              fontSize="14"
              fontWeight="bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              d
            </motion.text>
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
              transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
              strokeDasharray="1"
            />
            {/* Animated dots following the circumference */}
            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
              <motion.circle
                key={i}
                cx={centerX + radius * Math.cos((angle * Math.PI) / 180)}
                cy={centerY + radius * Math.sin((angle * Math.PI) / 180)}
                r="3"
                fill={currentPart.color}
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.5, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
            <circle cx={centerX} cy={centerY} r="4" fill="#333" />
            <motion.text
              x={centerX + radius + 10}
              y={centerY}
              fill={currentPart.color}
              fontSize="14"
              fontWeight="bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              C = 2πr
            </motion.text>
          </svg>
        );

      case 'chord':
        return (
          <svg width="300" height="300" viewBox="0 0 300 300">
            <motion.circle
              cx={centerX}
              cy={centerY}
              r={radius}
              fill="none"
              stroke="#ddd"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8 }}
            />
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
              transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 0.5 }}
            />
            <motion.circle
              cx={centerX - 50}
              cy={centerY - 60}
              r="5"
              fill={currentPart.color}
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <motion.circle
              cx={centerX + 60}
              cy={centerY + 50}
              r="5"
              fill={currentPart.color}
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
            />
            <motion.text
              x={centerX + 20}
              y={centerY}
              fill={currentPart.color}
              fontSize="14"
              fontWeight="bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Chord
            </motion.text>
          </svg>
        );

      case 'tangent':
        return (
          <svg width="300" height="300" viewBox="0 0 300 300">
            <motion.circle
              cx={centerX}
              cy={centerY}
              r={radius}
              fill="none"
              stroke="#ddd"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8 }}
            />
            <circle cx={centerX} cy={centerY} r="4" fill="#333" />
            <motion.line
              x1={centerX}
              y1={centerY}
              x2={centerX + radius}
              y2={centerY}
              stroke="#999"
              strokeWidth="2"
              strokeDasharray="4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5 }}
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
              transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 0.5 }}
            />
            <motion.circle
              cx={centerX + radius}
              cy={centerY}
              r="5"
              fill={currentPart.color}
              animate={{ scale: [1, 1.8, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            {/* Right angle indicator with animation */}
            <motion.rect
              x={centerX + radius - 10}
              y={centerY - 10}
              width="10"
              height="10"
              fill="none"
              stroke="#999"
              strokeWidth="1"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.text
              x={centerX + radius + 10}
              y={centerY - 20}
              fill={currentPart.color}
              fontSize="14"
              fontWeight="bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Tangent
            </motion.text>
            <motion.text
              x={centerX + radius - 15}
              y={centerY + 25}
              fill="#999"
              fontSize="12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              90°
            </motion.text>
          </svg>
        );

      case 'secant':
        return (
          <svg width="300" height="300" viewBox="0 0 300 300">
            <motion.circle
              cx={centerX}
              cy={centerY}
              r={radius}
              fill="none"
              stroke="#ddd"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8 }}
            />
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
              transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 0.5 }}
            />
            <motion.circle
              cx={centerX - 55}
              cy={centerY - 52}
              r="5"
              fill={currentPart.color}
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <motion.circle
              cx={centerX + 79}
              cy={centerY + 10}
              r="5"
              fill={currentPart.color}
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
            />
            <motion.text
              x={centerX + 20}
              y={centerY - 30}
              fill={currentPart.color}
              fontSize="14"
              fontWeight="bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Secant
            </motion.text>
          </svg>
        );

      case 'arc':
        return (
          <svg width="300" height="300" viewBox="0 0 300 300">
            <motion.circle
              cx={centerX}
              cy={centerY}
              r={radius}
              fill="none"
              stroke="#ddd"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8 }}
            />
            <circle cx={centerX} cy={centerY} r="4" fill="#333" />

            {/* Minor Arc (90 degrees - short path) */}
            <motion.path
              d={`M ${centerX + radius} ${centerY} A ${radius} ${radius} 0 0 0 ${centerX} ${centerY - radius}`}
              fill="none"
              stroke="#22C55E"
              strokeWidth="6"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 0.5 }}
            />

            {/* Major Arc (270 degrees - long path) */}
            <motion.path
              d={`M ${centerX + radius} ${centerY} A ${radius} ${radius} 0 1 1 ${centerX} ${centerY - radius}`}
              fill="none"
              stroke="#F59E0B"
              strokeWidth="4"
              strokeDasharray="8,4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.5 }}
            />

            {/* Endpoint markers */}
            <motion.circle
              cx={centerX + radius}
              cy={centerY}
              r="5"
              fill="#666"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <motion.circle
              cx={centerX}
              cy={centerY - radius}
              r="5"
              fill="#666"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
            />

            {/* Labels */}
            <motion.text
              x={centerX + 50}
              y={centerY - 50}
              fill="#22C55E"
              fontSize="12"
              fontWeight="bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Minor Arc
            </motion.text>
            <motion.text
              x={centerX + 55}
              y={centerY - 35}
              fill="#22C55E"
              fontSize="10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              (90° - short)
            </motion.text>

            <motion.text
              x={centerX - 90}
              y={centerY + 10}
              fill="#F59E0B"
              fontSize="12"
              fontWeight="bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Major Arc
            </motion.text>
            <motion.text
              x={centerX - 90}
              y={centerY + 25}
              fill="#F59E0B"
              fontSize="10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              (270° - long)
            </motion.text>
          </svg>
        );

      case 'sector':
        return (
          <svg width="300" height="300" viewBox="0 0 300 300">
            <motion.circle
              cx={centerX}
              cy={centerY}
              r={radius}
              fill="none"
              stroke="#ddd"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8 }}
            />
            <motion.path
              d={`M ${centerX} ${centerY} L ${centerX + radius} ${centerY} A ${radius} ${radius} 0 0 0 ${centerX} ${centerY - radius} Z`}
              fill={currentPart.color}
              opacity="0.4"
              stroke={currentPart.color}
              strokeWidth="3"
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1, rotate: [0, 5, 0] }}
              transition={{ duration: 1, rotate: { duration: 2, repeat: Infinity } }}
            />
            <motion.line
              x1={centerX}
              y1={centerY}
              x2={centerX + radius}
              y2={centerY}
              stroke={currentPart.color}
              strokeWidth="3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            />
            <motion.line
              x1={centerX}
              y1={centerY}
              x2={centerX}
              y2={centerY - radius}
              stroke={currentPart.color}
              strokeWidth="3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            />
            <motion.circle
              cx={centerX}
              cy={centerY}
              r="5"
              fill={currentPart.color}
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <motion.text
              x={centerX + 30}
              y={centerY - 30}
              fill={currentPart.color}
              fontSize="14"
              fontWeight="bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Sector
            </motion.text>
          </svg>
        );

      case 'segment':
        return (
          <svg width="300" height="300" viewBox="0 0 300 300">
            <motion.circle
              cx={centerX}
              cy={centerY}
              r={radius}
              fill="none"
              stroke="#ddd"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8 }}
            />
            <circle cx={centerX} cy={centerY} r="4" fill="#333" />
            {(() => {
              const chordY = centerY + 45;
              const dx = Math.sqrt(radius * radius - (chordY - centerY) * (chordY - centerY));
              const x1 = centerX - dx;
              const x2 = centerX + dx;

              return (
                <>
                  {/* Minor Segment (below chord) */}
                  <motion.path
                    d={`M ${x1} ${chordY} A ${radius} ${radius} 0 0 0 ${x2} ${chordY} L ${x1} ${chordY} Z`}
                    fill="#22C55E"
                    opacity="0.5"
                    stroke="#22C55E"
                    strokeWidth="3"
                    initial={{ scale: 0 }}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1, scale: { duration: 2, repeat: Infinity } }}
                  />

                  {/* Major Segment (above chord) */}
                  <motion.path
                    d={`M ${x1} ${chordY} A ${radius} ${radius} 0 1 1 ${x2} ${chordY} L ${x1} ${chordY} Z`}
                    fill="#F59E0B"
                    opacity="0.3"
                    stroke="#F59E0B"
                    strokeWidth="2"
                    strokeDasharray="8,4"
                    initial={{ scale: 0 }}
                    animate={{ scale: [1, 1.03, 1] }}
                    transition={{ duration: 1, scale: { duration: 2.5, repeat: Infinity } }}
                  />

                  {/* Chord */}
                  <motion.line
                    x1={x1}
                    y1={chordY}
                    x2={x2}
                    y2={chordY}
                    stroke="#666"
                    strokeWidth="3"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  />

                  {/* Endpoint markers */}
                  <motion.circle
                    cx={x1}
                    cy={chordY}
                    r="5"
                    fill="#666"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <motion.circle
                    cx={x2}
                    cy={chordY}
                    r="5"
                    fill="#666"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                  />

                  {/* Labels */}
                  <motion.text
                    x={centerX - 15}
                    y={chordY + 35}
                    fill="#22C55E"
                    fontSize="12"
                    fontWeight="bold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    Minor
                  </motion.text>
                  <motion.text
                    x={centerX - 20}
                    y={chordY + 48}
                    fill="#22C55E"
                    fontSize="12"
                    fontWeight="bold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    Segment
                  </motion.text>

                  <motion.text
                    x={centerX - 15}
                    y={centerY - 40}
                    fill="#F59E0B"
                    fontSize="12"
                    fontWeight="bold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    Major
                  </motion.text>
                  <motion.text
                    x={centerX - 20}
                    y={centerY - 27}
                    fill="#F59E0B"
                    fontSize="12"
                    fontWeight="bold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    Segment
                  </motion.text>
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
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 1, scale: { duration: 2, repeat: Infinity } }}
            />
            <motion.line
              x1={centerX - radius}
              y1={centerY}
              x2={centerX + radius}
              y2={centerY}
              stroke={currentPart.color}
              strokeWidth="3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            />
            <motion.circle
              cx={centerX}
              cy={centerY}
              r="5"
              fill={currentPart.color}
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <motion.text
              x={centerX - 30}
              y={centerY - 40}
              fill={currentPart.color}
              fontSize="14"
              fontWeight="bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Semicircle
            </motion.text>
            {/* Thales' theorem illustration */}
            <motion.text
              x={centerX - 20}
              y={centerY + 60}
              fill="#666"
              fontSize="10"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              180° arc
            </motion.text>
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
              animate={{ scale: 1, rotate: 360 }}
              transition={{
                scale: { duration: 1 },
                rotate: { duration: 20, repeat: Infinity, ease: "linear" }
              }}
            />
            <circle cx={centerX} cy={centerY} r="4" fill="#333" />
            <motion.line
              x1={centerX}
              y1={centerY}
              x2={centerX + radius - 15}
              y2={centerY}
              stroke="#666"
              strokeWidth="2"
              strokeDasharray="3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            />
            <motion.line
              x1={centerX}
              y1={centerY}
              x2={centerX + radius + 15}
              y2={centerY}
              stroke="#999"
              strokeWidth="2"
              strokeDasharray="3"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            />
            <motion.text
              x={centerX + 30}
              y={centerY - 10}
              fill="#666"
              fontSize="12"
              fontWeight="bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              r
            </motion.text>
            <motion.text
              x={centerX + radius + 20}
              y={centerY - 10}
              fill="#999"
              fontSize="12"
              fontWeight="bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              R
            </motion.text>
            <motion.text
              x={centerX - 40}
              y={centerY + 50}
              fill={currentPart.color}
              fontSize="14"
              fontWeight="bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Annulus
            </motion.text>
          </svg>
        );

      case 'point-of-tangency':
        return (
          <svg width="300" height="300" viewBox="0 0 300 300">
            <motion.circle
              cx={centerX}
              cy={centerY}
              r={radius}
              fill="none"
              stroke="#ddd"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8 }}
            />
            <circle cx={centerX} cy={centerY} r="4" fill="#333" />

            {/* Radius to point of tangency */}
            <motion.line
              x1={centerX}
              y1={centerY}
              x2={centerX + radius}
              y2={centerY}
              stroke="#999"
              strokeWidth="2"
              strokeDasharray="4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5 }}
            />

            {/* Tangent line */}
            <motion.line
              x1={centerX + radius}
              y1={centerY - 60}
              x2={centerX + radius}
              y2={centerY + 60}
              stroke={currentPart.color}
              strokeWidth="4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 0.5 }}
            />

            {/* Point of tangency with pulsing effect */}
            <motion.circle
              cx={centerX + radius}
              cy={centerY}
              r="8"
              fill={currentPart.color}
              animate={{ scale: [1, 1.8, 1], opacity: [1, 0.6, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <motion.circle
              cx={centerX + radius}
              cy={centerY}
              r="15"
              fill="none"
              stroke={currentPart.color}
              strokeWidth="2"
              opacity="0.4"
              animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            {/* Right angle indicator */}
            <motion.rect
              x={centerX + radius - 10}
              y={centerY - 10}
              width="10"
              height="10"
              fill="none"
              stroke="#999"
              strokeWidth="1"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            <motion.text
              x={centerX + radius + 15}
              y={centerY - 20}
              fill={currentPart.color}
              fontSize="13"
              fontWeight="bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Point of
            </motion.text>
            <motion.text
              x={centerX + radius + 15}
              y={centerY - 7}
              fill={currentPart.color}
              fontSize="13"
              fontWeight="bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Tangency
            </motion.text>
            <motion.text
              x={centerX + radius - 15}
              y={centerY + 25}
              fill="#999"
              fontSize="12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              90°
            </motion.text>
          </svg>
        );

      case 'sagitta':
        return (
          <svg width="300" height="300" viewBox="0 0 300 300">
            <motion.circle
              cx={centerX}
              cy={centerY}
              r={radius}
              fill="none"
              stroke="#ddd"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.8 }}
            />
            <circle cx={centerX} cy={centerY} r="4" fill="#333" />

            {(() => {
              // Place chord to create clear minor and major segments
              const distanceFromCenter = 30; // Distance from center to chord (reduced for taller sagitta)
              const chordY = centerY + distanceFromCenter; // Chord below center
              const dx = Math.sqrt(radius * radius - distanceFromCenter * distanceFromCenter);
              const x1 = centerX - dx;
              const x2 = centerX + dx;

              // The arc point at the bottom of the minor segment (deepest point on the arc)
              const arcY = centerY + radius; // Bottom point of circle

              // Sagitta height
              const sagittaHeight = arcY - chordY; // Should be: radius - distanceFromCenter

              return (
                <>
                  {/* Major Segment (above chord) - faded to show it doesn't have sagitta */}
                  <motion.path
                    d={`M ${x1} ${chordY} A ${radius} ${radius} 0 1 1 ${x2} ${chordY} Z`}
                    fill="#E0E0E0"
                    opacity="0.2"
                    stroke="#999"
                    strokeWidth="1"
                    strokeDasharray="4,2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.2 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  />

                  {/* Minor Segment (below chord) - highlighted with sagitta */}
                  <motion.path
                    d={`M ${x1} ${chordY} A ${radius} ${radius} 0 0 0 ${x2} ${chordY} Z`}
                    fill="#D62828"
                    opacity="0.3"
                    stroke="#D62828"
                    strokeWidth="2"
                    initial={{ scale: 0 }}
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 1, scale: { duration: 2, repeat: Infinity } }}
                  />

                  {/* Chord */}
                  <motion.line
                    x1={x1}
                    y1={chordY}
                    x2={x2}
                    y2={chordY}
                    stroke="#333"
                    strokeWidth="3"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  />

                  {/* Arc emphasis (minor segment bottom) */}
                  <motion.path
                    d={`M ${x1} ${chordY} A ${radius} ${radius} 0 0 0 ${x2} ${chordY}`}
                    fill="none"
                    stroke="#A78BFA"
                    strokeWidth="4"
                    opacity="0.8"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                  />

                  {/* Sagitta line (perpendicular from chord midpoint DOWN to arc) */}
                  <motion.line
                    x1={centerX}
                    y1={chordY}
                    x2={centerX}
                    y2={arcY}
                    stroke="#F77F00"
                    strokeWidth="4"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.5, duration: 0.6, repeat: Infinity, repeatDelay: 0.5 }}
                  />

                  {/* Arrow heads pointing downward from chord and upward from arc */}
                  <path d={`M ${centerX - 4} ${chordY + 8} L ${centerX} ${chordY} L ${centerX + 4} ${chordY + 8}`} fill="none" stroke="#F77F00" strokeWidth="2" />
                  <path d={`M ${centerX - 4} ${arcY - 8} L ${centerX} ${arcY} L ${centerX + 4} ${arcY - 8}`} fill="none" stroke="#F77F00" strokeWidth="2" />

                  {/* Endpoints */}
                  <circle cx={x1} cy={chordY} r="4" fill="#333" />
                  <circle cx={x2} cy={chordY} r="4" fill="#333" />
                  <motion.circle
                    cx={centerX}
                    cy={chordY}
                    r="5"
                    fill="#F77F00"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <motion.circle
                    cx={centerX}
                    cy={arcY}
                    r="5"
                    fill="#F77F00"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
                  />

                  {/* Labels */}
                  <motion.text
                    x={centerX - 75}
                    y={(chordY + arcY) / 2 + 5}
                    fill="#F77F00"
                    fontSize="14"
                    fontWeight="bold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    Sagitta (h)
                  </motion.text>
                  <motion.text
                    x={centerX - 25}
                    y={chordY - 10}
                    fill="#333"
                    fontSize="12"
                    fontWeight="bold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    Chord
                  </motion.text>
                  <motion.text
                    x={centerX + 15}
                    y={chordY + 25}
                    fill="#D62828"
                    fontSize="11"
                    fontWeight="bold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    Minor Segment
                  </motion.text>
                  <motion.text
                    x={centerX - 55}
                    y={centerY - 50}
                    fill="#999"
                    fontSize="10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    Major Segment
                  </motion.text>
                  <motion.text
                    x={centerX - 60}
                    y={centerY - 38}
                    fill="#999"
                    fontSize="9"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    (no sagitta here)
                  </motion.text>
                </>
              );
            })()}
          </svg>
        );

      default:
        return null;
    }
  };

  // Learning Mode - Individual Circle Part View
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 relative overflow-hidden">
      {/* Enhanced animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 20, 0],
            y: [0, -10, 0]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-40 h-40 bg-white/10 rounded-full blur-xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -20, 0],
            y: [0, 15, 0]
          }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-36 h-36 bg-white/10 rounded-full blur-xl"
          animate={{
            scale: [1, 1.4, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      </div>

      {/* Header */}
      <div className="relative z-10 px-4 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <motion.button
            onClick={() => setViewMode('menu')}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all px-4 py-3 rounded-full shadow-lg flex items-center gap-2 text-white"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Menu</span>
          </motion.button>

          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg flex items-center justify-center gap-2">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                ⭕
              </motion.span>
              Circle Geometry
            </h1>
            <p className="text-white/90 text-sm md:text-base">
              Discover the magic of circles!
            </p>
          </motion.div>

          <div className="flex items-center gap-2">
            <motion.button
              onClick={() => setViewMode('reference')}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all p-3 rounded-full shadow-lg text-white"
              title="View all parts"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Grid3x3 className="w-5 h-5" />
            </motion.button>
            <motion.button
              onClick={handleSpeak}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all p-3 rounded-full shadow-lg text-white"
              title="Speak info"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Volume2 className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-4 py-8 flex items-center justify-center min-h-[calc(100vh-120px)]">
        <div className="max-w-5xl w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-white rounded-3xl p-6 md:p-12 shadow-2xl"
            >
              {/* Circle Part Display */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Left: Visualization */}
                <div className="flex flex-col items-center justify-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="relative"
                  >
                    {renderVisualization()}
                  </motion.div>
                  <motion.h2
                    className="text-4xl md:text-5xl font-bold mt-6 flex items-center gap-2"
                    style={{ color: currentPart.color }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.2 }}
                  >
                    {currentPart.name}
                    <motion.span
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Sparkles className="w-8 h-8" />
                    </motion.span>
                  </motion.h2>
                  {currentPart.formula && (
                    <motion.div
                      className="mt-3 bg-gray-100 px-4 py-2 rounded-lg"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.15, duration: 0.2 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <code className="text-lg font-mono text-gray-800">{currentPart.formula}</code>
                    </motion.div>
                  )}
                </div>

                {/* Right: Information */}
                <div className="flex flex-col justify-center">
                  {/* Description */}
                  <motion.div
                    className="mb-6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05, duration: 0.2 }}
                  >
                    <p className="text-gray-700 text-lg leading-relaxed font-medium mb-3">
                      {currentPart.description}
                    </p>
                    <p className="text-gray-600 text-base leading-relaxed">
                      {currentPart.detailedDescription}
                    </p>
                  </motion.div>

                  {/* Properties */}
                  <div className="mb-6">
                    <motion.h3
                      className="text-xl font-bold text-gray-800 mb-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1, duration: 0.2 }}
                    >
                      Key Properties:
                    </motion.h3>
                    <ul className="space-y-2">
                      {currentPart.properties.map((prop, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.15 + i * 0.03, duration: 0.2 }}
                          whileHover={{ x: 5, scale: 1.02 }}
                          className="flex items-center gap-2 text-gray-700 bg-gray-50 p-2 rounded-lg"
                        >
                          <motion.span
                            className="text-xl"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ delay: 0.2 + i * 0.03, duration: 0.3 }}
                          >
                            ✓
                          </motion.span>
                          <span>{prop}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Math Insight - New Section */}
              <motion.div
                className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl mb-6 border-2 border-blue-200"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.2 }}
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="text-lg font-bold text-blue-800 mb-2 flex items-center gap-2">
                  <motion.span
                    className="text-2xl"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  >
                    🧮
                  </motion.span>
                  Math Insight:
                </h3>
                <p className="text-blue-900 text-base leading-relaxed">
                  {currentPart.mathInsight}
                </p>
              </motion.div>

              {/* Fun Fact */}
              <motion.div
                className="bg-gradient-to-r from-yellow-100 to-orange-100 p-6 rounded-2xl mb-6 border-2 border-yellow-300"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.2 }}
                whileHover={{ scale: 1.02 }}
              >
                <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <motion.span
                    className="text-2xl"
                    animate={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    💡
                  </motion.span>
                  Fun Fact:
                </h3>
                <p className="text-gray-700 text-lg">{currentPart.funFact}</p>
              </motion.div>

              {/* Real World Examples */}
              <div className="mb-6">
                <motion.h3
                  className="text-xl font-bold text-gray-800 mb-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.2 }}
                >
                  Real World Examples:
                </motion.h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {currentPart.realWorldExamples.map((example, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.35 + i * 0.02, duration: 0.2 }}
                      whileHover={{ scale: 1.1, rotate: [0, -2, 2, 0] }}
                      className="bg-gradient-to-br from-gray-100 to-gray-200 p-4 rounded-xl text-center shadow-md cursor-pointer"
                    >
                      <span className="text-gray-700 font-medium">{example}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <motion.div
                className="flex items-center justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.2 }}
              >
                <motion.button
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
                    currentIndex === 0
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg'
                  }`}
                  whileHover={currentIndex === 0 ? {} : { scale: 1.05, x: -5 }}
                  whileTap={currentIndex === 0 ? {} : { scale: 0.95 }}
                >
                  <ChevronLeft className="w-5 h-5" />
                  Previous
                </motion.button>

                <motion.div
                  className="text-gray-600 font-medium"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {currentIndex + 1} / {CIRCLE_PARTS.length}
                </motion.div>

                <motion.button
                  onClick={handleNext}
                  disabled={currentIndex === CIRCLE_PARTS.length - 1}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
                    currentIndex === CIRCLE_PARTS.length - 1
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg'
                  }`}
                  whileHover={currentIndex === CIRCLE_PARTS.length - 1 ? {} : { scale: 1.05, x: 5 }}
                  whileTap={currentIndex === CIRCLE_PARTS.length - 1 ? {} : { scale: 0.95 }}
                >
                  Next
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
