import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts & Guards
import AuthLayout from './components/layout/AuthLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleRoute from './routes/RoleRoute';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProviderRegister from './pages/auth/ProviderRegister';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import VerifyOTP from './pages/auth/VerifyOTP';
import LandingPage from './pages/LandingPage';

// Dashboard Pages
import Dashboard from './pages/student/Dashboard';
import Profile from './pages/student/Profile';
import Scholarships from './pages/student/Scholarships';
import ScholarshipDetail from './pages/student/ScholarshipDetail';
import SavedScholarships from './pages/student/SavedScholarships';

// Provider Pages
import ProviderDashboard from './pages/provider/ProviderDashboard';
import ManageScholarships from './pages/provider/ManageScholarships';
import CreateScholarship from './pages/provider/CreateScholarship';
import ApplicationsList from './pages/provider/ApplicationsList';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import AdminScholarships from './pages/admin/AdminScholarships';
const DashboardPlaceholder = ({ title }) => (
  <div className="flex items-center justify-center h-full bg-background text-foreground">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-primary mb-4">{title}</h1>
      <p className="text-slate-400">Dashboard under construction.</p>
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public / Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register/provider" element={<ProviderRegister />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />
          </Route>
          {/* Landing page at root, outside AuthLayout */}
          <Route path="/" element={<LandingPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            
            {/* Student Routes */}
            <Route element={<RoleRoute allowedRoles={['student']} />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/scholarships" element={<Scholarships />} />
                <Route path="/scholarships/:id" element={<ScholarshipDetail />} />
                <Route path="/saved" element={<SavedScholarships />} />
              </Route>
            </Route>

            {/* Provider Routes */}
            <Route element={<RoleRoute allowedRoles={['provider']} />}>
              <Route element={<DashboardLayout />}>
                <Route path="/provider/dashboard" element={<ProviderDashboard />} />
                <Route path="/provider/scholarships" element={<ManageScholarships />} />
                <Route path="/provider/scholarships/new" element={<CreateScholarship />} />
                <Route path="/provider/applications" element={<ApplicationsList />} />
              </Route>
            </Route>

            {/* Admin Routes */}
            <Route element={<RoleRoute allowedRoles={['admin']} />}>
              <Route element={<DashboardLayout />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<ManageUsers />} />
                <Route path="/admin/scholarships" element={<AdminScholarships />} />
              </Route>
            </Route>
            
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
