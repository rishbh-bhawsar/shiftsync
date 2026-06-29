import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useGetShiftsQuery } from '../../store/api/shiftsApi';
import { useGetFacilitiesQuery } from '../../store/api/facilitiesApi';
import { useGetUsersQuery } from '../../store/api/usersApi';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card.jsx';
import { Button } from '../../components/ui/button.jsx';
import { Badge } from '../../components/ui/badge.jsx';
import useTheme from '../../hooks/useTheme';
import { exportToCSV, shiftToCSVRow } from '../../utils/csv.util';
import { ChevronLeft, ChevronRight, Calendar, Clock, Building2, MapPin, DollarSign, Filter, X, Users, Download } from 'lucide-react';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const statusLabels = {
  open: 'Open', partially_filled: 'Partial', filled: 'Filled', cancelled: 'Cancelled', completed: 'Completed',
};

const statusVariants = {
  open: 'success', partially_filled: 'warning', filled: 'info', cancelled: 'destructive', completed: 'default',
};

const AdminCalendar = () => {
  const { colors, isDark } = useTheme();
  const { data: shiftsData } = useGetShiftsQuery();
  const { data: facilitiesData } = useGetFacilitiesQuery();
  const { data: usersData } = useGetUsersQuery();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [filterFacility, setFilterFacility] = useState('');
  const [filterWorker, setFilterWorker] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  const allShifts = shiftsData?.data || [];
  const facilities = facilitiesData?.data || [];
  const workers = (usersData?.data || []).filter((u) => u.role === 'worker');

  const shifts = useMemo(() => {
    let result = allShifts;
    if (filterFacility) result = result.filter((s) => s.facilityId === filterFacility);
    if (filterWorker) {
      const workerShiftIds = new Set();
      allShifts.forEach((s) => {
        if (s.claimedCount > 0) workerShiftIds.add(s.id);
      });
      result = result.filter((s) => workerShiftIds.has(s.id));
    }
    if (filterDateFrom) result = result.filter((s) => s.date >= filterDateFrom);
    if (filterDateTo) result = result.filter((s) => s.date <= filterDateTo);
    return result;
  }, [allShifts, filterFacility, filterWorker, filterDateFrom, filterDateTo]);

  const shiftsByDate = useMemo(() => {
    const map = {};
    shifts.forEach((s) => {
      if (s.date) {
        if (!map[s.date]) map[s.date] = [];
        map[s.date].push(s);
      }
    });
    return map;
  }, [shifts]);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const getDateStr = (day) => {
    const m = String(currentDate.getMonth() + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${currentDate.getFullYear()}-${m}-${d}`;
  };

  const selectedShifts = selectedDate ? (shiftsByDate[selectedDate] || []) : [];
  const today = new Date().toISOString().split('T')[0];

  const clearFilters = () => { setFilterFacility(''); setFilterWorker(''); setFilterDateFrom(''); setFilterDateTo(''); };
  const hasFilters = filterFacility || filterWorker || filterDateFrom || filterDateTo;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold" style={{ color: colors.text }}>Platform Calendar</h1>
        <p style={{ color: colors.textSecondary }} className="mt-1">View all shifts across the platform</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2" style={{ color: colors.textSecondary }}>
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">Filters:</span>
              </div>
              <select value={filterFacility} onChange={(e) => setFilterFacility(e.target.value)}
                className="h-9 px-3 rounded-lg border text-sm mt-3" style={{ backgroundColor: colors.bgCard, borderColor: colors.border, color: colors.text }}>
                <option value="">All Facilities</option>
                {facilities.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
              <select value={filterWorker} onChange={(e) => setFilterWorker(e.target.value)}
                className="h-9 px-3 rounded-lg border text-sm mt-3" style={{ backgroundColor: colors.bgCard, borderColor: colors.border, color: colors.text }}>
                <option value="">All Workers</option>
                {workers.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
              </select>
              <div className="flex items-center gap-2">
                <input type="date" value={filterDateFrom} onChange={(e) => {
                  setFilterDateFrom(e.target.value);
                  if (filterDateTo && e.target.value >= filterDateTo) {
                    const nextDay = new Date(e.target.value);
                    nextDay.setDate(nextDay.getDate() + 1);
                    setFilterDateTo(nextDay.toISOString().split('T')[0]);
                  }
                }}
                  className="h-9 px-3 rounded-lg border text-sm mt-3" style={{ backgroundColor: colors.bgCard, borderColor: colors.border, color: colors.text }} />
                <span style={{ color: colors.textMuted }} className="text-sm">to</span>
                <input type="date" value={filterDateTo} min={filterDateFrom ? (() => { const d = new Date(filterDateFrom); d.setDate(d.getDate() + 1); return d.toISOString().split('T')[0]; })() : ''} onChange={(e) => setFilterDateTo(e.target.value)}
                  className="h-9 px-3 rounded-lg border text-sm mt-3" style={{ backgroundColor: colors.bgCard, borderColor: colors.border, color: colors.text }} />
              </div>
              {hasFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="w-3.5 h-3.5 mr-1" /> Clear
                </Button>
              )}
              {shifts.length > 0 && (
                <Button variant="secondary" size="sm" onClick={() => exportToCSV(shifts.map(shiftToCSVRow), 'shifts_export')}>
                  <Download className="w-3.5 h-3.5 mr-1" /> Export CSV
                </Button>
              )}
              <span className="text-xs ml-auto" style={{ color: colors.textMuted }}>
                {shifts.length} shift{shifts.length !== 1 ? 's' : ''} found
              </span>
            </div>
          </CardContent>
        </Card>
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
                  <div key={day} className="text-center text-xs font-medium py-2" style={{ color: colors.textMuted }}>{day}</div>
                ))}

                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}

                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dateStr = getDateStr(day);
                  const dayShifts = shiftsByDate[dateStr] || [];
                  const isToday = dateStr === today;
                  const isSelected = dateStr === selectedDate;

                  return (
                    <motion.button key={day} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedDate(dateStr)}
                      className={`aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
                      style={{
                        backgroundColor: isSelected ? (isDark ? 'rgba(59,130,246,0.2)' : 'rgba(59,130,246,0.1)')
                          : isToday ? (isDark ? 'rgba(59,130,246,0.1)' : 'rgba(59,130,246,0.05)') : 'transparent',
                        color: colors.text,
                      }}>
                      <span className={`text-sm font-medium ${isToday ? 'text-blue-500' : ''}`}>{day}</span>
                      {dayShifts.length > 0 && (
                        <div className="flex gap-0.5 mt-0.5">
                          {dayShifts.slice(0, 3).map((s, j) => (
                            <div key={j} className="w-1.5 h-1.5 rounded-full" style={{
                              backgroundColor: s.status === 'filled' ? '#3b82f6' : s.status === 'completed' ? '#22c55e'
                                : s.status === 'cancelled' ? '#ef4444' : s.status === 'partially_filled' ? '#f59e0b' : '#10b981',
                            }} />
                          ))}
                        </div>
                      )}
                      {dayShifts.length > 3 && <span className="text-[8px]" style={{ color: colors.textMuted }}>+{dayShifts.length - 3}</span>}
                    </motion.button>
                  );
                })}
              </div>

              <div className="flex flex-wrap gap-3 mt-4 pt-4" style={{ borderTopColor: colors.border, borderTopWidth: 1 }}>
                {[{ color: '#10b981', label: 'Open' }, { color: '#f59e0b', label: 'Partial' }, { color: '#3b82f6', label: 'Filled' }, { color: '#22c55e', label: 'Completed' }, { color: '#ef4444', label: 'Cancelled' }].map((item) => (
                  <div key={item.label} className="flex items-center gap-1.5 text-xs" style={{ color: colors.textMuted }}>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />{item.label}
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
                selectedShifts.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-sm font-medium" style={{ color: colors.textSecondary }}>
                      {selectedShifts.length} shift{selectedShifts.length > 1 ? 's' : ''} on this day
                    </p>
                    {selectedShifts.map((shift, i) => (
                      <motion.div key={shift.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                        className="p-4 rounded-xl border" style={{ backgroundColor: colors.bgSecondary, borderColor: colors.border }}>
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-medium text-sm" style={{ color: colors.text }}>{shift.title}</p>
                          <Badge variant={statusVariants[shift.status]}>{statusLabels[shift.status]}</Badge>
                        </div>
                        <div className="space-y-1 text-xs" style={{ color: colors.textSecondary }}>
                          <p className="flex items-center gap-1.5"><Building2 className="w-3 h-3" /> {shift.facilityName}</p>
                          <p className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> {shift.startTime} - {shift.endTime}</p>
                          <p className="flex items-center gap-1.5"><MapPin className="w-3 h-3" /> {shift.specialization}</p>
                          <p className="flex items-center gap-1.5 text-emerald-500 font-medium"><DollarSign className="w-3 h-3" /> ${shift.payRate}/hr</p>
                          <p className="flex items-center gap-1.5"><Users className="w-3 h-3" /> {shift.claimedCount}/{shift.requiredWorkers} workers</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-10 h-10 mx-auto mb-2" style={{ color: colors.textMuted }} />
                    <p className="text-sm" style={{ color: colors.textMuted }}>No shifts on this date</p>
                  </div>
                )
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-10 h-10 mx-auto mb-2" style={{ color: colors.textMuted }} />
                  <p className="text-sm" style={{ color: colors.textMuted }}>Click a date to see shifts</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminCalendar;
