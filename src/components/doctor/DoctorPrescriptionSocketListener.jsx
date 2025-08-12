"use client";
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSocket } from '@/utils/socket';
import { selectCurrentUser } from '@/store/slices/auth/authSlice';
import toast from 'react-hot-toast';

export default function DoctorPrescriptionSocketListener() {
    const dispatch = useDispatch();
    const currentUser = useSelector(selectCurrentUser);
    const setupTimeoutRef = useRef(null);
    const retryCountRef = useRef(0);
    const maxRetries = 3;

    useEffect(() => {
        if (setupTimeoutRef.current) {
            clearTimeout(setupTimeoutRef.current);
        }

        if (!currentUser?._id || currentUser?.role !== 'doctor') {
            console.log('[DoctorPrescriptionSocketListener] Not a doctor or no user, skipping setup');
            return;
        }

        const setupSocketListeners = () => {
            const socket = getSocket();
            if (!socket) {
                if (retryCountRef.current < maxRetries) {
                    console.log('[DoctorPrescriptionSocketListener] No socket available, retrying in 3s...', retryCountRef.current + 1);
                    retryCountRef.current++;
                    setupTimeoutRef.current = setTimeout(setupSocketListeners, 3000);
                } else {
                    console.warn('[DoctorPrescriptionSocketListener] Max retries reached, giving up on socket connection');
                }
                return;
            }

            if (!socket.connected) {
                console.log('[DoctorPrescriptionSocketListener] Socket not connected, waiting for connection...');
                socket.once('connect', () => {
                    console.log('[DoctorPrescriptionSocketListener] Socket connected, setting up listeners...');
                    retryCountRef.current = 0;
                    setupSocketListeners();
                });
                return;
            }

            console.log('[DoctorPrescriptionSocketListener] Setting up doctor prescription socket listeners for user:', currentUser._id);

            const handleRefillRequest = (data) => {
                console.log('[DoctorPrescriptionSocketListener] Refill request received:', data);
                
                toast.warning(`Refill request from patient: ${data.message}`, {
                    duration: 6000,
                    position: 'top-right',
                });
            };

            const handlePrescriptionDispensed = (data) => {
                console.log('[DoctorPrescriptionSocketListener] Prescription dispensed received:', data);
                
                toast.success(`Patient's prescription dispensed: ${data.message}`, {
                    duration: 4000,
                    position: 'top-right',
                });
            };

            const handlePrescriptionStatusChange = (data) => {
                console.log('[DoctorPrescriptionSocketListener] Prescription status change received:', data);
                
                toast.info(`Prescription status changed: ${data.message}`, {
                    duration: 4000,
                    position: 'top-right',
                });
            };

            const handleDisconnect = () => {
                console.log('[DoctorPrescriptionSocketListener] Socket disconnected');
            };

            const handleReconnect = () => {
                console.log('[DoctorPrescriptionSocketListener] Socket reconnected, re-setting up listeners...');
                retryCountRef.current = 0;
                setupTimeoutRef.current = setTimeout(setupSocketListeners, 1000);
            };

            socket.on('prescription:refill_requested', handleRefillRequest);
            socket.on('prescription:dispensed', handlePrescriptionDispensed);
            socket.on('prescription:status_changed', handlePrescriptionStatusChange);
            socket.on('disconnect', handleDisconnect);
            socket.on('reconnect', handleReconnect);

            return () => {
                socket.off('prescription:refill_requested', handleRefillRequest);
                socket.off('prescription:dispensed', handlePrescriptionDispensed);
                socket.off('prescription:status_changed', handlePrescriptionStatusChange);
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