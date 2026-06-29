import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetFacilitiesQuery, useCreateFacilityMutation, useDeleteFacilityMutation } from '../../store/api/facilitiesApi';
import Table from '../../components/common/Table/index.jsx';
import Button from '../../components/common/Button/index.jsx';
import Modal from '../../components/common/Modal/index.jsx';
import Input from '../../components/common/Input/index.jsx';
import Loader from '../../components/common/Loader/index.jsx';

const ManageFacilities = () => {
  const { user } = useSelector((s) => s.auth);
  const { data, isLoading } = useGetFacilitiesQuery();
  const [createFacility] = useCreateFacilityMutation();
  const [deleteFacility] = useDeleteFacilityMutation();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '', address: '', locationLat: '', locationLng: '',
    phone: '', email: '', type: 'hospital',
  });

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'type', label: 'Type' },
    { key: 'address', label: 'Address' },
    { key: 'phone', label: 'Phone' },
    { key: 'rating', label: 'Rating' },
  ];

  const handleCreate = async (e) => {
    e.preventDefault();
    await createFacility({
      ...form,
      managerId: user.id,
      locationLat: parseFloat(form.locationLat),
      locationLng: parseFloat(form.locationLng),
    });
    setShowModal(false);
    setForm({ name: '', address: '', locationLat: '', locationLng: '', phone: '', email: '', type: 'hospital' });
  };

  if (isLoading) return <Loader />;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Facilities</h1>
        <Button onClick={() => setShowModal(true)}>Add Facility</Button>
      </div>

      <Table columns={columns} data={data?.data || []} />

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Facility">
        <form onSubmit={handleCreate} className="space-y-3">
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
          <Input label="Latitude" type="number" value={form.locationLat} onChange={(e) => setForm({ ...form, locationLat: e.target.value })} required />
          <Input label="Longitude" type="number" value={form.locationLng} onChange={(e) => setForm({ ...form, locationLng: e.target.value })} required />
          <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 border rounded-lg text-sm">
              <option value="hospital">Hospital</option>
              <option value="clinic">Clinic</option>
              <option value="nursing_home">Nursing Home</option>
            </select>
          </div>
          <Input label="Manager User ID" value={user?.id} readOnly disabled />
          <Button type="submit" className="w-full">Create Facility</Button>
        </form>
      </Modal>
    </div>
  );
};

export default ManageFacilities;
