import { motion } from 'framer-motion';
import { Calendar, MapPin, DollarSign, Users } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useGetWorkerBookingsQuery } from '../../store/api/bookingsApi';
import { useGetWorkerAnalyticsQuery } from '../../store/api/analyticsApi';
import StatCard from '../../components/ui/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { formatDate } from '../../utils/format.util';

const Dashboard = () => {
  const { user } = useSelector((s) => s.auth);
  const { data: bookings, isLoading: bookingsLoading } = useGetWorkerBookingsQuery(user?.id);
  const { data: analytics, isLoading: analyticsLoading } = useGetWorkerAnalyticsQuery(user?.id);

  if (bookingsLoading || analyticsLoading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  const stats = analytics?.data;
  const recentBookings = (bookings?.data || []).slice(0, 5);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
          Welcome back, {user?.name?.split(' ')[0]}
        </h1>
        <p className="text-slate-500 mt-1">Here's your work summary</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Bookings" value={stats?.totalBookings || 0} icon={Calendar} color="blue" delay={0} />
        <StatCard title="Completed" value={stats?.completedBookings || 0} icon={Users} color="green" delay={0.1} />
        <StatCard title="Total Earned" value={`$${(stats?.totalEarned || 0).toLocaleString()}`} icon={DollarSign} color="purple" delay={0.2} />
        <StatCard title="Rating" value={`${stats?.worker?.rating || 0} ★`} icon={MapPin} color="amber" delay={0.3} />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentBookings.map((booking, i) => (
                <motion.div key={booking.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + i * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{booking.shift?.title || 'Shift'}</p>
                      <p className="text-xs text-slate-500">{booking.shift?.date ? formatDate(booking.shift.date) : ''}</p>
                    </div>
                  </div>
                  <Badge variant={booking.status === 'completed' ? 'success' : booking.status === 'checked_in' ? 'info' : 'warning'}>
                    {booking.status}
                  </Badge>
                </motion.div>
              ))}
              {recentBookings.length === 0 && <p className="text-sm text-slate-400 text-center py-8">No bookings yet — find shifts to get started</p>}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;
