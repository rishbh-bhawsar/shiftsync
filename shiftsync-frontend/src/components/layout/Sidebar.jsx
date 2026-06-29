import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Building2, Users, Calendar, BarChart3,
  MapPin, Clock, FileText, User, ChevronRight,
} from 'lucide-react';

const iconMap = {
  Dashboard: LayoutDashboard,
  Facilities: Building2,
  Workers: Users,
  'All Shifts': Calendar,
  Analytics: BarChart3,
  'Post Shift': FileText,
  'My Shifts': Calendar,
  Calendar: Calendar,
  Applications: Users,
  'Find Shifts': MapPin,
  Schedule: Clock,
  Timesheets: FileText,
  Profile: User,
};

const Sidebar = () => {
  const { role, user } = useSelector((s) => s.auth);
  const location = useLocation();

  const adminLinks = [
    { path: '/admin/dashboard', label: 'Dashboard' },
    { path: '/admin/facilities', label: 'Facilities' },
    { path: '/admin/workers', label: 'Workers' },
    { path: '/admin/shifts', label: 'All Shifts' },
    { path: '/admin/analytics', label: 'Analytics' },
    { path: '/admin/calendar', label: 'Calendar' },
  ];

  const facilityLinks = [
    { path: '/facility/dashboard', label: 'Dashboard' },
    { path: '/facility/post-shift', label: 'Post Shift' },
    { path: '/facility/shifts', label: 'My Shifts' },
    { path: '/facility/calendar', label: 'Calendar' },
    { path: '/facility/applications', label: 'Applications' },
    { path: '/facility/analytics', label: 'Analytics' },
  ];

  const workerLinks = [
    { path: '/worker/dashboard', label: 'Dashboard' },
    { path: '/worker/find-shifts', label: 'Find Shifts' },
    { path: '/worker/schedule', label: 'Schedule' },
    { path: '/worker/calendar', label: 'Calendar' },
    { path: '/worker/timesheets', label: 'Timesheets' },
    { path: '/worker/profile', label: 'Profile' },
  ];

  const links = role === 'admin' ? adminLinks : role === 'facility' ? facilityLinks : workerLinks;

  return (
    <aside className="w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white min-h-screen p-4 flex flex-col">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-8 p-4">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">ShiftSync</h1>
        <p className="text-xs text-slate-400 mt-1 capitalize">{role} Portal</p>
      </motion.div>

      <nav className="flex-1 space-y-1">
        {links.map((link, i) => {
          const isActive = location.pathname === link.path;
          const Icon = iconMap[link.label] || LayoutDashboard;
          return (
            <motion.div key={link.path} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
              <Link to={link.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all duration-200 group ${
                  isActive ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white shadow-lg shadow-blue-500/10' : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}>
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                {link.label}
                {isActive && <ChevronRight className="w-3 h-3 ml-auto text-blue-400" />}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-auto p-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          {user?.profilePhoto ? (
            <img src={user.profilePhoto} alt={user.name} className="w-8 h-8 rounded-full object-cover shadow-md" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold">
              {user?.name?.charAt(0)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>
      </motion.div>
    </aside>
  );
};

export default Sidebar;
