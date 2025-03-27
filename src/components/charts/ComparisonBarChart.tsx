import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { useCalculator } from '../../contexts/CalculatorContext';

const ComparisonBarChart = () => {
  const { results, comparisonResults, airline } = useCalculator();
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!results || !comparisonResults) return null;
  
  const currentAirline = airline === 'yellow' ? 'Yellow Tail' : 'Blue Tail';
  const otherAirline = airline === 'yellow' ? 'Blue Tail' : 'Yellow Tail';
  
  // Format data for bar chart
  const data = [
    {
      name: 'Base Salary',
      [currentAirline]: results.baseSalary,
      [otherAirline]: comparisonResults.baseSalary,
    },
    {
      name: 'Sector Fees',
      [currentAirline]: results.sectorFees,
      [otherAirline]: comparisonResults.sectorFees,
    },
    {
      name: 'Layover Fees',
      [currentAirline]: results.layoverFees,
      [otherAirline]: comparisonResults.layoverFees,
    },
    {
      name: 'Total',
      [currentAirline]: results.grandTotal,
      [otherAirline]: comparisonResults.grandTotal,
    },
  ];
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <p className="font-medium text-gray-700 dark:text-gray-300">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`entry-${index}`} className="text-sm" style={{ color: entry.color }}>
              <span className="font-medium">{entry.name}: </span>
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'TRY',
                maximumFractionDigits: 0
              }).format(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  try {
    return (
      <motion.div 
        className="h-80 w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        {isClient ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis 
                tickFormatter={(value) => 
                  new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'TRY',
                    notation: 'compact',
                    maximumFractionDigits: 0
                  }).format(value)
                } 
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                dataKey={currentAirline} 
                fill="#3B82F6" 
                animationDuration={1500} 
                animationBegin={300}
              />
              <Bar 
                dataKey={otherAirline} 
                fill="#F59E0B" 
                animationDuration={1500} 
                animationBegin={600}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">Loading comparison chart...</p>
          </div>
        )}
      </motion.div>
    );
  } catch (error) {
    console.error('Error rendering ComparisonBarChart:', error);
    return (
      <div className="h-80 w-full flex items-center justify-center">
        <p className="text-red-500">Error rendering comparison chart</p>
      </div>
    );
  }
};

export default ComparisonBarChart;
