import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, Label, Sector } from 'recharts';
import { useCalculator } from '../../contexts/CalculatorContext';
import { formatCurrency } from '../../utils/formatters';

// Premium color palette with gradient definitions and professional color theory
const GRADIENT_COLORS = {
  primary: ['#4338CA', '#6366F1'],   // Deep Indigo to vibrant Indigo
  secondary: ['#0369A1', '#0EA5E9'], // Deep Blue to Sky Blue
  tertiary: ['#BE185D', '#EC4899'],  // Deep Pink to Bright Pink
  quaternary: ['#065F46', '#10B981'], // Deep Emerald to Teal
  success: ['#166534', '#22C55E'],    // Deep Green to Vibrant Green
  info: ['#1E40AF', '#3B82F6'],       // Deep Blue to Royal Blue
  warning: ['#B45309', '#F59E0B'],    // Brown to Amber
  danger: ['#991B1B', '#EF4444'],     // Deep Red to Vibrant Red
};

// Rich color palette with beautiful gradient stops for professional visualizations
const COLOR_SCHEMES = [
  { main: '#4338CA', light: '#818CF8', dark: '#3730A3', name: 'indigo' },     // Base Salary
  { main: '#0EA5E9', light: '#38BDF8', dark: '#0369A1', name: 'blue' },       // Sector Fees
  { main: '#EC4899', light: '#F472B6', dark: '#BE185D', name: 'pink' },       // Layover Fees
  { main: '#10B981', light: '#34D399', dark: '#065F46', name: 'emerald' },    // Performance Bonuses
  { main: '#F59E0B', light: '#FBBF24', dark: '#B45309', name: 'amber' },      // Allowances
  { main: '#8B5CF6', light: '#A78BFA', dark: '#6D28D9', name: 'purple' },     // Training Pay
  { main: '#EF4444', light: '#F87171', dark: '#B91C1C', name: 'red' },        // Holiday Pay
  { main: '#14B8A6', light: '#2DD4BF', dark: '#0F766E', name: 'teal' },       // Other Components
];

// Colors for different themes
const LIGHT_MODE_COLORS = COLOR_SCHEMES.map(c => c.main);
const DARK_MODE_COLORS = COLOR_SCHEMES.map(c => c.light);
const HOVER_COLORS = COLOR_SCHEMES.map(c => c.dark);

interface DataItem {
  name: string;
  value: number;
  percent?: string;
  formattedValue?: string;
  color?: string;
  colorScheme?: typeof COLOR_SCHEMES[number];
}

const SalaryPieChart = () => {
  const { results } = useCalculator();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Check for dark mode
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
    
    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isDark = document.documentElement.classList.contains('dark');
          setIsDarkMode(isDark);
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);
  
  if (!results) return null;
  
  // Format data for pie chart with enhanced metadata
  const data: DataItem[] = [
    { name: 'Base Salary', value: results.baseSalary, colorScheme: COLOR_SCHEMES[0] },
    { name: 'Sector Fees', value: results.sectorFees, colorScheme: COLOR_SCHEMES[1] },
    { name: 'Layover Fees', value: results.layoverFees, colorScheme: COLOR_SCHEMES[2] },
  ];
  
  // Calculate percentage for each slice and enrich data
  const total = data.reduce((acc, item) => acc + item.value, 0);
  const dataWithPercent = data.map((item, index) => ({
    ...item,
    percent: ((item.value / total) * 100).toFixed(1),
    formattedValue: formatCurrency(item.value, 'TRY'),
    color: isDarkMode ? DARK_MODE_COLORS[index % DARK_MODE_COLORS.length] : LIGHT_MODE_COLORS[index % LIGHT_MODE_COLORS.length]
  }));
  
  // Memoize event handlers to optimize performance
  const onPieEnter = useCallback((_: any, index: number) => {
    setActiveIndex(index);
  }, []);
  
  const onPieLeave = useCallback(() => {
    setActiveIndex(null);
  }, []);
  
  // State to track if we're on the client (to avoid document access during SSR)
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Create active sector shape with premium design - Simplified and safer version
  const renderActiveShape = useCallback((props: any) => {
    try {
      const RADIAN = Math.PI / 180;
      const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, payload } = props;
      
      if (!payload || !cx || !cy) return null;
      
      const sin = Math.sin(-RADIAN * midAngle);
      const cos = Math.cos(-RADIAN * midAngle);
      const sx = cx + (outerRadius + 10) * cos;
      const sy = cy + (outerRadius + 10) * sin;
      const mx = cx + (outerRadius + 30) * cos;
      const my = cy + (outerRadius + 30) * sin;
      const ex = mx + (cos >= 0 ? 1 : -1) * 22;
      const ey = my;
      const textAnchor = cos >= 0 ? 'start' : 'end';
      
      // Get the color scheme for this segment - with safety check
      const safeIndex = Math.max(0, Math.min(props.index || 0, COLOR_SCHEMES.length - 1));
      const colorScheme = COLOR_SCHEMES[safeIndex];
      const segmentColor = isDarkMode ? colorScheme.light : colorScheme.main;
      const textColor = isDarkMode ? '#E5E7EB' : '#374151';
      const valueColor = isDarkMode ? '#9CA3AF' : '#6B7280';
      
      return (
        <g>
          {/* Active sector with increased radius */}
          <Sector
            cx={cx}
            cy={cy}
            innerRadius={innerRadius}
            outerRadius={outerRadius + 5}
            startAngle={startAngle}
            endAngle={endAngle}
            fill={segmentColor}
            opacity={0.9}
          />
          
          {/* Label connector line - simplified */}
          <path
            d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
            stroke={segmentColor}
            strokeWidth={1.5}
            fill="none"
            strokeLinecap="round"
          />
          
          {/* Connector dot */}
          <circle cx={ex} cy={ey} r={2} fill={segmentColor} />
          
          {/* Label text */}
          <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill={textColor} fontSize={13} fontWeight="500">
          
            {payload.name}
          </text>
          {payload.formattedValue && payload.percent && (
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill={valueColor} fontSize={12}>
              {`${payload.formattedValue} (${payload.percent}%)`}
            </text>
          )}
        </g>
      );
    } catch (error) {
      console.error('Error rendering active shape:', error);
      return null;
    }
  }, [isDarkMode]);

  // Helper function to convert hex to RGB for background transparency
  const hexToRgb = (hex: string) => {
    try {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
        : '0, 0, 0';
    } catch (error) {
      console.error('Error converting hex to RGB:', error);
      return '0, 0, 0';
    }
  };

  // Enhanced custom tooltip with animations and improved styling
  const CustomTooltip = useCallback(({ active, payload }: any) => {
    if (active && payload && payload.length) {
      try {
        const data = payload[0].payload;
        const safeIndex = Math.max(0, Math.min(payload[0].dataIndex || 0, COLOR_SCHEMES.length - 1));
        const colorScheme = COLOR_SCHEMES[safeIndex];
        const borderColor = isDarkMode ? colorScheme.light : colorScheme.main;
        
        return (
          <AnimatePresence>
            <motion.div 
              className="bg-white dark:bg-gray-800 p-4 shadow-xl rounded-lg border-2 dark:border-opacity-50"
              style={{ borderColor }}
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              transition={{ duration: 0.2, type: 'spring', stiffness: 300 }}
            >
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">{data.name}</p>
              <p className="text-xl font-bold text-gray-800 dark:text-white">{data.formattedValue}</p>
              <div className="flex items-center mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <div 
                  className="w-4 h-4 rounded-full mr-2" 
                  style={{ backgroundColor: data.color }}
                />
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  {data.percent}% of Total Salary
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        );
      } catch (error) {
        console.error('Error rendering tooltip:', error);
        return null;
      }
    }
    return null;
  }, [isDarkMode]);
  
  // Custom legend with premium styling and interaction effects - with better error handling
  const CustomLegend = useCallback(({ payload }: any) => {
    if (!payload || !Array.isArray(payload)) return null;
    
    return (
      <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 px-2">
        {payload.map((entry: any, index: number) => {
          if (!entry) return null;
          
          try {
            const isActive = activeIndex === index;
            const safeIndex = Math.min(index, COLOR_SCHEMES.length - 1);
            const colorScheme = COLOR_SCHEMES[safeIndex];
            
            // Safer background color handling with fallback
            let bgColor = isDarkMode ? 'rgba(31, 41, 55, 0.4)' : 'rgba(243, 244, 246, 0.7)';
            if (isActive) {
              try {
                const rgbString = hexToRgb(isDarkMode ? colorScheme.light : colorScheme.main);
                bgColor = isDarkMode 
                  ? `rgba(${rgbString}, 0.2)` 
                  : `rgba(${rgbString}, 0.1)`;
              } catch (e) {
                // Already using fallback
              }
            }
            
            return (
              <li 
                key={`legend-${index}`}
                className="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-opacity-80"
                style={{ backgroundColor: bgColor }}
                onClick={() => setActiveIndex(isActive ? null : index)}
                onMouseEnter={() => !isActive && setActiveIndex(index)}
                onMouseLeave={() => !isActive && setActiveIndex(null)}
              >
                <div className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded-full mr-3" 
                    style={{ backgroundColor: isDarkMode ? colorScheme.light : colorScheme.main }}
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{entry.value}</span>
                </div>
                {payload[index]?.payload?.percent && (
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {payload[index].payload.percent}%
                  </span>
                )}
              </li>
            );
          } catch (error) {
            console.error('Error rendering legend item:', error);
            return null;
          }
        })}
      </ul>
    );
  }, [activeIndex, isDarkMode]);
  
  // Premium chart rendering with enhanced visuals and animations
  const Chart = useMemo(() => {
    if (!isClient) return null;
    
    return (
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          {/* Define gradient patterns */}
          <defs>
            {COLOR_SCHEMES.map((scheme, index) => (
              <React.Fragment key={`gradient-${index}`}>
                <linearGradient id={`pieGradient${index}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={scheme.light} stopOpacity={0.9} />
                  <stop offset="100%" stopColor={scheme.main} stopOpacity={0.9} />
                </linearGradient>
                <filter id={`shadow${index}`} height="200%">
                  <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor={scheme.dark} floodOpacity="0.3" />
                </filter>
              </React.Fragment>
            ))}
          </defs>
          
          {/* Main pie chart with enhanced styling */}
          <Pie
            data={dataWithPercent}
            cx="50%"
            cy="50%"
            labelLine={false}
            innerRadius={60}
            outerRadius={90}
            paddingAngle={5}
            cornerRadius={3}
            dataKey="value"
            animationDuration={1000}
            animationBegin={100}
            onMouseEnter={onPieEnter}
            onMouseLeave={onPieLeave}
            activeIndex={activeIndex !== null && activeIndex >= 0 ? [activeIndex] : undefined}
            activeShape={(props) => {
              try {
                // Type-safe wrapper for the renderActiveShape function
                const elem = renderActiveShape(props);
                return elem !== null ? elem : <g />;
              } catch (error) {
                console.error('Error in activeShape wrapper:', error);
                return <g />; // Return empty group on error
              }
            }}
            isAnimationActive={true}
          >
            {dataWithPercent.map((entry, index) => {
              // Determine fill based on mode and state
              const fillId = `url(#pieGradient${index})`;
              const fillColor = entry.color;
              const isActive = activeIndex === index;
              
              return (
                <Cell 
                  key={`cell-${index}`} 
                  fill={isActive ? fillId : fillColor}
                  stroke={isDarkMode ? "#1f2937" : "#ffffff"}
                  strokeWidth={isActive ? 2 : 1}
                  filter={isActive ? `url(#shadow${index})` : undefined}
                />
              );
            })}
            
            {/* Animated center label */}
            <Label
              position="center"
              content={({ viewBox }) => {
                const { cx, cy } = viewBox as { cx: number; cy: number };
                const textColor = isDarkMode ? "#e5e7eb" : "#374151";
                const subTextColor = isDarkMode ? "#9ca3af" : "#6b7280";
                
                return (
                  <g>
                    {/* Light subtle circlar background */}
                    <circle 
                      cx={cx} 
                      cy={cy} 
                      r={53} 
                      fill={isDarkMode ? "rgba(31, 41, 55, 0.7)" : "rgba(255, 255, 255, 0.9)"} 
                      stroke={isDarkMode ? "#374151" : "#e5e7eb"}
                      strokeWidth={1}
                    />
                    
                    <text x={cx} y={cy-15} textAnchor="middle" fill={textColor} fontSize={14} fontWeight="500">
                      Total Salary
                    </text>
                    <text x={cx} y={cy+15} textAnchor="middle" fill={textColor} fontSize={18} fontWeight="bold">
                      {formatCurrency(total, 'TRY')}
                    </text>
                  </g>
                );
              }}
            />
          </Pie>
          
          {/* Enhanced tooltip */}
          <Tooltip 
            content={<CustomTooltip />}
            wrapperStyle={{ outline: 'none' }}
            isAnimationActive={true}
          />
          
          {/* Interactive custom legend */}
          <Legend 
            content={<CustomLegend />}
            verticalAlign="bottom"
            height={60}
          />
        </PieChart>
      </ResponsiveContainer>
    );
  }, [dataWithPercent, activeIndex, isDarkMode, isClient, onPieEnter, onPieLeave, renderActiveShape, CustomTooltip, CustomLegend, total]);
  
  // Safely handle rendering with better error recovery
  try {
    return (
      <motion.div 
        className="h-[420px] w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, type: 'spring', stiffness: 100 }}
      >
        <div className="h-full w-full relative">
          {/* Header with animated counter */}
          <motion.div 
            className="mb-4 pb-2 border-b border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Salary Breakdown</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Visualization of your monthly salary components</p>
          </motion.div>
          
          {/* Chart container with subtle background pattern */}
          <div className="h-[90%] w-full">
            {isClient ? Chart : (
              <div className="h-full w-full flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 mb-4"></div>
                  <div className="w-36 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  } catch (error) {
    console.error('Error rendering SalaryPieChart:', error);
    return (
      <div className="h-[400px] w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-lg font-medium text-gray-800 dark:text-gray-200">Chart Error</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Unable to render salary breakdown</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
        >
          Reload Chart
        </button>
      </div>
    );
  }
};

export default SalaryPieChart;
