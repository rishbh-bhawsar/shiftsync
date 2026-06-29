import { useState } from 'react';
import { useGetNearbyShiftsQuery, useGetShiftsQuery, useClaimShiftMutation } from '../../store/api/shiftsApi';
import useGeolocation from '../../hooks/useGeolocation.js';
import { useSocket } from '../../hooks/useSocket.js';
import ShiftCard from '../../components/shift/ShiftCard.jsx';
import ShiftFilter from '../../components/shift/ShiftFilter.jsx';
import { Card, CardContent } from '../../components/ui/card';
import { MapPin, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const FindShifts = () => {
  const { location, error: geoError } = useGeolocation();
  const [filters, setFilters] = useState({ specialization: '', payMin: 0 });
  useSocket();

  const { data: nearbyData, isLoading: nearbyLoading } = useGetNearbyShiftsQuery(
    { lat: location?.lat, lng: location?.lng, radius: 50 },
    { skip: !location }
  );
  const { data: allData, isLoading: allLoading } = useGetShiftsQuery({ status: 'open' });
  const [claimShift] = useClaimShiftMutation();

  const nearbyShifts = nearbyData?.data || [];
  const allShifts = allData?.data || [];
  const shiftsToShow = nearbyShifts.length > 0 ? nearbyShifts : allShifts;

  const shifts = shiftsToShow.filter((s) => {
    if (filters.specialization && !s.specialization.toLowerCase().includes(filters.specialization.toLowerCase())) return false;
    if (filters.payMin && s.payRate < filters.payMin) return false;
    return true;
  });

  const isLoading = nearbyLoading || allLoading;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">Find Shifts</h1>
        <p className="text-slate-500 mt-1">Discover available shifts near you</p>
      </motion.div>

      {!location && geoError && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-amber-200 bg-amber-50/50">
            <CardContent className="flex items-center gap-3 p-4">
              <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
              <p className="text-sm text-amber-700">Location access denied — showing all available shifts</p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {location && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 text-sm text-slate-500">
          <MapPin className="w-4 h-4 text-blue-500" />
          <span>Showing shifts near you ({nearbyShifts.length} found)</span>
        </motion.div>
      )}

      {!location && !geoError && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-sm text-slate-400">
          <MapPin className="w-4 h-4 animate-pulse" />
          <span>Getting your location...</span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ShiftFilter filters={filters} onChange={setFilters} />
        <div className="lg:col-span-2 space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {nearbyShifts.length === 0 && allShifts.length > 0 && (
                <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-200">
                  No shifts in your area — showing all open shifts
                </p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {shifts.map((shift, i) => (
                  <motion.div key={shift.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <ShiftCard shift={shift} onClaim={(id) => claimShift(id)} />
                  </motion.div>
                ))}
              </div>
              {shifts.length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <MapPin className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                    <p className="text-slate-400">No shifts available right now</p>
                    <p className="text-sm text-slate-300 mt-1">Check back later for new shifts</p>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindShifts;
