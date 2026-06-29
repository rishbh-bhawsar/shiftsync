import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, LogOut, CheckCheck, ExternalLink, Sun, Moon } from 'lucide-react';
import { useLogoutMutation } from '../../store/api/authApi';
import { useGetNotificationsQuery, useMarkAsReadMutation, useMarkAllAsReadMutation } from '../../store/api/notificationsApi';
import { useSocket } from '../../hooks/useSocket';
import useTheme from '../../hooks/useTheme';
import { toggleTheme } from '../../store/slices/uiSlice';

const getNotificationLink = (notification, role) => {
  const type = notification.type;
  if (type === 'new_shift' || type === 'shift_claimed') {
    return role === 'admin' ? '/admin/shifts' : role === 'facility' ? '/facility/shifts' : '/worker/find-shifts';
  }
  if (type === 'booking_update') {
    return role === 'admin' ? '/admin/facilities' : role === 'facility' ? '/facility/applications' : '/worker/schedule';
  }
  return role === 'admin' ? '/admin/dashboard' : role === 'facility' ? '/facility/dashboard' : '/worker/dashboard';
};

const Navbar = () => {
  const { user, role } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const { isDark, colors } = useTheme();
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();
  const [showNotifs, setShowNotifs] = useState(false);
  const notifRef = useRef(null);

  useSocket();

  const { data: notifData } = useGetNotificationsQuery();
  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();

  const notifications = notifData?.data || [];
  const unread = notifications.filter((n) => !n.isRead);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifs(false);
      }
    };
    if (showNotifs) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifs]);

  const handleBellClick = () => {
    setShowNotifs(!showNotifs);
    if (!showNotifs && unread.length > 0) markAllAsRead();
  };

  const handleNotificationClick = (notif) => {
    markAsRead(notif.id);
    setShowNotifs(false);
    navigate(getNotificationLink(notif, role));
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header style={{ backgroundColor: colors.bg, borderBottomColor: colors.border }} className="h-16 backdrop-blur-md border-b flex items-center justify-between px-6 sticky top-0 z-40">
      <div />
      <div className="flex items-center gap-3 relative" ref={notifRef}>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => dispatch(toggleTheme())}
          style={{ color: colors.textSecondary }} className="p-2 rounded-xl hover:opacity-80 transition-opacity">
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </motion.button>

        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleBellClick}
          style={{ color: colors.textSecondary }} className="relative p-2 rounded-xl hover:opacity-80 transition-opacity">
          <Bell className="w-5 h-5" />
          {unread.length > 0 && (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
              {unread.length}
            </motion.span>
          )}
        </motion.button>

        <AnimatePresence>
          {showNotifs && (
            <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
              style={{ backgroundColor: colors.bgCard, borderColor: colors.border }} className="absolute right-0 top-14 w-96 rounded-2xl shadow-2xl border z-50 overflow-hidden">
              <div style={{ borderBottomColor: colors.border }} className="flex items-center justify-between p-4 border-b">
                <h3 style={{ color: colors.text }} className="font-semibold text-sm">Notifications</h3>
                {unread.length > 0 && (
                  <button onClick={() => markAllAsRead()} className="text-xs text-blue-500 hover:underline flex items-center gap-1">
                    <CheckCheck className="w-3 h-3" /> Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p style={{ color: colors.textMuted }} className="p-6 text-sm text-center">No notifications yet</p>
                ) : (
                  notifications.slice(0, 15).map((n, i) => (
                    <motion.div key={n.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }}
                      style={{ borderBottomColor: colors.border, backgroundColor: !n.isRead ? (isDark ? 'rgba(59,130,246,0.1)' : 'rgba(59,130,246,0.05)') : 'transparent' }}
                      className="p-3 border-b text-sm cursor-pointer hover:opacity-80 transition-opacity group"
                      onClick={() => handleNotificationClick(n)}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p style={{ color: colors.text }} className="font-medium truncate">{n.title}</p>
                          <p style={{ color: colors.textSecondary }} className="text-xs mt-1 line-clamp-2">{n.body}</p>
                          <p style={{ color: colors.textMuted }} className="text-[10px] mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                        </div>
                        <ExternalLink style={{ color: colors.textMuted }} className="w-3.5 h-3.5 mt-1 flex-shrink-0" />
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div style={{ borderColor: colors.border }} className="flex items-center gap-3 pl-3 border-l">
          {user?.profilePhoto ? (
            <img src={user.profilePhoto} alt={user.name} className="w-8 h-8 rounded-full object-cover shadow-md" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold shadow-md">
              {user?.name?.charAt(0)}
            </div>
          )}
          <span style={{ color: colors.text }} className="text-sm font-medium">{user?.name}</span>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-red-500 rounded-lg transition-colors">
            <LogOut className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
