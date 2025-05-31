'use client';

import React from 'react';
import { Button as MuiButton, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

// Define styled MUI Button with enhanced variants
const StyledButton = styled(MuiButton)(({ theme, variant, color, size }) => ({
  borderRadius: '0.5rem',
  textTransform: 'none',
  fontWeight: 500,
  boxShadow: variant === 'contained' ? theme.shadows[1] : 'none',
  transition: 'all 0.2s ease-in-out',
  
  '&:hover': {
    boxShadow: variant === 'contained' ? theme.shadows[2] : 'none',
    transform: 'translateY(-1px)',
  },
  
  ...(variant === 'soft' && {
    backgroundColor: color === 'primary' 
      ? theme.palette.primary.light 
      : color === 'secondary'
        ? theme.palette.secondary.light
        : color === 'error'
          ? theme.palette.error.light
          : color === 'warning'
            ? theme.palette.warning.light
            : color === 'info'
              ? theme.palette.info.light
              : color === 'success'
                ? theme.palette.success.light
                : theme.palette.grey[200],
    color: color === 'primary' 
      ? theme.palette.primary.main 
      : color === 'secondary'
        ? theme.palette.secondary.main
        : color === 'error'
          ? theme.palette.error.main
          : color === 'warning'
            ? theme.palette.warning.main
            : color === 'info'
              ? theme.palette.info.main
              : color === 'success'
                ? theme.palette.success.main
                : theme.palette.grey[800],
    '&:hover': {
      backgroundColor: color === 'primary' 
        ? theme.palette.primary.light 
        : color === 'secondary'
          ? theme.palette.secondary.light
          : color === 'error'
            ? theme.palette.error.light
            : color === 'warning'
              ? theme.palette.warning.light
              : color === 'info'
                ? theme.palette.info.light
                : color === 'success'
                  ? theme.palette.success.light
                  : theme.palette.grey[300],
    },
  }),
  
  ...(size === 'xs' && {
    padding: '0.25rem 0.5rem',
    fontSize: '0.75rem',
  }),
}));

/**
 * Enhanced Button component with additional variants and loading state
 * 
 * @param {Object} props - Component props
 * @param {string} [props.variant='contained'] - Button variant: 'contained', 'outlined', 'text', or 'soft'
 * @param {string} [props.color='primary'] - Button color
 * @param {string} [props.size='medium'] - Button size: 'small', 'medium', 'large', or 'xs'
 * @param {boolean} [props.fullWidth=false] - Whether the button should take full width
 * @param {boolean} [props.loading=false] - Whether to show loading spinner
 * @param {boolean} [props.disabled=false] - Whether the button is disabled
 * @param {React.ReactNode} props.children - Button content
 * @param {Function} [props.onClick] - Click handler
 * @param {string} [props.className] - Additional CSS classes
 * @param {string} [props.type='button'] - Button type
 */
export default function Button({
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  fullWidth = false,
  loading = false,
  disabled = false,
  children,
  onClick,
  className = '',
  type = 'button',
  ...rest
}) {
  // Map our custom variant 'soft' to MUI's 'contained' but with custom styling
  const muiVariant = variant === 'soft' ? 'contained' : variant;
  
  return (
    <StyledButton
      variant={muiVariant}
      color={color}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${className} ${loading ? 'opacity-80' : ''}`}
      type={type}
      disableElevation={variant === 'soft'}
      {...rest}
    >
      {loading && (
        <CircularProgress
          size={size === 'small' ? 16 : size === 'xs' ? 14 : 20}
          color="inherit"
          className="mr-2"
        />
      )}
      {children}
    </StyledButton>
  );
} 