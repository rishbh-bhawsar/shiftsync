import { useGetUsersQuery } from '../../store/api/usersApi';
import Table from '../../components/common/Table/index.jsx';
import Loader from '../../components/common/Loader/index.jsx';

const ManageWorkers = () => {
  const { data, isLoading } = useGetUsersQuery();

  const workers = (data?.data || []).filter((u) => u.role === 'worker');

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'rating', label: 'Rating' },
    { key: 'totalShiftsCompleted', label: 'Shifts Done' },
    {
      key: 'specializations',
      label: 'Specializations',
      render: (val) => (val || []).join(', '),
    },
  ];

  if (isLoading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Workers</h1>
      <Table columns={columns} data={workers} />
    </div>
  );
};

export default ManageWorkers;
