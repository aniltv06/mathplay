/**
 * Interactive Circle Playground - Hybrid Approach
 * Three modes: Guided, Challenge, Free Draw
 * Supports all 14 drawable circle parts
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Undo2, Save, Lightbulb, Trophy, Sparkles } from 'lucide-react';
import { useVoiceFeedback } from '../hooks/useVoiceFeedback';

interface Props {
  onBack: () => void;
  profileId: string;
}

type PlaygroundMode = 'guided' | 'challenge' | 'free';
type CirclePart = 'center' | 'radius' | 'diameter' | 'circumference' | 'chord' | 'tangent' |
                  'secant' | 'arc' | 'sector' | 'segment' | 'semicircle' | 'annulus' |
                  'point-of-tangency' | 'sagitta';

interface DrawAction {
  type: CirclePart;
  points: { x: number; y: number }[];
  timestamp: number;
}

interface CirclePartButton {
  id: CirclePart;
  emoji: string;
  label: string;
  description: string;
  color: string;
}

const CIRCLE_PART_BUTTONS: CirclePartButton[] = [
  { id: 'center', emoji: '🎯', label: 'Center', description: 'The middle point of the circle', color: '#FF6B6B' },
  { id: 'radius', emoji: '📍', label: 'Radius', description: 'Line from center to edge', color: '#4ECDC4' },
  { id: 'diameter', emoji: '📏', label: 'Diameter', description: 'Line through center, edge to edge', color: '#95E1D3' },
  { id: 'circumference', emoji: '⭕', label: 'Circumference', description: 'The outer edge of the circle', color: '#F38181' },
  { id: 'chord', emoji: '〰️', label: 'Chord', description: 'Line connecting two points on circle', color: '#AA96DA' },
  { id: 'tangent', emoji: '📐', label: 'Tangent', description: 'Line touching circle at one point', color: '#FF6B9D' },
  { id: 'secant', emoji: '✂️', label: 'Secant', description: 'Line crossing circle at two points', color: '#FFD93D' },
  { id: 'arc', emoji: '🌈', label: 'Arc', description: 'Curved portion of circumference', color: '#6BCB77' },
  { id: 'sector', emoji: '🥧', label: 'Sector', description: 'Pie slice shape with two radii', color: '#FFB84C' },
  { id: 'segment', emoji: '🌙', label: 'Segment', description: 'Region between chord and arc', color: '#C44569' },
  { id: 'semicircle', emoji: '🌗', label: 'Semicircle', description: 'Exactly half of a circle', color: '#4DD0E1' },
  { id: 'annulus', emoji: '🍩', label: 'Annulus', description: 'Ring shape between two circles', color: '#9B59B6' },
  { id: 'point-of-tangency', emoji: '📌', label: 'Tangency Point', description: 'Where tangent touches circle', color: '#E74C3C' },
  { id: 'sagitta', emoji: '📊', label: 'Sagitta', description: 'Height of segment from chord', color: '#16A085' },
];

export function InteractiveCirclePlayground({ onBack, profileId }: Props) {
  const [mode, setMode] = useState<PlaygroundMode>('guided');
  const [selectedPart, setSelectedPart] = useState<CirclePart | null>('circumference');
  const [instruction, setInstruction] = useState('✅ Beautiful! You drew a Circumference! ⭕');
  const [partsDrawn, setPartsDrawn] = useState(1);
  const [history, setHistory] = useState<DrawAction[]>([{ type: 'circumference', points: [], timestamp: Date.now() }]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawPoints, setDrawPoints] = useState<{ x: number; y: number }[]>([]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { speak } = useVoiceFeedback();

  // Canvas dimensions
  const canvasWidth = 600;
  const canvasHeight = 600;
  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;
  const radius = 200;

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear and draw base circle
    drawBaseCircle(ctx);
  }, []);

  const drawBaseCircle = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Background
    ctx.fillStyle = '#f9fafb';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Main circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#d1d5db';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Center point (small dot)
    ctx.beginPath();
    ctx.arc(centerX, centerY, 4, 0, 2 * Math.PI);
    ctx.fillStyle = '#9ca3af';
    ctx.fill();

    // Redraw all history
    history.forEach(action => {
      drawCirclePart(ctx, action.type, action.points);
    });
  };

  const drawCirclePart = (ctx: CanvasRenderingContext2D, part: CirclePart, points: { x: number; y: number }[]) => {
    const partInfo = CIRCLE_PART_BUTTONS.find(p => p.id === part);
    const color = partInfo?.color || '#666';

    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 4;

    switch (part) {
      case 'center':
        ctx.beginPath();
        ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
        ctx.fill();
        break;

      case 'radius':
        if (points.length >= 1) {
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(points[0].x, points[0].y);
          ctx.stroke();
          // End point
          ctx.beginPath();
          ctx.arc(points[0].x, points[0].y, 6, 0, 2 * Math.PI);
          ctx.fill();
        }
        break;

      case 'diameter':
        if (points.length >= 2) {
          ctx.beginPath();
          ctx.moveTo(points[0].x, points[0].y);
          ctx.lineTo(points[1].x, points[1].y);
          ctx.stroke();
          // End points
          ctx.beginPath();
          ctx.arc(points[0].x, points[0].y, 6, 0, 2 * Math.PI);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(points[1].x, points[1].y, 6, 0, 2 * Math.PI);
          ctx.fill();
        }
        break;

      case 'circumference':
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = color;
        ctx.lineWidth = 6;
        ctx.stroke();
        break;

      case 'chord':
        if (points.length >= 2) {
          ctx.beginPath();
          ctx.moveTo(points[0].x, points[0].y);
          ctx.lineTo(points[1].x, points[1].y);
          ctx.stroke();
          // End points
          ctx.beginPath();
          ctx.arc(points[0].x, points[0].y, 6, 0, 2 * Math.PI);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(points[1].x, points[1].y, 6, 0, 2 * Math.PI);
          ctx.fill();
        }
        break;

      case 'tangent':
        if (points.length >= 1) {
          const touchPoint = points[0];
          // Calculate perpendicular to radius at touch point
          const dx = touchPoint.x - centerX;
          const dy = touchPoint.y - centerY;
          const length = Math.sqrt(dx * dx + dy * dy);
          const perpX = -dy / length;
          const perpY = dx / length;
          const tangentLength = 150;

          ctx.beginPath();
          ctx.moveTo(touchPoint.x - perpX * tangentLength, touchPoint.y - perpY * tangentLength);
          ctx.lineTo(touchPoint.x + perpX * tangentLength, touchPoint.y + perpY * tangentLength);
          ctx.stroke();

          // Touch point
          ctx.beginPath();
          ctx.arc(touchPoint.x, touchPoint.y, 6, 0, 2 * Math.PI);
          ctx.fill();
        }
        break;

      case 'secant':
        if (points.length >= 2) {
          // Extend line beyond the two intersection points
          const dx = points[1].x - points[0].x;
          const dy = points[1].y - points[0].y;
          const length = Math.sqrt(dx * dx + dy * dy);
          const extendLength = 100;

          ctx.beginPath();
          ctx.moveTo(points[0].x - (dx / length) * extendLength, points[0].y - (dy / length) * extendLength);
          ctx.lineTo(points[1].x + (dx / length) * extendLength, points[1].y + (dy / length) * extendLength);
          ctx.stroke();

          // Intersection points
          ctx.beginPath();
          ctx.arc(points[0].x, points[0].y, 6, 0, 2 * Math.PI);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(points[1].x, points[1].y, 6, 0, 2 * Math.PI);
          ctx.fill();
        }
        break;

      case 'arc':
        if (points.length >= 2) {
          const angle1 = Math.atan2(points[0].y - centerY, points[0].x - centerX);
          const angle2 = Math.atan2(points[1].y - centerY, points[1].x - centerX);

          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, angle1, angle2);
          ctx.lineWidth = 6;
          ctx.stroke();

          // End points
          ctx.beginPath();
          ctx.arc(points[0].x, points[0].y, 6, 0, 2 * Math.PI);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(points[1].x, points[1].y, 6, 0, 2 * Math.PI);
          ctx.fill();
        }
        break;

      case 'sector':
        if (points.length >= 2) {
          const angle1 = Math.atan2(points[0].y - centerY, points[0].x - centerX);
          const angle2 = Math.atan2(points[1].y - centerY, points[1].x - centerX);

          // Calculate angle difference and determine direction for minor sector
          let angleDiff = angle2 - angle1;
          if (angleDiff < 0) angleDiff += 2 * Math.PI;

          // Use the shorter arc (minor sector)
          const useCounterClockwise = angleDiff <= Math.PI;

          ctx.globalAlpha = 0.3;
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.arc(centerX, centerY, radius, angle1, angle2, !useCounterClockwise);
          ctx.closePath();
          ctx.fill();
          ctx.globalAlpha = 1.0;

          // Draw radii
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(points[0].x, points[0].y);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(points[1].x, points[1].y);
          ctx.stroke();
        }
        break;

      case 'segment':
        if (points.length >= 2) {
          const angle1 = Math.atan2(points[0].y - centerY, points[0].x - centerX);
          const angle2 = Math.atan2(points[1].y - centerY, points[1].x - centerX);

          ctx.globalAlpha = 0.3;
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, angle1, angle2);
          ctx.lineTo(points[0].x, points[0].y);
          ctx.closePath();
          ctx.fill();
          ctx.globalAlpha = 1.0;

          // Draw chord
          ctx.beginPath();
          ctx.moveTo(points[0].x, points[0].y);
          ctx.lineTo(points[1].x, points[1].y);
          ctx.stroke();
        }
        break;

      case 'semicircle':
        if (points.length >= 2) {
          const angle1 = Math.atan2(points[0].y - centerY, points[0].x - centerX);
          const angle2 = Math.atan2(points[1].y - centerY, points[1].x - centerX);

          ctx.globalAlpha = 0.3;
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, angle1, angle2);
          ctx.lineTo(points[0].x, points[0].y);
          ctx.closePath();
          ctx.fill();
          ctx.globalAlpha = 1.0;

          // Draw diameter
          ctx.beginPath();
          ctx.moveTo(points[0].x, points[0].y);
          ctx.lineTo(points[1].x, points[1].y);
          ctx.stroke();
        }
        break;

      case 'annulus':
        const innerRadius = radius * 0.6;
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI, true);
        ctx.fill();
        ctx.globalAlpha = 1.0;

        ctx.beginPath();
        ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
        ctx.stroke();
        break;

      case 'point-of-tangency':
        if (points.length >= 1) {
          // Draw tangent line first
          const touchPoint = points[0];
          const dx = touchPoint.x - centerX;
          const dy = touchPoint.y - centerY;
          const length = Math.sqrt(dx * dx + dy * dy);
          const perpX = -dy / length;
          const perpY = dx / length;
          const tangentLength = 150;

          ctx.strokeStyle = '#ccc';
          ctx.beginPath();
          ctx.moveTo(touchPoint.x - perpX * tangentLength, touchPoint.y - perpY * tangentLength);
          ctx.lineTo(touchPoint.x + perpX * tangentLength, touchPoint.y + perpY * tangentLength);
          ctx.stroke();

          // Highlight the point of tangency
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(touchPoint.x, touchPoint.y, 10, 0, 2 * Math.PI);
          ctx.fill();

          // Draw radius to point
          ctx.strokeStyle = '#ccc';
          ctx.setLineDash([5, 5]);
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(touchPoint.x, touchPoint.y);
          ctx.stroke();
          ctx.setLineDash([]);
        }
        break;

      case 'sagitta':
        if (points.length >= 2) {
          // Draw chord
          ctx.strokeStyle = '#666';
          ctx.beginPath();
          ctx.moveTo(points[0].x, points[0].y);
          ctx.lineTo(points[1].x, points[1].y);
          ctx.stroke();

          // Calculate midpoint of chord
          const midX = (points[0].x + points[1].x) / 2;
          const midY = (points[0].y + points[1].y) / 2;

          // Calculate perpendicular direction from chord
          const chordDx = points[1].x - points[0].x;
          const chordDy = points[1].y - points[0].y;
          const chordLength = Math.sqrt(chordDx * chordDx + chordDy * chordDy);
          let perpX = -chordDy / chordLength;
          let perpY = chordDx / chordLength;

          // Ensure perpendicular points toward minor segment (away from center)
          const toMidX = midX - centerX;
          const toMidY = midY - centerY;
          const dotProduct = perpX * toMidX + perpY * toMidY;

          // If dot product is negative, perpendicular points toward center, so flip it
          if (dotProduct < 0) {
            perpX = -perpX;
            perpY = -perpY;
          }

          // Calculate distance from center to chord midpoint
          const d = Math.sqrt(toMidX * toMidX + toMidY * toMidY);
          const sagittaLength = radius - d;

          // Find arc point
          const arcX = midX + perpX * sagittaLength;
          const arcY = midY + perpY * sagittaLength;

          // Draw sagitta line with color
          ctx.strokeStyle = color;
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(midX, midY);
          ctx.lineTo(arcX, arcY);
          ctx.stroke();

          // Draw arrow heads
          const arrowSize = 8;
          ctx.beginPath();
          ctx.moveTo(midX - arrowSize, midY);
          ctx.lineTo(midX, midY - arrowSize);
          ctx.lineTo(midX + arrowSize, midY);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(arcX - arrowSize, arcY);
          ctx.lineTo(arcX, arcY + arrowSize);
          ctx.lineTo(arcX + arrowSize, arcY);
          ctx.stroke();

          // Draw endpoints
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(midX, midY, 5, 0, 2 * Math.PI);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(arcX, arcY, 5, 0, 2 * Math.PI);
          ctx.fill();
        }
        break;
    }

    ctx.restore();
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!selectedPart) {
      setInstruction('⚠️ Please select a circle part first!');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Snap point to circle if close enough
    const dx = x - centerX;
    const dy = y - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    let snappedX = x;
    let snappedY = y;

    if (Math.abs(dist - radius) < 30) {
      // Snap to circle
      const angle = Math.atan2(dy, dx);
      snappedX = centerX + radius * Math.cos(angle);
      snappedY = centerY + radius * Math.sin(angle);
    }

    const newPoint = { x: snappedX, y: snappedY };
    const updatedPoints = [...drawPoints, newPoint];
    setDrawPoints(updatedPoints);

    // Check if we have enough points to complete the shape
    const requiredPoints = getRequiredPoints(selectedPart);

    if (updatedPoints.length >= requiredPoints) {
      // Validate the drawing
      const validation = validateDrawing(selectedPart, updatedPoints);

      if (!validation.valid) {
        // Invalid drawing - show error and reset points
        setInstruction(validation.message || '❌ Invalid drawing. Try again!');
        speak(validation.message || 'Invalid drawing. Try again!');
        setDrawPoints([]);
        return;
      }

      // Complete the drawing
      const action: DrawAction = {
        type: selectedPart,
        points: updatedPoints,
        timestamp: Date.now(),
      };

      setHistory([...history, action]);
      setDrawPoints([]);
      setPartsDrawn(prev => prev + 1);

      const partInfo = CIRCLE_PART_BUTTONS.find(p => p.id === selectedPart);
      const message = `✅ Beautiful! You drew a ${partInfo?.label}! ${partInfo?.emoji}`;
      setInstruction(message);
      speak(message);

      // Redraw canvas
      const ctx = canvas.getContext('2d');
      if (ctx) {
        drawBaseCircle(ctx);
        drawCirclePart(ctx, selectedPart, updatedPoints);
      }
    } else {
      setInstruction(`👍 Good! Click ${requiredPoints - updatedPoints.length} more point(s)...`);
    }
  };

  const getRequiredPoints = (part: CirclePart): number => {
    switch (part) {
      case 'center':
      case 'circumference':
      case 'annulus':
        return 0; // Auto-draw
      case 'radius':
      case 'tangent':
      case 'point-of-tangency':
        return 1;
      case 'diameter':
      case 'chord':
      case 'secant':
      case 'arc':
      case 'sector':
      case 'segment':
      case 'semicircle':
      case 'sagitta':
        return 2;
      default:
        return 1;
    }
  };

  const validateDrawing = (part: CirclePart, points: { x: number; y: number }[]): { valid: boolean; message?: string } => {
    // Validation for semicircle - must pass through center (be a diameter)
    if (part === 'semicircle' && points.length === 2) {
      const p1 = points[0];
      const p2 = points[1];

      // Calculate distance from line (p1-p2) to center
      // Using formula: distance = |ax + by + c| / sqrt(a² + b²)
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;

      // Line equation: (y - y1) = m(x - x1)
      // Rearranged: dy*x - dx*y + (dx*y1 - dy*x1) = 0
      const a = dy;
      const b = -dx;
      const c = dx * p1.y - dy * p1.x;

      const distanceToCenter = Math.abs(a * centerX + b * centerY + c) / Math.sqrt(a * a + b * b);

      // Tolerance: line should pass within 15 pixels of center
      const tolerance = 15;

      if (distanceToCenter > tolerance) {
        return {
          valid: false,
          message: '❌ Not a semicircle! The line must pass through the center. Try selecting two opposite points.'
        };
      }

      // Also check if points are approximately opposite (angle ≈ 180°)
      const angle1 = Math.atan2(p1.y - centerY, p1.x - centerX);
      const angle2 = Math.atan2(p2.y - centerY, p2.x - centerX);
      let angleDiff = Math.abs(angle2 - angle1);
      if (angleDiff > Math.PI) angleDiff = 2 * Math.PI - angleDiff;

      const angleTolerance = 0.3; // ~17 degrees tolerance
      if (Math.abs(angleDiff - Math.PI) > angleTolerance) {
        return {
          valid: false,
          message: '❌ Not a semicircle! Points should be on opposite sides of the circle.'
        };
      }
    }

    // Validation for diameter - must pass through center
    if (part === 'diameter' && points.length === 2) {
      const p1 = points[0];
      const p2 = points[1];

      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;

      const a = dy;
      const b = -dx;
      const c = dx * p1.y - dy * p1.x;

      const distanceToCenter = Math.abs(a * centerX + b * centerY + c) / Math.sqrt(a * a + b * b);

      const tolerance = 15;

      if (distanceToCenter > tolerance) {
        return {
          valid: false,
          message: '❌ Not a diameter! The line must pass through the center.'
        };
      }
    }

    return { valid: true };
  };

  const handlePartSelect = (part: CirclePart) => {
    setSelectedPart(part);
    setDrawPoints([]);

    const partInfo = CIRCLE_PART_BUTTONS.find(p => p.id === part);
    const requiredPoints = getRequiredPoints(part);

    if (requiredPoints === 0) {
      // Auto-draw parts like center, circumference, annulus
      const canvas = canvasRef.current;
      if (!canvas) return;

      const action: DrawAction = {
        type: part,
        points: [],
        timestamp: Date.now(),
      };

      setHistory([...history, action]);
      setPartsDrawn(prev => prev + 1);

      const message = `✅ Beautiful! You drew a ${partInfo?.label}! ${partInfo?.emoji}`;
      setInstruction(message);
      speak(message);

      const ctx = canvas.getContext('2d');
      if (ctx) {
        drawBaseCircle(ctx);
      }
    } else {
      setInstruction(`👉 Step 2: Click ${requiredPoints} point(s) on the canvas to draw ${partInfo?.label}`);
    }
  };

  const handleClear = () => {
    setHistory([]);
    setPartsDrawn(0);
    setDrawPoints([]);
    setSelectedPart(null);
    setInstruction('👉 Step 1: Select a circle part from the buttons on the right →');

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      drawBaseCircle(ctx);
    }
  };

  const handleUndo = () => {
    if (history.length === 0) return;

    const newHistory = history.slice(0, -1);
    setHistory(newHistory);
    setPartsDrawn(prev => Math.max(0, prev - 1));

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      drawBaseCircle(ctx);
    }

    setInstruction('↩️ Undone! Continue drawing...');
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
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.button
            onClick={onBack}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all px-4 py-3 rounded-full shadow-lg flex items-center gap-2 text-white"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back</span>
          </motion.button>

          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
              🎯 Interactive Circle Playground
            </h1>
            <div className="flex items-center justify-center gap-4 mt-2">
              <span className="bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full text-white text-sm">
                🌟 {partsDrawn} parts drawn
              </span>
            </div>
          </div>

          <div className="w-32"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Mode Tabs */}
          <div className="flex gap-2 mb-6 justify-center">
            {(['guided', 'challenge', 'free'] as PlaygroundMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-6 py-3 rounded-xl font-bold transition-all ${
                  mode === m
                    ? 'bg-white text-purple-600 shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {m === 'guided' && '🎯 Guided'}
                {m === 'challenge' && '🎮 Challenge'}
                {m === 'free' && '✏️ Free Draw'}
              </button>
            ))}
          </div>

          <div className="grid lg:grid-cols-[1fr_auto] gap-6">
            {/* Canvas Area */}
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl">
              <canvas
                ref={canvasRef}
                width={canvasWidth}
                height={canvasHeight}
                onClick={handleCanvasClick}
                className="w-full rounded-xl shadow-inner cursor-crosshair border-4 border-gray-200"
                style={{ maxWidth: '600px', maxHeight: '600px', margin: '0 auto', display: 'block' }}
              />

              {/* Live Feedback */}
              <motion.div
                className="mt-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 text-center border-2 border-purple-200"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <p className="text-lg font-semibold text-purple-800">{instruction}</p>
              </motion.div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-4 justify-center">
                <motion.button
                  onClick={handleUndo}
                  disabled={history.length === 0}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Undo2 className="w-5 h-5" />
                  Undo
                </motion.button>
                <motion.button
                  onClick={handleClear}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-semibold shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  🗑️ Clear All
                </motion.button>
              </div>
            </div>

            {/* Button Panel */}
            <motion.div
              className={`bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border-4 ${
                selectedPart === null ? 'border-yellow-400' : 'border-transparent'
              }`}
              style={{ maxWidth: '600px' }}
              animate={selectedPart === null ? {
                borderColor: ['#FBBF24', '#F59E0B', '#FBBF24'],
                scale: [1, 1.02, 1]
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                {selectedPart === null ? '👇 Select Circle Part 👇' : 'Select Circle Part'}
              </h3>
              <div className="grid grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-2">
                {CIRCLE_PART_BUTTONS.map((btn) => (
                  <motion.button
                    key={btn.id}
                    onClick={() => handlePartSelect(btn.id)}
                    className={`p-4 rounded-xl text-left transition-all border-2 ${
                      selectedPart === btn.id
                        ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white border-purple-600 shadow-lg'
                        : 'bg-white text-gray-800 border-gray-200 hover:border-purple-300'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    title={btn.description}
                  >
                    <div className="text-3xl mb-1">{btn.emoji}</div>
                    <div className="font-semibold text-sm">{btn.label}</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
