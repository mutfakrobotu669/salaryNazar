import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  delay?: number;
  formatValue?: (value: number) => string;
  className?: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 1.5,
  delay = 0,
  formatValue = (val) => val.toFixed(0),
  className = '',
}) => {
  const motionValue = useMotionValue(0);
  const [displayValue, setDisplayValue] = useState('0');
  
  // Use spring animation for smooth, natural feeling count-up
  const springValue = useSpring(motionValue, {
    stiffness: 50,
    damping: 15,
    duration,
  });
  
  useEffect(() => {
    // Only animate after a delay
    const timer = setTimeout(() => {
      motionValue.set(value);
    }, delay * 1000);
    
    return () => clearTimeout(timer);
  }, [motionValue, value, delay]);
  
  useEffect(() => {
    // Update the displayed value as the motion value changes
    const unsubscribe = springValue.onChange((latest) => {
      setDisplayValue(formatValue(latest));
    });
    
    return unsubscribe;
  }, [springValue, formatValue]);
  
  return (
    <motion.span 
      className={className}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
    >
      {displayValue}
    </motion.span>
  );
};

export default AnimatedCounter;
