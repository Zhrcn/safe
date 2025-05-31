import { useMemo } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { ROLES, ROLE_ROUTES } from '@/lib/config';

export function useRole() {
  const { user } = useAuth();
  
  const role = useMemo(() => user?.role || null, [user]);
  
  const dashboardRoute = useMemo(() => {
    if (!role) return '/';
    return ROLE_ROUTES[role]?.dashboard || '/';
  }, [role]);
  
  const hasRole = (roleToCheck) => {
    return role === roleToCheck;
  };
  
  const isDoctor = useMemo(() => role === ROLES.DOCTOR, [role]);
  
  const isPatient = useMemo(() => role === ROLES.PATIENT, [role]);
  
  const isPharmacist = useMemo(() => role === ROLES.PHARMACIST, [role]);
  
  const isAdmin = useMemo(() => role === ROLES.ADMIN, [role]);
  
  return {
    role,
    dashboardRoute,
    hasRole,
    isDoctor,
    isPatient,
    isPharmacist,
    isAdmin
  };
} 