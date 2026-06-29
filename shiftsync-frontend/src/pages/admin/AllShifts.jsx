import { motion } from 'framer-motion';
import { useGetShiftsQuery } from '../../store/api/shiftsApi';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card.jsx';
import { Button } from '../../components/ui/button.jsx';
import { Badge } from '../../components/ui/badge.jsx';
import { exportToCSV, shiftToCSVRow } from '../../utils/csv.util';
import useTheme from '../../hooks/useTheme';
import { formatDate, formatTime, formatCurrency } from '../../utils/format.util.js';
import { Download, Calendar, Clock, Building2, DollarSign } from 'lucide-react';

const statusLabels = {
  open: 'Open', partially_filled: 'Partial', filled: 'Filled', cancelled: 'Cancelled', completed: 'Completed',
};

const statusVariants = {
  open: 'success', partially_filled: 'warning', filled: 'info', cancelled: 'destructive', completed: 'default',
};

const AllShifts = () => {
  const { data, isLoading } = useGetShiftsQuery();
  const { colors } = useTheme();
  const shifts = data?.data || [];

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: colors.text }}>All Shifts</h1>
          <p style={{ color: colors.textSecondary }} className="mt-1">{shifts.length} total shifts</p>
        </div>
        {shifts.length > 0 && (
          <Button onClick={() => exportToCSV(shifts.map(shiftToCSVRow), 'all_shifts')}>
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
        )}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {shifts.map((shift, i) => (
          <motion.div key={shift.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold" style={{ color: colors.text }}>{shift.title}</h3>
                  <Badge variant={statusVariants[shift.status]}>{statusLabels[shift.status]}</Badge>
                </div>
                <div className="space-y-2 text-sm" style={{ color: colors.textSecondary }}>
                  <p className="flex items-center gap-2"><Building2 className="w-3.5 h-3.5" /> {shift.facilityName}</p>
                  <p className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> {formatDate(shift.date)}</p>
                  <p className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> {formatTime(shift.startTime)} - {formatTime(shift.endTime)}</p>
                  <p className="flex items-center gap-2 text-emerald-500 font-semibold"><DollarSign className="w-3.5 h-3.5" /> {formatCurrency(shift.payRate)}/hr</p>
                </div>
                <div className="flex justify-between items-center mt-3 pt-3" style={{ borderTopColor: colors.border, borderTopWidth: 1 }}>
                  <span className="text-xs" style={{ color: colors.textMuted }}>{shift.claimedCount}/{shift.requiredWorkers} workers</span>
                  <span className="text-xs" style={{ color: colors.textMuted }}>{shift.specialization}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AllShifts;
