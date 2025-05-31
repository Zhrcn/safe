'use client';

import React from 'react';
import { Chip, Tooltip } from '@mui/material';
import {
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
  HelpCircle,
  CircleSlash,
  CircleDashed
} from 'lucide-react';

/**
 * StatusBadge component for displaying status indicators with consistent styling
 * 
 * @param {Object} props
 * @param {string} props.status - The status value to display
 * @param {Object} props.statusMap - Custom mapping of status values to configurations
 * @param {string} props.size - Size of the badge: 'small', 'medium'
 * @param {boolean} props.showIcon - Whether to show the status icon
 * @param {string} props.className - Additional class names
 * @param {string} props.variant - Chip variant: 'filled', 'outlined'
 * @param {string} props.tooltipText - Optional tooltip text
 */
export default function StatusBadge({
  status,
  statusMap = {},
  size = 'small',
  showIcon = true,
  className = '',
  variant = 'filled',
  tooltipText = '',
}) {
  // Default status configurations
  const defaultStatusMap = {
    active: { color: 'success', icon: <CheckCircle size={14} />, label: 'Active' },
    inactive: { color: 'default', icon: <CircleSlash size={14} />, label: 'Inactive' },
    pending: { color: 'warning', icon: <Clock size={14} />, label: 'Pending' },
    warning: { color: 'warning', icon: <AlertCircle size={14} />, label: 'Warning' },
    error: { color: 'error', icon: <XCircle size={14} />, label: 'Error' },
    completed: { color: 'success', icon: <CheckCircle size={14} />, label: 'Completed' },
    cancelled: { color: 'error', icon: <CircleSlash size={14} />, label: 'Cancelled' },
    scheduled: { color: 'info', icon: <Clock size={14} />, label: 'Scheduled' },
    confirmed: { color: 'success', icon: <CheckCircle size={14} />, label: 'Confirmed' },
    rejected: { color: 'error', icon: <XCircle size={14} />, label: 'Rejected' },
    processing: { color: 'info', icon: <CircleDashed size={14} />, label: 'Processing' },
    unknown: { color: 'default', icon: <HelpCircle size={14} />, label: 'Unknown' },
  };

  // Merge default and custom status maps
  const mergedStatusMap = { ...defaultStatusMap, ...statusMap };

  // Normalize status key
  const normalizedStatus = status?.toLowerCase() || 'unknown';

  // Get status config or fallback to unknown
  const statusConfig = mergedStatusMap[normalizedStatus] || mergedStatusMap.unknown;

  // Determine the label to display
  const displayLabel = statusConfig.label || status;

  // Create the chip element
  const chipElement = (
    <Chip
      label={displayLabel}
      color={statusConfig.color}
      size={size}
      variant={variant}
      icon={showIcon ? statusConfig.icon : undefined}
      className={`font-medium ${className}`}
    />
  );

  // Wrap with tooltip if tooltip text is provided
  if (tooltipText) {
    return (
      <Tooltip title={tooltipText} arrow>
        {chipElement}
      </Tooltip>
    );
  }

  return chipElement;
} 