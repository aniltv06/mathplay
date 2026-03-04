/**
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

import { motion, AnimatePresence } from 'motion/react';
import { type CirclePart } from '../../utils/circleData';

interface Props {
  currentPart: CirclePart;
}

export function CircleVisualization({ currentPart }: Props) {
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
}
