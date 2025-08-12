"use client";
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSocket } from '@/utils/socket';
import { 
    addPrescriptionRealTime, 
    updatePrescriptionRealTime, 
    dispensePrescriptionRealTime 
} from '@/store/slices/patient/prescriptionsSlice';
import { selectCurrentUser } from '@/store/slices/auth/authSlice';
import toast from 'react-hot-toast';

export default function PrescriptionSocketListener() {
    const dispatch = useDispatch();
    const currentUser = useSelector(selectCurrentUser);
    const setupTimeoutRef = useRef(null);
    const retryCountRef = useRef(0);
    const maxRetries = 3;

    useEffect(() => {
        if (setupTimeoutRef.current) {
            clearTimeout(setupTimeoutRef.current);
        }

        if (!currentUser?._id) {
            console.log('[PrescriptionSocketListener] No authenticated user, skipping setup');
            return;
        }

        const setupSocketListeners = () => {
            const socket = getSocket();
            if (!socket) {
                if (retryCountRef.current < maxRetries) {
                    console.log('[PrescriptionSocketListener] No socket available, retrying in 3s...', retryCountRef.current + 1);
                    retryCountRef.current++;
                    setupTimeoutRef.current = setTimeout(setupSocketListeners, 3000);
                } else {
                    console.warn('[PrescriptionSocketListener] Max retries reached, giving up on socket connection');
                }
                return;
            }

            if (!socket.connected) {
                console.log('[PrescriptionSocketListener] Socket not connected, waiting for connection...');
                socket.once('connect', () => {
                    console.log('[PrescriptionSocketListener] Socket connected, setting up listeners...');
                    retryCountRef.current = 0;
                    setupSocketListeners();
                });
                return;
            }

            console.log('[PrescriptionSocketListener] Setting up prescription socket listeners for user:', currentUser._id);

            const handleNewPrescription = (data) => {
                console.log('[PrescriptionSocketListener] New prescription received:', data);
                dispatch(addPrescriptionRealTime(data));
                
                // Show toast notification
                toast.success(`New prescription: ${data.message}`, {
                    duration: 5000,
                    position: 'top-right',
                });
            };

            const handlePrescriptionUpdate = (data) => {
                console.log('[PrescriptionSocketListener] Prescription update received:', data);
                dispatch(updatePrescriptionRealTime(data));
                
                // Show toast notification
                toast.success(`Prescription updated: ${data.message}`, {
                    duration: 4000,
                    position: 'top-right',
                });
            };

            const handlePrescriptionDispensed = (data) => {
                console.log('[PrescriptionSocketListener] Prescription dispensed received:', data);
                dispatch(dispensePrescriptionRealTime(data));
                
                // Show toast notification
                toast.success(`Prescription dispensed: ${data.message}`, {
                    duration: 4000,
                    position: 'top-right',
                });
            };

            const handlePrescriptionStatusChange = (data) => {
                console.log('[PrescriptionSocketListener] Prescription status change received:', data);
                dispatch(updatePrescriptionRealTime(data));
                
                // Show toast notification
                toast.success(`Prescription status changed: ${data.message}`, {
                    duration: 4000,
                    position: 'top-right',
                });
            };

            const handlePrescriptionExpiryWarning = (data) => {
                console.log('[PrescriptionSocketListener] Prescription expiry warning received:', data);
                
                // Show warning toast
                toast.warning(`Prescription expiring: ${data.message}`, {
                    duration: 6000,
                    position: 'top-right',
                });
            };

            const handleDisconnect = () => {
                console.log('[PrescriptionSocketListener] Socket disconnected');
            };

            const handleReconnect = () => {
                console.log('[PrescriptionSocketListener] Socket reconnected, re-setting up listeners...');
                retryCountRef.current = 0;
                setupTimeoutRef.current = setTimeout(setupSocketListeners, 1000);
            };

            // Set up event listeners
            socket.on('prescription:new', handleNewPrescription);
            socket.on('prescription:updated', handlePrescriptionUpdate);
            socket.on('prescription:dispensed', handlePrescriptionDispensed);
            socket.on('prescription:status_changed', handlePrescriptionStatusChange);
            socket.on('prescription:expiry_warning', handlePrescriptionExpiryWarning);
            socket.on('disconnect', handleDisconnect);
            socket.on('reconnect', handleReconnect);

            return () => {
                socket.off('prescription:new', handleNewPrescription);
                socket.off('prescription:updated', handlePrescriptionUpdate);
                socket.off('prescription:dispensed', handlePrescriptionDispensed);
                socket.off('prescription:status_changed', handlePrescriptionStatusChange);
                socket.off('prescription:expiry_warning', handlePrescriptionExpiryWarning);
                socket.off('disconnect', handleDisconnect);
                socket.off('reconnect', handleReconnect);
            };
        };

        const cleanup = setupSocketListeners();

        return () => {
            if (setupTimeoutRef.current) {
                clearTimeout(setupTimeoutRef.current);
            }
            if (cleanup) {
                cleanup();
            }
            retryCountRef.current = 0;
        };
    }, [dispatch, currentUser]);

    return null;
} 