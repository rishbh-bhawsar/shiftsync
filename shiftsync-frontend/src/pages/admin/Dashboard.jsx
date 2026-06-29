import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Building2, Calendar, Clock } from 'lucide-react';
import { useGetPlatformAnalyticsQuery } from '../../store/api/analyticsApi';
import StatCard from '../../components/ui/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { FillRateChart } from '../../components/charts/FillRateChart';

const Dashboard = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetPlatformAnalyticsQuery();

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  const stats = data?.data;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <p className="text-slate-500 mt-1">Platform overview and analytics</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Shifts" value={stats?.totalShifts || 0} icon={Calendar} color="blue" delay={0} />
        <StatCard title="This Month" value={stats?.totalShiftsThisMonth || 0} icon={TrendingUp} color="green" delay={0.1} />
        <StatCard title="Fill Rate" value={`${stats?.fillRate || 0}%`} icon={Clock} color="purple" delay={0.2} />
        <StatCard title="Filled Shifts" value={stats?.filledShifts || 0} icon={Building2} color="amber" delay={0.3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Fill Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <FillRateChart filled={stats?.filledShifts || 0} open={(stats?.totalShifts || 0) - (stats?.filledShifts || 0)} />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Top Facilities</CardTitle>
              <button onClick={() => navigate('/admin/facilities')} className="text-xs text-blue-600 hover:underline">View all</button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {(stats?.topFacilities || []).map((f, i) => (
                  <motion.div
                    key={f.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    whileHover={{ scale: 1.01, x: 4 }}
                    onClick={() => navigate('/admin/facilities')}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 cursor-pointer transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold group-hover:shadow-md group-hover:shadow-blue-500/25 transition-shadow">
                        {i + 1}
                      </div>
                      <div>
                        <p className="font-medium text-sm group-hover:text-blue-700 transition-colors">{f.name}</p>
                        {f.address && <p className="text-xs text-slate-400">{f.address}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{f.shiftCount || 0} shifts</Badge>
                      <span className="text-slate-300 group-hover:text-blue-500 transition-colors">→</span>
                    </div>
                  </motion.div>
                ))}
                {(!stats?.topFacilities || stats.topFacilities.length === 0) && (
                  <div className="text-center py-8">
                    <Building2 className="w-10 h-10 text-slate-200 mx-auto mb-2" />
                    <p className="text-sm text-slate-400">No facilities yet</p>
                    <button onClick={() => navigate('/admin/facilities')} className="text-xs text-blue-600 hover:underline mt-1">Add your first facility</button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
