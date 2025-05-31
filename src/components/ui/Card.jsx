'use client';

import React from 'react';
import { Paper, Box, Typography, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';

// Styled Paper component for enhanced card appearance
const StyledCard = styled(Paper, {
  shouldForwardProp: (prop) => !['noPadding', 'bordered', 'hoverable'].includes(prop)
})(({ theme, variant, noPadding, bordered, hoverable }) => ({
  borderRadius: '0.75rem',
  transition: 'all 0.2s ease-in-out',
  padding: noPadding ? 0 : '1.5rem',
  border: bordered ? `1px solid ${theme.palette.divider}` : 'none',
  backgroundColor: variant === 'outlined' ? 'transparent' : theme.palette.background.paper,
  boxShadow: variant === 'outlined' 
    ? 'none' 
    : variant === 'elevated' 
      ? theme.shadows[2]
      : theme.shadows[1],
  
  ...(hoverable && {
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: theme.shadows[4],
    },
  }),
}));

/**
 * Enhanced Card component with various styles and variants
 * 
 * @param {Object} props - Component props
 * @param {string} [props.variant='default'] - Card variant: 'default', 'outlined', or 'elevated'
 * @param {boolean} [props.noPadding=false] - Whether to remove padding
 * @param {boolean} [props.bordered=false] - Whether to add a border
 * @param {boolean} [props.hoverable=false] - Whether to add hover effects
 * @param {string} [props.className=''] - Additional CSS classes
 * @param {React.ReactNode} props.children - Card content
 * @param {string} [props.title] - Card title
 * @param {string} [props.subtitle] - Card subtitle
 * @param {React.ReactNode} [props.icon] - Icon to display next to the title
 * @param {React.ReactNode} [props.actions] - Actions to display in the header
 * @param {React.ReactNode} [props.footer] - Footer content
 * @param {Function} [props.onClick] - Click handler
 */
export default function Card({
  variant = 'default',
  noPadding = false,
  bordered = false,
  hoverable = false,
  className = '',
  children,
  title,
  subtitle,
  icon,
  actions,
  footer,
  onClick,
  ...rest
}) {
  const hasHeader = title || subtitle || icon || actions;
  const hasFooter = footer;
  const isClickable = !!onClick;
  
  return (
    <StyledCard
      variant={variant}
      noPadding={noPadding || (hasHeader && !title && !subtitle && !icon)}
      bordered={bordered}
      hoverable={hoverable || isClickable}
      className={`${className} ${isClickable ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      {...rest}
    >
      {hasHeader && (
        <>
          <Box 
            className="flex items-center justify-between"
            sx={{ 
              p: noPadding ? 2 : 0,
              pb: noPadding ? 1.5 : 1,
            }}
          >
            <Box className="flex items-center">
              {icon && (
                <Box className="mr-3 text-primary">
                  {icon}
                </Box>
              )}
              <Box>
                {title && (
                  <Typography variant="h6" className="font-medium text-lg">
                    {title}
                  </Typography>
                )}
                {subtitle && (
                  <Typography variant="body2" color="text.secondary">
                    {subtitle}
                  </Typography>
                )}
              </Box>
            </Box>
            {actions && (
              <Box>
                {actions}
              </Box>
            )}
          </Box>
          {!noPadding && <Divider className="mb-4" />}
        </>
      )}
      
      <Box sx={{ p: hasHeader && noPadding ? 2 : 0 }}>
        {children}
      </Box>
      
      {hasFooter && (
        <>
          {!noPadding && <Divider className="mt-4" />}
          <Box 
            className="flex items-center justify-between"
            sx={{ 
              p: noPadding ? 2 : 0,
              pt: noPadding ? 1.5 : 1.5,
            }}
          >
            {footer}
          </Box>
        </>
      )}
    </StyledCard>
  );
} 