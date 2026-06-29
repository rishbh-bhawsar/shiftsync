import { useSelector } from 'react-redux';
import { useGetFacilityAnalyticsQuery } from '../../store/api/analyticsApi';
import Loader from '../../components/common/Loader/index.jsx';

const FacilityAnalytics = () => {
  const { user } = useSelector((s) => s.auth);
  const { data, isLoading } = useGetFacilityAnalyticsQuery(user?.facilityId, {
    skip: !user?.facilityId,
  });

  if (isLoading) return <Loader />;

  const stats = data?.data;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Facility Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <p className="text-sm text-gray-500">Total Shifts</p>
          <p className="text-2xl font-bold">{stats?.totalShifts || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-2xl font-bold">{stats?.completedShifts || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <p className="text-sm text-gray-500">Open</p>
          <p className="text-2xl font-bold">{stats?.openShifts || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <p className="text-sm text-gray-500">Fill Rate</p>
          <p className="text-2xl font-bold">{stats?.fillRate || 0}%</p>
        </div>
      </div>
    </div>
  );
};

export default FacilityAnalytics;
