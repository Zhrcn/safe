import React from 'react';
import { motion } from 'framer-motion';

export default function Section({
  children,
  className = '',
  id,
  as = 'section',
  ...props
}) {
  const Tag = as;
  return (
    <Tag
      id={id}
      className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className || ''} bg-transparent shadow-none border-none`}
      {...props}
    >
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true, margin: '-80px' }}
        className="w-full"
      >
        <div>{children}</div>
      </motion.div>
    </Tag>
  );
} 