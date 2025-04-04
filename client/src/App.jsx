import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { checkAuthStatus } from './store/slices/authSlice'

// Layouts
import DashboardLayout from './layouts/DashboardLayout'

// Pages
import LandingPage from './pages/LandingPage'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import UserDashboard from './pages/dashboard/UserDashboard'
import AdminDashboard from './pages/dashboard/AdminDashboard'
import NotFound from './pages/NotFound'

// Components
import ProtectedRoute from './components/auth/ProtectedRoute'
import AdminRoute from './components/auth/AdminRoute'

function App() {
    const dispatch = useDispatch()
    const { isAuthenticated, user } = useSelector(state => state.auth)

    useEffect(() => {
        dispatch(checkAuthStatus())
    }, [dispatch])

    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route
                path="/login"
                element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
            />
            <Route
                path="/register"
                element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />}
            />

            {/* Protected User Routes */}
            <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                    <Route path="/dashboard" element={<UserDashboard />} />
                    <Route path="/profile" element={<Navigate to="/dashboard/profile" />} />
                    <Route path="/dashboard/profile" element={<UserDashboard />} />
                    <Route path="/dashboard/notifications" element={<UserDashboard />} />
                </Route>
            </Route>

            {/* Protected Admin Routes */}
            <Route element={<AdminRoute />}>
                <Route element={<DashboardLayout />}>
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/enrollees" element={<AdminDashboard />} />
                    <Route path="/admin/reports" element={<AdminDashboard />} />
                    <Route path="/admin/settings" element={<AdminDashboard />} />
                </Route>
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}

export default App
