"use client";
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSocket } from '@/utils/socket';
import { selectCurrentUser } from '@/store/slices/auth/authSlice';
import toast from 'react-hot-toast';

export default function PharmacistPrescriptionSocketListener() {
    const dispatch = useDispatch();
    const currentUser = useSelector(selectCurrentUser);
    const setupTimeoutRef = useRef(null);
    const retryCountRef = useRef(0);
    const maxRetries = 3;

    useEffect(() => {
        if (setupTimeoutRef.current) {
            clearTimeout(setupTimeoutRef.current);
        }

        if (!currentUser?._id || currentUser?.role !== 'pharmacist') {
            console.log('[PharmacistPrescriptionSocketListener] Not a pharmacist or no user, skipping setup');
            return;
        }

        const setupSocketListeners = () => {
            const socket = getSocket();
            if (!socket) {
                if (retryCountRef.current < maxRetries) {
                    console.log('[PharmacistPrescriptionSocketListener] No socket available, retrying in 3s...', retryCountRef.current + 1);
                    retryCountRef.current++;
                    setupTimeoutRef.current = setTimeout(setupSocketListeners, 3000);
                } else {
                    console.warn('[PharmacistPrescriptionSocketListener] Max retries reached, giving up on socket connection');
                }
                return;
            }

            if (!socket.connected) {
                console.log('[PharmacistPrescriptionSocketListener] Socket not connected, waiting for connection...');
                socket.once('connect', () => {
                    console.log('[PharmacistPrescriptionSocketListener] Socket connected, setting up listeners...');
                    retryCountRef.current = 0;
                    setupSocketListeners();
                });
                return;
            }

            console.log('[PharmacistPrescriptionSocketListener] Setting up pharmacist prescription socket listeners for user:', currentUser._id);

            const handleNewPrescription = (data) => {
                console.log('[PharmacistPrescriptionSocketListener] New prescription received:', data);
                toast.success(`New prescription available: ${data.message}`, {
                    duration: 5000,
                    position: 'top-right',
                });
            };

            const handlePrescriptionUpdate = (data) => {
                console.log('[PharmacistPrescriptionSocketListener] Prescription update received:', data);
                
                toast.info(`Prescription updated: ${data.message}`, {
                    duration: 4000,
                    position: 'top-right',
                });
            };

            const handlePrescriptionDispensed = (data) => {
                console.log('[PharmacistPrescriptionSocketListener] Prescription dispensed received:', data);
                
                toast.success(`Prescription dispensed successfully: ${data.message}`, {
                    duration: 4000,
                    position: 'top-right',
                });
            };

            const handlePrescriptionStatusChange = (data) => {
                console.log('[PharmacistPrescriptionSocketListener] Prescription status change received:', data);
                
                toast.info(`Prescription status changed: ${data.message}`, {
                    duration: 4000,
                    position: 'top-right',
                });
            };

            const handleRefillRequest = (data) => {
                console.log('[PharmacistPrescriptionSocketListener] Refill request received:', data);
                
                toast.warning(`Refill request: ${data.message}`, {
                    duration: 6000,
                    position: 'top-right',
                });
            };

            const handleDisconnect = () => {
                console.log('[PharmacistPrescriptionSocketListener] Socket disconnected');
            };

            const handleReconnect = () => {
                console.log('[PharmacistPrescriptionSocketListener] Socket reconnected, re-setting up listeners...');
                retryCountRef.current = 0;
                setupTimeoutRef.current = setTimeout(setupSocketListeners, 1000);
            };

            socket.on('prescription:new', handleNewPrescription);
            socket.on('prescription:updated', handlePrescriptionUpdate);
            socket.on('prescription:dispensed', handlePrescriptionDispensed);
            socket.on('prescription:status_changed', handlePrescriptionStatusChange);
            socket.on('prescription:refill_requested', handleRefillRequest);
            socket.on('disconnect', handleDisconnect);
            socket.on('reconnect', handleReconnect);

            return () => {
                socket.off('prescription:new', handleNewPrescription);
                socket.off('prescription:updated', handlePrescriptionUpdate);
                socket.off('prescription:dispensed', handlePrescriptionDispensed);
                socket.off('prescription:status_changed', handlePrescriptionStatusChange);
                socket.off('prescription:refill_requested', handleRefillRequest);
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