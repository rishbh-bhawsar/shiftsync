import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useCreateShiftMutation } from '../../store/api/shiftsApi';
import Input from '../../components/common/Input/index.jsx';
import Button from '../../components/common/Button/index.jsx';

const PostShift = () => {
  const { user } = useSelector((s) => s.auth);
  const [createShift, { isLoading }] = useCreateShiftMutation();
  const [form, setForm] = useState({
    facilityId: user?.facilityId || '',
    title: '',
    specialization: '',
    date: '',
    startTime: '',
    endTime: '',
    payRate: '',
    requiredWorkers: 1,
    description: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createShift({
        ...form,
        payRate: parseFloat(form.payRate),
        requiredWorkers: parseInt(form.requiredWorkers),
      }).unwrap();
      setForm({ ...form, title: '', description: '' });
      alert('Shift created successfully');
    } catch (err) {
      alert(err.data?.message || 'Failed to create shift');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Post New Shift</h1>
      <div className="bg-white rounded-lg shadow-sm border p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <Input label="Specialization" value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} placeholder="e.g. ICU, Emergency" required />
          <Input label="Date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Start Time" type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} required />
            <Input label="End Time" type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Pay Rate ($/hr)" type="number" value={form.payRate} onChange={(e) => setForm({ ...form, payRate: e.target.value })} required />
            <Input label="Required Workers" type="number" value={form.requiredWorkers} onChange={(e) => setForm({ ...form, requiredWorkers: e.target.value })} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Posting...' : 'Post Shift'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default PostShift;
