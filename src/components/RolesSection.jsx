'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Stethoscope, Droplet, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { ROLES } from '@/config/app-config';
import Section from './common/Section';
import clsx from 'clsx';

const roles = [
  {
    icon: User,
    title: 'Patient',
    description: 'Access your medical records, schedule appointments, and manage prescriptions.',
    features: [
      'View medical history',
      'Book appointments',
      'Manage prescriptions',
      'Secure messaging',
      'Access test results'
    ],
    role: ROLES.PATIENT,
    color: 'var(--color-primary)',
    gradient: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
  },
  {
    icon: Stethoscope,
    title: 'Doctor',
    description: 'Manage patient records, appointments, and issue digital prescriptions.',
    features: [
      'Patient management',
      'Schedule appointments',
      'Issue prescriptions',
      'Medical records access',
      'Virtual consultations',
      'Treatment planning'
    ],
    role: ROLES.DOCTOR,
    color: 'var(--color-secondary)',
    gradient: 'linear-gradient(135deg, var(--color-secondary) 0%, var(--color-accent) 100%)',
  },
  {
    icon: Droplet,
    title: 'Pharmacist',
    description: 'Process digital prescriptions and manage medication dispensing.',
    features: [
      'Process prescriptions',
      'Inventory management',
      'Patient consultation',
      'Medication tracking',
      'Drug interactions check',
      'Prescription verification'
    ],
    role: ROLES.PHARMACIST,
    color: 'var(--color-accent)',
    gradient: 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-primary) 100%)',
  },
];

const cardVariants = {
  initial: { opacity: 0, y: 40, scale: 0.96 },
  animate: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: 0.10 * i,
      duration: 0.6,
      type: 'spring',
      stiffness: 80,
      damping: 18,
    },
  }),
};

const featureListVariants = {
  initial: {},
  animate: {},
};

const featureItemVariants = {
  initial: { opacity: 0, x: 24 },
  animate: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.2 + i * 0.08,
      duration: 0.4,
      type: 'spring',
      stiffness: 120,
      damping: 18,
    },
  }),
  hover: {
    scale: 1.04,
    backgroundColor: 'var(--color-primary-verylight, #f0f7ff)',
    transition: { type: 'spring', stiffness: 200, damping: 16 },
  },
};

const RoleCard = ({
  icon: Icon,
  title,
  description,
  features,
  role,
  color,
  gradient,
  index,
}) => {
  const router = useRouter();
  const [isHovered, setIsHovered] = React.useState(false);
  const [hoveredFeature, setHoveredFeature] = React.useState(null);

  const handleLogin = () => router.push(`/login?role=${role}`);
  const handleRegister = () => router.push(`/register?role=${role}`);

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: '-50px' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setHoveredFeature(null); }}
      tabIndex={0}
      aria-label={title}
      className={clsx(
        'group relative flex flex-col items-center justify-between rounded-2xl shadow-xl transition-all duration-200',
        'bg-white/90 dark:bg-[#1a2230]/90 backdrop-blur-lg border border-transparent',
        'hover:shadow-2xl focus-within:ring-2 focus-within:ring-primary outline-none',
        'p-7 sm:p-9 min-h-[480px] w-full max-w-md mx-auto'
      )}
      style={{
        borderImage: isHovered
          ? `${gradient} 1`
          : undefined,
        borderWidth: isHovered ? 2 : 1,
        boxShadow: isHovered
          ? `0 12px 40px 0 ${color}33, 0 2px 8px 0 ${color}11`
          : `0 2px 8px 0 ${color}11`,
        transition: 'box-shadow 0.2s, border-image 0.2s',
      }}
      whileHover={{
        scale: 1.04,
        y: -8,
        transition: { type: 'spring', stiffness: 180, damping: 18 },
      }}
    >
      {/* Animated gradient border overlay */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="pointer-events-none absolute inset-0 rounded-2xl z-10"
            style={{
              border: '2.5px solid transparent',
              borderImage: gradient + ' 1',
              boxSizing: 'border-box',
            }}
          />
        )}
      </AnimatePresence>
      {/* Icon */}
      <motion.div
        animate={isHovered ? { scale: 1.18, rotate: 8 } : { scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 18 }}
        className="relative flex items-center justify-center rounded-full"
        style={{
          width: 64,
          height: 64,
          background: gradient,
          boxShadow: isHovered
            ? `0 4px 24px 0 ${color}33`
            : `0 2px 8px 0 ${color}11`,
        }}
      >
        <Icon className="w-10 h-10 text-white drop-shadow" />
        {/* Animated ring */}
        <AnimatePresence>
          {isHovered && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.5, scale: 1.18 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(${color}, var(--color-secondary), ${color})`,
                filter: 'blur(8px)',
                zIndex: 1,
              }}
            />
          )}
        </AnimatePresence>
      </motion.div>
      <h3 className="mt-4 font-bold text-2xl text-foreground text-center">{title}</h3>
      {/* Description */}
      <p className="mb-4 text-muted-foreground text-base sm:text-lg leading-normal font-normal text-center z-20">
        {description}
      </p>
      {/* Features - always visible, with motion and bold on hover */}
      <motion.div
        className="mb-6 w-full flex flex-col gap-2 z-20"
        variants={featureListVariants}
        initial="initial"
        animate="animate"
      >
        {features.map((feature, i) => (
          <motion.div
            key={i}
            custom={i}
            variants={featureItemVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            whileTap="hover"
            onMouseEnter={() => setHoveredFeature(i)}
            onMouseLeave={() => setHoveredFeature(null)}
            className={clsx(
              'flex items-center gap-2 rounded-lg px-3 py-2 transition-colors duration-150 cursor-pointer',
              isHovered
                ? 'bg-primary/10 text-foreground'
                : 'bg-transparent text-muted-foreground'
            )}
            style={{
              willChange: 'transform, background-color',
            }}
          >
            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
            <span
              className={clsx(
                'text-sm transition-all duration-150',
                hoveredFeature === i ? 'font-bold' : 'font-medium'
              )}
            >
              {feature}
            </span>
          </motion.div>
        ))}
      </motion.div>
      {/* Actions */}
      <div className="mt-auto flex w-full gap-3 z-20">
        <Button
          className={clsx(
            "flex-1 px-0 py-2.5 text-base font-bold rounded-full shadow-md focus:outline-none focus:ring-2 border-none transition-all duration-200 select-none active:scale-95",
            "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white",
            "hover:from-[var(--color-primary-dark,theme(colors.primary.700))]",
            "hover:to-[var(--color-secondary-dark,theme(colors.secondary.700))]",
            "hover:text-white"
          )}
          style={{ color: "#fff" }}
          onClick={handleLogin}
        >
          Login
        </Button>
        <Button
          className="flex-1 px-0 py-2.5 text-base font-semibold rounded-full border-2 border-primary text-primary bg-transparent hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary shadow-md hover:shadow-lg"
          onClick={handleRegister}
        >
          Register
        </Button>
      </div>
    </motion.div>
  );
};

export default function RolesSection() {
  return (
    <Section
      id="roles"
      className="relative overflow-hidden bg-transparent py-16"
    >
      {/* Modern background pattern */}
      <div
        className="absolute inset-0 pointer-events-none select-none z-0"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 30% 70%, var(--color-success) 0%, transparent 80%), ' +
            'radial-gradient(ellipse 40% 30% at 80% 20%, var(--color-accent) 0%, transparent 80%)',
          opacity: 0.12,
        }}
      />
      <div className="flex flex-col items-center justify-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <p className="mb-2 font-semibold tracking-wider text-primary text-xs sm:text-sm uppercase">
            User Access
          </p>
          <h2 className="mb-4 font-extrabold text-4xl sm:text-5xl md:text-6xl leading-tight text-foreground">
            Choose Your Role
          </h2>
          <p className="text-muted-foreground text-lg text-center max-w-2xl mx-auto">
            Select your role to access features tailored for your specific healthcare needs.
          </p>
        </motion.div>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto px-2 sm:px-6">
          {roles.map((role, index) => (
            <RoleCard key={role.title} {...role} index={index} />
          ))}
        </div>
      </div>
    </Section>
  );
}