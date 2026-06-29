import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { useGetFacilityBookingsQuery, useConfirmBookingMutation, useRejectBookingMutation } from '../../store/api/bookingsApi';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Check, X } from 'lucide-react';

const WorkerApplications = () => {
  const { user } = useSelector((s) => s.auth);
  const { data, isLoading } = useGetFacilityBookingsQuery(user?.facilityId);
  const [confirmBooking] = useConfirmBookingMutation();
  const [rejectBooking] = useRejectBookingMutation();

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;

  const bookings = data?.data || [];
  const pending = bookings.filter((b) => b.status === 'pending');
  const others = bookings.filter((b) => b.status !== 'pending');

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">Worker Applications</h1>
        <p className="text-slate-500 mt-1">Review and manage worker booking requests</p>
      </motion.div>

      {pending.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader><CardTitle className="text-lg">Pending Requests ({pending.length})</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pending.map((booking, i) => (
                  <motion.div key={booking.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.05 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-amber-50/50 border border-amber-200/50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-sm font-bold">
                        {booking.worker?.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{booking.worker?.name}</p>
                        <p className="text-xs text-slate-500">{booking.shift?.title} — {booking.shift?.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white" onClick={() => confirmBooking(booking.id)}>
                        <Check className="w-3.5 h-3.5 mr-1" /> Accept
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => rejectBooking(booking.id)}>
                        <X className="w-3.5 h-3.5 mr-1" /> Reject
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardHeader><CardTitle className="text-lg">All Bookings</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {others.map((booking, i) => (
                <motion.div key={booking.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.03 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                      {booking.worker?.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{booking.worker?.name}</p>
                      <p className="text-xs text-slate-500">{booking.shift?.title} — {booking.shift?.date}</p>
                    </div>
                  </div>
                  <Badge variant={booking.status === 'confirmed' ? 'success' : booking.status === 'checked_in' ? 'info' : booking.status === 'cancelled' ? 'destructive' : 'warning'}>
                    {booking.status}
                  </Badge>
                </motion.div>
              ))}
              {others.length === 0 && <p className="text-sm text-slate-400 text-center py-8">No other bookings</p>}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default WorkerApplications;
