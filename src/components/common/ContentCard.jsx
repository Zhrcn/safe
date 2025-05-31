'use client';

import React from 'react';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import { Info } from 'lucide-react';
import Card from '@/components/ui/Card';

/**
 * Enhanced ContentCard component for displaying content in a card layout
 * 
 * @param {Object} props
 * @param {string} props.title - The card title
 * @param {string} props.subtitle - The card subtitle
 * @param {React.ReactNode} props.icon - Icon to display next to the title
 * @param {React.ReactNode} props.actions - Actions to display in the header
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.className - Additional class names
 * @param {boolean} props.hoverable - Whether the card should have hover effects
 * @param {Function} props.onClick - Click handler for the entire card
 * @param {string} props.infoTooltip - Info tooltip text
 * @param {boolean} props.noPadding - Whether to remove padding from the content area
 * @param {string} props.variant - Card variant: 'default', 'outlined', or 'elevated'
 * @param {boolean} props.bordered - Whether to add a border to the card
 */
export default function ContentCard({ 
  title, 
  subtitle, 
  icon, 
  actions,
  children,
  className = '',
  hoverable = false,
  onClick,
  infoTooltip,
  noPadding = false,
  variant = 'default',
  bordered = false
}) {
  return (
    <Card
      title={title}
      subtitle={subtitle}
      icon={icon && (
        <Box className="flex items-center">
          {icon}
          {infoTooltip && (
            <Tooltip title={infoTooltip} arrow>
              <IconButton size="small" className="ml-1 text-muted-foreground">
                <Info size={16} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      )}
      actions={actions}
      className={className}
      hoverable={hoverable}
      onClick={onClick}
      noPadding={noPadding}
      variant={variant}
      bordered={bordered}
    >
      {children}
    </Card>
  );
} 