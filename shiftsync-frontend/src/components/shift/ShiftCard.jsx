import { motion } from 'framer-motion';
import { Badge } from '../ui/badge.jsx';
import { Button } from '../ui/button.jsx';
import { Card, CardContent } from '../ui/card.jsx';
import { formatDate, formatTime, formatCurrency } from '../../utils/format.util.js';
import { Clock, DollarSign, MapPin } from 'lucide-react';

const ShiftCard = ({ shift, onClaim, showClaimButton = true }) => {
  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
      <Card className="overflow-hidden hover:shadow-lg">
        <CardContent className="p-5">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold">{shift.title}</h3>
            <Badge variant={shift.status === 'open' ? 'success' : shift.status === 'filled' ? 'info' : 'warning'}>
              {shift.status}
            </Badge>
          </div>
          <p className="text-sm mb-1" style={{ color: 'var(--text-secondary)' }}>{shift.facilityName}</p>
          <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>{shift.specialization}</p>

          <div className="grid grid-cols-2 gap-3 text-sm mb-4">
            <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
              <Clock className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
              <span>{formatDate(shift.date)}</span>
            </div>
            <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
              <MapPin className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
              <span>{formatTime(shift.startTime)} - {formatTime(shift.endTime)}</span>
            </div>
            <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
              <Clock className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
              <span>{shift.durationHours} hrs</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-500 font-semibold">
              <DollarSign className="w-3.5 h-3.5" />
              <span>{formatCurrency(shift.payRate)}/hr</span>
            </div>
          </div>

          <div style={{ borderColor: 'var(--border-color)' }} className="flex justify-between items-center pt-3 border-t">
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {shift.claimedCount}/{shift.requiredWorkers} filled
            </span>
            {showClaimButton && shift.status !== 'filled' && shift.status !== 'cancelled' && (
              <Button size="sm" onClick={() => onClaim?.(shift.id)}>Claim Shift</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ShiftCard;
