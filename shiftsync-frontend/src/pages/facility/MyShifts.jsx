import { useSelector } from 'react-redux';
import { useGetShiftsQuery, useDeleteShiftMutation } from '../../store/api/shiftsApi';
import Table from '../../components/common/Table/index.jsx';
import Badge from '../../components/common/Badge/index.jsx';
import Button from '../../components/common/Button/index.jsx';
import { formatDate, formatTime, formatCurrency } from '../../utils/format.util.js';
import Loader from '../../components/common/Loader/index.jsx';

const MyShifts = () => {
  const { user } = useSelector((s) => s.auth);
  const { data, isLoading } = useGetShiftsQuery({ facilityId: user?.facilityId });
  const [deleteShift] = useDeleteShiftMutation();

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'specialization', label: 'Specialization' },
    { key: 'date', label: 'Date', render: (val) => formatDate(val) },
    { key: 'startTime', label: 'Start', render: (val) => formatTime(val) },
    { key: 'endTime', label: 'End', render: (val) => formatTime(val) },
    { key: 'payRate', label: 'Pay Rate', render: (val) => formatCurrency(val) },
    { key: 'claimedCount', label: 'Claimed', render: (val, row) => `${val}/${row.requiredWorkers}` },
    { key: 'status', label: 'Status', render: (val) => <Badge status={val} /> },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <Button
          size="sm"
          variant="danger"
          onClick={(e) => {
            e.stopPropagation();
            if (confirm('Cancel this shift?')) deleteShift(row.id);
          }}
        >
          Cancel
        </Button>
      ),
    },
  ];

  if (isLoading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Shifts</h1>
      <Table columns={columns} data={data?.data || []} />
    </div>
  );
};

export default MyShifts;
