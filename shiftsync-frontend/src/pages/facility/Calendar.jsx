import { useSelector } from 'react-redux';
import { useGetShiftsQuery } from '../../store/api/shiftsApi';
import ShiftCalendar from '../../components/calendar/ShiftCalendar.jsx';
import Loader from '../../components/common/Loader/index.jsx';

const Calendar = () => {
  const { user } = useSelector((s) => s.auth);
  const { data, isLoading } = useGetShiftsQuery({ facilityId: user?.facilityId });

  if (isLoading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Calendar</h1>
      <ShiftCalendar shifts={data?.data || []} />
    </div>
  );
};

export default Calendar;
