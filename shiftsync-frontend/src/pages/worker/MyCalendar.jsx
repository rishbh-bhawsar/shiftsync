import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { useGetWorkerBookingsQuery } from '../../store/api/bookingsApi';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card.jsx';
import { Button } from '../../components/ui/button.jsx';
import { Badge } from '../../components/ui/badge.jsx';
import useTheme from '../../hooks/useTheme';
import { ChevronLeft, ChevronRight, Calendar, Clock, Building2, X, LogIn, LogOut } from 'lucide-react';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const statusLabels = {
  pending: 'Pending', confirmed: 'Confirmed', checked_in: 'Checked In',
  checked_out: 'Checked Out', completed: 'Completed', cancelled: 'Cancelled', no_show: 'No Show',
};

const statusVariants = {
  pending: 'warning', confirmed: 'success', checked_in: 'info',
  checked_out: 'success', completed: 'default', cancelled: 'destructive', no_show: 'destructive',
};

const MyCalendar = () => {
  const { user } = useSelector((s) => s.auth);
  const { colors, isDark } = useTheme();
  const { data } = useGetWorkerBookingsQuery(user?.id);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const bookings = data?.data || [];

  const bookingsByDate = useMemo(() => {
    const map = {};
    bookings.forEach((b) => {
      const date = b.shift?.date;
      if (date) {
        if (!map[date]) map[date] = [];
        map[date].push(b);
      }
    });
    return map;
  }, [bookings]);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const getDateStr = (day) => {
    const m = String(currentDate.getMonth() + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${currentDate.getFullYear()}-${m}-${d}`;
  };

  const selectedBookings = selectedDate ? (bookingsByDate[selectedDate] || []) : [];

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold" style={{ color: colors.text }}>My Calendar</h1>
        <p style={{ color: colors.textSecondary }} className="mt-1">View your bookings by date</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" onClick={prevMonth}>
                  <ChevronLeft className="w-5 h-5" style={{ color: colors.text }} />
                </Button>
                <CardTitle className="text-lg min-w-[180px] text-center" style={{ color: colors.text }}>
                  {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={nextMonth}>
                  <ChevronRight className="w-5 h-5" style={{ color: colors.text }} />
                </Button>
              </div>
              <Button variant="secondary" size="sm" onClick={() => { setCurrentDate(new Date()); setSelectedDate(null); }}>
                Today
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1">
                {WEEKDAYS.map((day) => (
                  <div key={day} className="text-center text-xs font-medium py-2" style={{ color: colors.textMuted }}>
                    {day}
                  </div>
                ))}

                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}

                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dateStr = getDateStr(day);
                  const dayBookings = bookingsByDate[dateStr] || [];
                  const isToday = dateStr === today;
                  const isSelected = dateStr === selectedDate;
                  const hasBookings = dayBookings.length > 0;

                  return (
                    <motion.button
                      key={day}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedDate(dateStr)}
                      className={`aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all ${
                        isSelected ? 'ring-2 ring-blue-500' : ''
                      }`}
                      style={{
                        backgroundColor: isSelected
                          ? (isDark ? 'rgba(59,130,246,0.2)' : 'rgba(59,130,246,0.1)')
                          : isToday
                            ? (isDark ? 'rgba(59,130,246,0.1)' : 'rgba(59,130,246,0.05)')
                            : 'transparent',
                        color: colors.text,
                      }}
                    >
                      <span className={`text-sm font-medium ${isToday ? 'text-blue-500' : ''}`}>{day}</span>
                      {hasBookings && (
                        <div className="flex gap-0.5 mt-0.5">
                          {dayBookings.slice(0, 3).map((b, j) => (
                            <div
                              key={j}
                              className="w-1.5 h-1.5 rounded-full"
                              style={{
                                backgroundColor: b.status === 'confirmed' ? '#22c55e'
                                  : b.status === 'checked_in' ? '#3b82f6'
                                  : b.status === 'checked_out' ? '#8b5cf6'
                                  : b.status === 'cancelled' ? '#ef4444'
                                  : b.status === 'completed' ? '#64748b'
                                  : '#f59e0b',
                              }}
                            />
                          ))}
                        </div>
                      )}
                      {dayBookings.length > 3 && (
                        <span className="text-[8px]" style={{ color: colors.textMuted }}>+{dayBookings.length - 3}</span>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              <div className="flex flex-wrap gap-3 mt-4 pt-4" style={{ borderTopColor: colors.border, borderTopWidth: 1 }}>
                {[
                  { color: '#f59e0b', label: 'Pending' },
                  { color: '#22c55e', label: 'Confirmed' },
                  { color: '#3b82f6', label: 'Checked In' },
                  { color: '#8b5cf6', label: 'Checked Out' },
                  { color: '#ef4444', label: 'Cancelled' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-1.5 text-xs" style={{ color: colors.textMuted }}>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.label}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2" style={{ color: colors.text }}>
                <Calendar className="w-5 h-5 text-blue-500" />
                {selectedDate ? new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : 'Select a date'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedDate ? (
                selectedBookings.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-sm font-medium" style={{ color: colors.textSecondary }}>
                      {selectedBookings.length} booking{selectedBookings.length > 1 ? 's' : ''} on this day
                    </p>
                    {selectedBookings.map((booking, i) => (
                      <motion.div key={booking.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                        className="p-4 rounded-xl border" style={{ backgroundColor: colors.bgSecondary, borderColor: colors.border }}>
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-medium text-sm" style={{ color: colors.text }}>{booking.shift?.title}</p>
                          <Badge variant={statusVariants[booking.status]}>
                            {statusLabels[booking.status]}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-xs" style={{ color: colors.textSecondary }}>
                          <p className="flex items-center gap-1.5"><Building2 className="w-3 h-3" /> {booking.shift?.facilityName}</p>
                          <p className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {booking.shift ? `${booking.shift.startTime} - ${booking.shift.endTime}` : ''}</p>
                          {booking.actualHours && (
                            <p className="text-emerald-500 font-medium">{booking.actualHours}hrs • ${booking.totalEarned}</p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-10 h-10 mx-auto mb-2" style={{ color: colors.textMuted }} />
                    <p className="text-sm" style={{ color: colors.textMuted }}>No bookings on this date</p>
                  </div>
                )
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-10 h-10 mx-auto mb-2" style={{ color: colors.textMuted }} />
                  <p className="text-sm" style={{ color: colors.textMuted }}>Click a date to see bookings</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default MyCalendar;
