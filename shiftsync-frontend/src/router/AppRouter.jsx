import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/layout/ProtectedRoute.jsx';
import AppLayout from '../components/layout/AppLayout.jsx';

import Login from '../pages/auth/Login.jsx';
import Register from '../pages/auth/Register.jsx';
import Unauthorized from '../pages/auth/Unauthorized.jsx';

import AdminDashboard from '../pages/admin/Dashboard.jsx';
import ManageFacilities from '../pages/admin/ManageFacilities.jsx';
import ManageWorkers from '../pages/admin/ManageWorkers.jsx';
import AllShifts from '../pages/admin/AllShifts.jsx';
import PlatformAnalytics from '../pages/admin/PlatformAnalytics.jsx';
import AdminCalendar from '../pages/admin/Calendar.jsx';

import FacilityDashboard from '../pages/facility/Dashboard.jsx';
import PostShift from '../pages/facility/PostShift.jsx';
import MyShifts from '../pages/facility/MyShifts.jsx';
import FacilityCalendar from '../pages/facility/Calendar.jsx';
import WorkerApplications from '../pages/facility/WorkerApplications.jsx';
import FacilityAnalytics from '../pages/facility/FacilityAnalytics.jsx';

import WorkerDashboard from '../pages/worker/Dashboard.jsx';
import FindShifts from '../pages/worker/FindShifts.jsx';
import MySchedule from '../pages/worker/MySchedule.jsx';
import MyCalendar from '../pages/worker/MyCalendar.jsx';
import Timesheets from '../pages/worker/Timesheets.jsx';
import Profile from '../pages/worker/Profile.jsx';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="facilities" element={<ManageFacilities />} />
          <Route path="workers" element={<ManageWorkers />} />
          <Route path="shifts" element={<AllShifts />} />
          <Route path="analytics" element={<PlatformAnalytics />} />
          <Route path="calendar" element={<AdminCalendar />} />
        </Route>

        <Route
          path="/facility/*"
          element={
            <ProtectedRoute allowedRoles={['facility', 'admin']}>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<FacilityDashboard />} />
          <Route path="post-shift" element={<PostShift />} />
          <Route path="shifts" element={<MyShifts />} />
          <Route path="calendar" element={<FacilityCalendar />} />
          <Route path="applications" element={<WorkerApplications />} />
          <Route path="analytics" element={<FacilityAnalytics />} />
        </Route>

        <Route
          path="/worker/*"
          element={
            <ProtectedRoute allowedRoles={['worker']}>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<WorkerDashboard />} />
          <Route path="find-shifts" element={<FindShifts />} />
          <Route path="schedule" element={<MySchedule />} />
          <Route path="calendar" element={<MyCalendar />} />
          <Route path="timesheets" element={<Timesheets />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
