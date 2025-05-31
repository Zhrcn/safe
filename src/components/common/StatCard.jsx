'use client';

import React from 'react';
import { Box, Typography, Skeleton } from '@mui/material';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import Card from '@/components/ui/Card';

/**
 * Enhanced StatCard component for displaying statistics and metrics
 * 
 * @param {Object} props
 * @param {string} props.title - The stat title
 * @param {string|number} props.value - The stat value
 * @param {React.ReactNode} props.icon - Icon to display
 * @param {string} props.trend - Trend direction: 'up', 'down', 'neutral', or null
 * @param {string} props.trendLabel - Custom trend label
 * @param {string} props.description - Additional description
 * @param {boolean} props.loading - Whether the card is in loading state
 * @param {string} props.className - Additional class names
 * @param {string} props.iconColor - Background color class for the icon
 */
export default function StatCard({ 
  title, 
  value, 
  icon,
  trend = null,
  trendLabel,
  description,
  loading = false,
  className = '',
  iconColor = 'bg-primary/10'
}) {
  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp size={16} className="text-green-500" />;
    if (trend === 'down') return <TrendingDown size={16} className="text-red-500" />;
    if (trend === 'neutral') return <Minus size={16} className="text-yellow-500" />;
    return null;
  };
  
  const getTrendTextColor = () => {
    if (trend === 'up') return 'text-green-500';
    if (trend === 'down') return 'text-red-500';
    if (trend === 'neutral') return 'text-yellow-500';
    return '';
  };
  
  const generateTrendLabel = () => {
    if (trendLabel) return trendLabel;
    if (trend === 'up') return 'Increased';
    if (trend === 'down') return 'Decreased';
    if (trend === 'neutral') return 'Stable';
    return '';
  };
  
  return (
    <Card 
      variant="elevated"
      className={`h-full ${className}`}
      hoverable
    >
      <Box className="flex justify-between items-start">
        <Box>
          {loading ? (
            <>
              <Skeleton width={80} height={20} />
              <Skeleton width={60} height={36} className="my-1" />
              {trend && <Skeleton width={100} height={20} />}
              {description && <Skeleton width={120} height={20} />}
            </>
          ) : (
            <>
              <Typography variant="body2" color="text.secondary" className="font-medium">
                {title}
              </Typography>
              <Typography variant="h4" className="font-bold my-1">
                {value}
              </Typography>
              
              {trend && (
                <Box className="flex items-center">
                  {getTrendIcon()}
                  <Typography
                    variant="body2"
                    className={`ml-1 ${getTrendTextColor()}`}
                  >
                    {generateTrendLabel()}
                  </Typography>
                </Box>
              )}
              
              {description && (
                <Typography variant="body2" color="text.secondary" className="mt-1">
                  {description}
                </Typography>
              )}
            </>
          )}
        </Box>
        
        {icon && (
          <Box className={`rounded-full p-3 ${iconColor}`}>
            {icon}
          </Box>
        )}
      </Box>
    </Card>
  );
} 