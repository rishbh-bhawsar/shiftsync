import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { useGetWorkerBookingsQuery, useCheckInMutation, useCheckOutMutation, useCancelBookingMutation } from '../../store/api/bookingsApi';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card.jsx';
import { Button } from '../../components/ui/button.jsx';
import { Badge } from '../../components/ui/badge.jsx';
import { exportToCSV, bookingToCSVRow } from '../../utils/csv.util';
import { formatDate, formatTime } from '../../utils/format.util.js';
import useTheme from '../../hooks/useTheme';
import { Calendar, Clock, Building2, LogIn, LogOut, X, Download } from 'lucide-react';

const statusLabels = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  checked_in: 'Checked In',
  checked_out: 'Checked Out',
  completed: 'Completed',
  cancelled: 'Cancelled',
  no_show: 'No Show',
};

const statusVariants = {
  pending: 'warning',
  confirmed: 'success',
  checked_in: 'info',
  checked_out: 'success',
  completed: 'default',
  cancelled: 'destructive',
  no_show: 'destructive',
};

const MySchedule = () => {
  const { user } = useSelector((s) => s.auth);
  const { colors } = useTheme();
  const { data, isLoading } = useGetWorkerBookingsQuery(user?.id);
  const [checkIn] = useCheckInMutation();
  const [checkOut] = useCheckOutMutation();
  const [cancelBooking] = useCancelBookingMutation();

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;

  const bookings = data?.data || [];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: colors.text }}>My Schedule</h1>
          <p style={{ color: colors.textSecondary }} className="mt-1">View and manage your shift bookings</p>
        </div>
        {bookings.length > 0 && (
          <Button variant="secondary" onClick={() => exportToCSV(bookings.map(bookingToCSVRow), 'my_schedule')}>
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
        )}
      </motion.div>

      <div className="space-y-4">
        {bookings.map((booking, i) => (
          <motion.div key={booking.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card>
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold" style={{ color: colors.text }}>{booking.shift?.title || 'Shift'}</p>
                      <div className="flex items-center gap-4 text-sm" style={{ color: colors.textSecondary }}>
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5" /> {booking.shift?.facilityName || 'Facility'}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" /> {booking.shift?.date ? formatDate(booking.shift.date) : ''}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {booking.shift ? `${formatTime(booking.shift.startTime)} - ${formatTime(booking.shift.endTime)}` : ''}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={statusVariants[booking.status]}>
                      {statusLabels[booking.status] || booking.status}
                    </Badge>
                    <div className="flex gap-2">
                      {booking.status === 'confirmed' && (
                        <Button size="sm" onClick={() => checkIn(booking.id)}>
                          <LogIn className="w-3.5 h-3.5 mr-1" /> Check In
                        </Button>
                      )}
                      {booking.status === 'checked_in' && (
                        <Button size="sm" onClick={() => checkOut(booking.id)}>
                          <LogOut className="w-3.5 h-3.5 mr-1" /> Check Out
                        </Button>
                      )}
                      {(booking.status === 'pending' || booking.status === 'confirmed') && (
                        <Button size="sm" variant="destructive" onClick={() => cancelBooking(booking.id)}>
                          <X className="w-3.5 h-3.5 mr-1" /> Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        {bookings.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="w-12 h-12 mx-auto mb-3" style={{ color: colors.textMuted }} />
              <p style={{ color: colors.textSecondary }}>No bookings yet</p>
              <p className="text-sm mt-1" style={{ color: colors.textMuted }}>Find shifts to get started</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MySchedule;
