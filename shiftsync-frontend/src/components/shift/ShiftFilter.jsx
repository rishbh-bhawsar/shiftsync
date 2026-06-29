import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.jsx';
import { Input } from '../ui/input.jsx';

const ShiftFilter = ({ filters, onChange }) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Specialization</label>
          <Input value={filters.specialization || ''} onChange={(e) => onChange({ ...filters, specialization: e.target.value })} placeholder="e.g. ICU, Emergency" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Min Pay Rate</label>
          <Input type="number" value={filters.payMin || ''} onChange={(e) => onChange({ ...filters, payMin: parseFloat(e.target.value) || 0 })} placeholder="$0" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>Date</label>
          <Input type="date" value={filters.date || ''} onChange={(e) => onChange({ ...filters, date: e.target.value })} />
        </div>
      </CardContent>
    </Card>
  );
};

export default ShiftFilter;
