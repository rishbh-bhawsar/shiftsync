import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { connectSocket, disconnectSocket, getSocket } from '../socket/socket.client';
import { baseApi } from '../store/api/baseApi';
import { setConnected } from '../store/slices/socketSlice';
import { incrementUnread } from '../store/slices/notificationSlice';
import { initOneSignal } from '../utils/onesignal.util';

export const useSocket = () => {
  const { accessToken, user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const onesignalSent = useRef(false);

  useEffect(() => {
    if (!accessToken) return;

    const socket = connectSocket(accessToken);

    socket.on('connect', () => dispatch(setConnected(true)));
    socket.on('disconnect', () => dispatch(setConnected(false)));

    if (user?.role === 'worker') socket.emit('join_shifts_room');
    if (user?.role === 'facility') {
      socket.emit('join_facility_room', { facilityId: user.facilityId });
    }

    socket.on('new_notification', () => {
      dispatch(incrementUnread());
      dispatch(baseApi.util.invalidateTags(['Notifications']));
    });

    socket.on('shift_posted', () => {
      dispatch(baseApi.util.invalidateTags(['Shifts']));
    });
    socket.on('shift_updated', () => {
      dispatch(baseApi.util.invalidateTags(['Shifts']));
    });
    socket.on('shift_filled', () => {
      dispatch(baseApi.util.invalidateTags(['Shifts']));
    });
    socket.on('booking_received', () => {
      dispatch(baseApi.util.invalidateTags(['Bookings']));
    });

    if (!onesignalSent.current) {
      onesignalSent.current = true;
      initOneSignal().then((playerId) => {
        if (playerId) {
          fetch(`${import.meta.env.VITE_API_BASE_URL}/notifications/register-device`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ playerId }),
          }).catch(() => {});
        }
      });
    }

    return () => disconnectSocket();
  }, [accessToken]);

  return getSocket();
};
