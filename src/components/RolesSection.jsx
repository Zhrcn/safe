'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Stethoscope, Droplet, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ROLES } from '@/config/app-config';

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
      'Track health metrics',
      'Access test results'
    ],
    role: ROLES.PATIENT,
    color: 'hsl(var(--primary))',
    bgGradient: 'linear-gradient(135deg, hsl(var(--primary)/0.1) 0%, hsl(var(--primary)/0.2) 100%)',
    darkBgGradient: 'linear-gradient(135deg, hsl(var(--primary)/0.2) 0%, hsl(var(--primary)/0.3) 100%)',
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
    color: 'hsl(var(--secondary))',
    bgGradient: 'linear-gradient(135deg, hsl(var(--secondary)/0.1) 0%, hsl(var(--secondary)/0.2) 100%)',
    darkBgGradient: 'linear-gradient(135deg, hsl(var(--secondary)/0.2) 0%, hsl(var(--secondary)/0.3) 100%)',
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
    color: 'hsl(var(--success))',
    bgGradient: 'linear-gradient(135deg, hsl(var(--success)/0.1) 0%, hsl(var(--success)/0.2) 100%)',
    darkBgGradient: 'linear-gradient(135deg, hsl(var(--success)/0.2) 0%, hsl(var(--success)/0.3) 100%)',
  },
];

const RoleCard = ({ icon: Icon, title, description, features, role, color, bgGradient, darkBgGradient, index }) => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const handleLogin = () => {
    router.push(`/login?role=${role}`);
  };
  const handleRegister = () => {
    router.push(`/register?role=${role}`);
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: '-50px' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -6, scale: 1.03, boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)' }}
      className="h-full group"
      tabIndex={0}
      aria-label={title}
    >
      <div className="h-full overflow-hidden rounded-3xl transition-all duration-300 ease-in-out shadow-md group-hover:shadow-2xl bg-card min-h-[520px] focus-within:ring-2 focus-within:ring-primary outline-none flex flex-col">
        <div
          className="relative h-44 sm:h-52 overflow-hidden rounded-t-3xl transition-all duration-300"
          style={{
            background: `var(--dark) ? ${darkBgGradient} : ${bgGradient}`,
          }}
        >
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundSize: '20px 20px',
              backgroundImage: `radial-gradient(${color} 1px, transparent 1px)`,
            }}
          />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:rotate-3 group-hover:scale-90 transition-all duration-300">
            <div
              className={`flex items-center justify-center rounded-full p-5 shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[360deg]`}
              style={{
                backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                width: '100px',
                height: '100px',
              }}
            >
              <Icon className="w-14 h-14" style={{ color }} />
            </div>
          </div>
        </div>
        <div className="p-7 flex flex-col h-full">
          <h3
            className="mb-3 text-center font-bold text-xl sm:text-2xl md:text-3xl transition-colors duration-300 group-hover:text-primary text-card-foreground"
          >
            {title}
          </h3>
          <p className="mb-6 text-center text-muted-foreground text-base">
            {description}
          </p>
          <div className="mb-6 space-y-3 flex-grow transition-all duration-300">
            {features.map((feature, i) => (
              <div
                key={i}
                className="flex items-center justify-center space-x-3"
              >
                <CheckCircle2
                  className="w-5 h-5 flex-shrink-0"
                  style={{ color }}
                />
                <p className="text-muted-foreground text-sm">
                  {feature}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-auto flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4 transition-transform duration-300">
            <button
              className="w-full sm:w-auto px-6 py-3 font-semibold rounded-xl transition-all duration-300 group-hover:brightness-90 group-hover:shadow-lg bg-primary text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              onClick={handleLogin}
            >
              Login
            </button>
            <button
              className="w-full sm:w-auto px-6 py-3 font-semibold rounded-xl transition-all duration-300 group-hover:shadow-lg border border-primary text-primary hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary"
              onClick={handleRegister}
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function RolesSection() {
  return (
    <section
      id="roles"
      className="relative overflow-hidden py-20 sm:py-28 w-full bg-muted"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <p className="mb-3 font-semibold tracking-wider text-primary text-xs sm:text-sm">
            USER ACCESS
          </p>
          <h2 className="mb-4 font-bold text-3xl sm:text-4xl md:text-5xl leading-tight text-foreground">
            Choose Your Role
          </h2>
          <p className="text-muted-foreground text-base text-center">
            Select your role to access the features tailored for your specific healthcare needs
          </p>
        </motion.div>
        <div className="w-full flex flex-wrap justify-center items-center gap-x-8 gap-y-12">
          {roles.map((role, index) => (
            <div key={role.title} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
              <RoleCard {...role} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}