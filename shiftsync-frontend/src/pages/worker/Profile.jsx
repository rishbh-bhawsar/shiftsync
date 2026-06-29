import { useSelector, useDispatch } from 'react-redux';
import { useGetUserByIdQuery, useUpdateUserMutation, useUploadPhotoMutation } from '../../store/api/usersApi';
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card.jsx';
import { Input } from '../../components/ui/input.jsx';
import { Button } from '../../components/ui/button.jsx';
import useTheme from '../../hooks/useTheme';
import { setCredentials } from '../../store/slices/authSlice';
import { User, Mail, Phone, Shield, Star, Award, BookOpen, Camera, Loader2, Check } from 'lucide-react';

const Profile = () => {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const { data, isLoading } = useGetUserByIdQuery(user?.id);
  const [updateUser] = useUpdateUserMutation();
  const [uploadPhoto, { isLoading: uploading }] = useUploadPhotoMutation();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [preview, setPreview] = useState(null);
  const [uploaded, setUploaded] = useState(false);
  const fileRef = useRef(null);
  const { colors } = useTheme();

  const handleSave = async () => {
    await updateUser({ id: user.id, ...form });
    setEditing(false);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return alert('Please select an image file');
    if (file.size > 5 * 1024 * 1024) return alert('File size must be less than 5MB');

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!preview) return;
    const file = fileRef.current?.files?.[0];
    if (!file) return;

    try {
      const result = await uploadPhoto({ id: user.id, file }).unwrap();
      const photoUrl = result.data.profilePhoto;
      const updatedUser = { ...user, profilePhoto: photoUrl };
      dispatch(setCredentials({
        user: updatedUser,
        accessToken: localStorage.getItem('accessToken'),
        refreshToken: localStorage.getItem('refreshToken'),
      }));
      setUploaded(true);
      setTimeout(() => { setUploaded(false); setPreview(null); }, 2000);
    } catch (err) {
      console.error('Upload error:', err);
    }
  };

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>;

  const profile = data?.data;
  const photoUrl = preview || profile?.profilePhoto;

  const fields = [
    { icon: Mail, label: 'Email', value: profile?.email },
    { icon: Phone, label: 'Phone', value: profile?.phone || 'Not set' },
    { icon: Shield, label: 'Role', value: profile?.role },
    { icon: Star, label: 'Rating', value: `${profile?.rating || 0} ★` },
    { icon: Award, label: 'Shifts Completed', value: profile?.totalShiftsCompleted || 0 },
    ...(profile?.specializations ? [{ icon: BookOpen, label: 'Specializations', value: profile.specializations.join(', ') }] : []),
    ...(profile?.licenseNumber ? [{ icon: Shield, label: 'License', value: profile.licenseNumber }] : []),
  ];

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold" style={{ color: colors.text }}>Profile</h1>
        <p style={{ color: colors.textSecondary }} className="mt-1">Manage your account settings</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-4">
                {profile?.profilePhoto ? (
                  <img src={profile.profilePhoto} alt={profile.name} className="w-16 h-16 rounded-2xl object-cover shadow-lg" />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {profile?.name?.charAt(0)}
                  </div>
                )}
                <div>
                  <CardTitle className="text-xl">{profile?.name}</CardTitle>
                  <p style={{ color: colors.textSecondary }} className="text-sm">{profile?.email}</p>
                </div>
              </div>
              <Button size="sm" variant={editing ? 'secondary' : 'default'} onClick={() => setEditing(!editing)}>
                {editing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </CardHeader>
            <CardContent>
              {editing ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: colors.textSecondary }}>Name</label>
                    <Input value={form.name ?? profile?.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: colors.textSecondary }}>Phone</label>
                    <Input value={form.phone ?? profile?.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: colors.textSecondary }}>License Number</label>
                    <Input value={form.licenseNumber ?? profile?.licenseNumber} onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })} />
                  </div>
                  <Button onClick={handleSave}>Save Changes</Button>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {fields.map((field, i) => (
                    <motion.div key={field.label} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.05 }}
                      className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: colors.bgSecondary }}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: colors.border }}>
                        <field.icon className="w-4 h-4" style={{ color: colors.textSecondary }} />
                      </div>
                      <div>
                        <p className="text-xs" style={{ color: colors.textMuted }}>{field.label}</p>
                        <p className="text-sm font-medium" style={{ color: colors.text }}>{field.value}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Profile Photo</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="relative group mb-4">
                <div className="w-32 h-32 rounded-2xl overflow-hidden border-2" style={{ borderColor: colors.border }}>
                  {photoUrl ? (
                    <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-4xl font-bold">
                      {profile?.name?.charAt(0)}
                    </div>
                  )}
                </div>
                <button onClick={() => fileRef.current?.click()}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity cursor-pointer">
                  <Camera className="w-6 h-6 text-white" />
                </button>
              </div>

              <input ref={fileRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />

              {preview && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2 w-full">
                  <Button onClick={handleUpload} disabled={uploading} className="flex-1">
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : uploaded ? <Check className="w-4 h-4 mr-2" /> : null}
                    {uploading ? 'Uploading...' : uploaded ? 'Uploaded!' : 'Upload Photo'}
                  </Button>
                  <Button variant="secondary" onClick={() => { setPreview(null); if (fileRef.current) fileRef.current.value = ''; }}>
                    Cancel
                  </Button>
                </motion.div>
              )}

              {!preview && (
                <Button variant="secondary" className="w-full" onClick={() => fileRef.current?.click()}>
                  <Camera className="w-4 h-4 mr-2" /> Choose Photo
                </Button>
              )}

              <p className="text-xs mt-3" style={{ color: colors.textMuted }}>JPG, PNG or WebP. Max 5MB.</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
