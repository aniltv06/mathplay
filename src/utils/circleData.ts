/**
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 *
 * Static circle geometry data extracted from CircleGeometryMode.tsx.
 * Exporting CIRCLE_PARTS and CATEGORIES reduces that file by ~300 lines.
 */

export interface CirclePart {
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

export interface CircleCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  parts: string[];
}

export const CIRCLE_PARTS: CirclePart[] = [
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

// ─── Category structure for menu navigation ───────────────────────────────────

export const CIRCLE_CATEGORIES: CircleCategory[] = [
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
