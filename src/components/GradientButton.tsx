/**
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 */

/**
 * Reusable Gradient Button Component
 * Handles gradient colors with proper hover states using inline styles
 */

import { useState, ReactNode } from 'react';
import { motion, MotionProps } from 'motion/react';
import type { TargetAndTransition, VariantLabels } from 'motion/react';

interface GradientButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof MotionProps> {
  children: ReactNode;
  fromColor: string;
  toColor: string;
  hoverFromColor?: string;
  hoverToColor?: string;
  direction?: 'to-r' | 'to-br' | 'to-b' | 'to-bl' | 'to-l' | 'to-tl' | 'to-t' | 'to-tr';
  textColor?: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  whileTap?: VariantLabels | TargetAndTransition;
  whileHover?: VariantLabels | TargetAndTransition;
}

export function GradientButton({
  children,
  fromColor,
  toColor,
  hoverFromColor,
  hoverToColor,
  direction = 'to-r',
  textColor = 'white',
  className = '',
  onClick,
  disabled = false,
  type = 'button',
  whileTap,
  whileHover,
  ...rest
}: GradientButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Convert direction to CSS gradient direction
  const getGradientDirection = () => {
    const directionMap: Record<string, string> = {
      'to-r': 'to right',
      'to-br': 'to bottom right',
      'to-b': 'to bottom',
      'to-bl': 'to bottom left',
      'to-l': 'to left',
      'to-tl': 'to top left',
      'to-t': 'to top',
      'to-tr': 'to top right',
    };
    return directionMap[direction] || 'to right';
  };

  const getButtonStyle = () => {
    const currentFromColor = isHovered && hoverFromColor ? hoverFromColor : fromColor;
    const currentToColor = isHovered && hoverToColor ? hoverToColor : toColor;

    return {
      background: `linear-gradient(${getGradientDirection()}, ${currentFromColor}, ${currentToColor})`,
      color: textColor,
    };
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={getButtonStyle()}
      whileTap={whileTap}
      whileHover={whileHover}
      className={`transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-transparent ${className}`}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
