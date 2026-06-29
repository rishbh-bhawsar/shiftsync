import { useSelector } from 'react-redux';
import { useGetWorkerTimesheetsQuery } from '../../store/api/timesheetsApi';
import Table from '../../components/common/Table/index.jsx';
import Badge from '../../components/common/Badge/index.jsx';
import { formatCurrency } from '../../utils/format.util.js';
import Loader from '../../components/common/Loader/index.jsx';

const Timesheets = () => {
  const { user } = useSelector((s) => s.auth);
  const { data, isLoading } = useGetWorkerTimesheetsQuery(user?.id);

  const columns = [
    { key: 'weekStart', label: 'Week Start' },
    { key: 'weekEnd', label: 'Week End' },
    { key: 'totalHours', label: 'Total Hours', render: (val) => `${val} hrs` },
    { key: 'totalEarned', label: 'Total Earned', render: (val) => formatCurrency(val) },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <Badge status={val} />,
    },
  ];

  if (isLoading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Timesheets</h1>
      <Table columns={columns} data={data?.data || []} />
    </div>
  );
};

export default Timesheets;
