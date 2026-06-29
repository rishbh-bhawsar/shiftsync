import { useGetPlatformAnalyticsQuery } from '../../store/api/analyticsApi';
import Loader from '../../components/common/Loader/index.jsx';

const PlatformAnalytics = () => {
  const { data, isLoading } = useGetPlatformAnalyticsQuery();

  if (isLoading) return <Loader />;

  const stats = data?.data;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Platform Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <p className="text-sm text-gray-500">Total Shifts</p>
          <p className="text-2xl font-bold">{stats?.totalShifts || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <p className="text-sm text-gray-500">Fill Rate</p>
          <p className="text-2xl font-bold">{stats?.fillRate || 0}%</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <p className="text-sm text-gray-500">Filled Shifts</p>
          <p className="text-2xl font-bold">{stats?.filledShifts || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <p className="text-sm text-gray-500">This Month</p>
          <p className="text-2xl font-bold">{stats?.totalShiftsThisMonth || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <h3 className="font-semibold mb-3">Top Facilities</h3>
          <div className="space-y-2">
            {(stats?.topFacilities || []).map((f) => (
              <div key={f.id} className="flex justify-between text-sm">
                <span>{f.name}</span>
                <span className="text-gray-500">{f.shiftCount} shifts</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <h3 className="font-semibold mb-3">Top Workers</h3>
          <div className="space-y-2">
            {(stats?.topWorkers || []).map((w) => (
              <div key={w.id} className="flex justify-between text-sm">
                <span>{w.name}</span>
                <span className="text-gray-500">{w.totalShiftsCompleted} shifts</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformAnalytics;
