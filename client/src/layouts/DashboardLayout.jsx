import { useState } from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../store/slices/authSlice'

// Icons
import {
    HomeIcon,
    UserIcon,
    BellIcon,
    ChartBarIcon,
    UsersIcon,
    Cog6ToothIcon,
    ArrowLeftOnRectangleIcon,
    Bars3Icon,
    XMarkIcon
} from '@heroicons/react/24/outline'

const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { user } = useSelector(state => state.auth)

    const isAdmin = user?.role === 'admin'

    const userNavLinks = [
        { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
        { name: 'Profile', href: '/dashboard/profile', icon: UserIcon },
        { name: 'Notifications', href: '/dashboard/notifications', icon: BellIcon },
    ]

    const adminNavLinks = [
        { name: 'Dashboard', href: '/admin', icon: HomeIcon },
        { name: 'Enrollees', href: '/admin/enrollees', icon: UsersIcon },
        { name: 'Reports', href: '/admin/reports', icon: ChartBarIcon },
        { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon },
    ]

    const navLinks = isAdmin ? adminNavLinks : userNavLinks

    const handleLogout = async () => {
        await dispatch(logout())
        navigate('/login')
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Sidebar for mobile */}
            <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? '' : 'hidden'}`}>
                {/* Overlay */}
                <div
                    className="fixed inset-0 bg-gray-600 bg-opacity-75"
                    onClick={() => setSidebarOpen(false)}
                />

                {/* Sidebar */}
                <div className="relative flex flex-col w-64 min-h-screen py-4 bg-white">
                    <div className="flex items-center justify-between px-4">
                        <h1 className="text-xl font-bold text-primary-600">Kevin's Konga</h1>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="p-1 text-gray-500 rounded-md hover:bg-gray-100"
                        >
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>

                    <nav className="flex-1 px-2 mt-5 space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.href}
                                className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 hover:text-primary-600"
                            >
                                <link.icon className="w-5 h-5 mr-3" />
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    <div className="px-2 mt-auto">
                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 hover:text-primary-600"
                        >
                            <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-3" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Static sidebar for desktop */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64">
                <div className="flex flex-col min-h-screen py-4 bg-white">
                    <div className="px-4">
                        <h1 className="text-xl font-bold text-primary-600">Kevin's Konga</h1>
                    </div>

                    <nav className="flex-1 px-2 mt-5 space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.href}
                                className="flex items-center px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 hover:text-primary-600"
                            >
                                <link.icon className="w-5 h-5 mr-3" />
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    <div className="px-2 mt-auto">
                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 hover:text-primary-600"
                        >
                            <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-3" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Top bar */}
                <div className="sticky top-0 z-10 flex items-center justify-between h-16 px-4 bg-white shadow-sm lg:hidden">
                    <h1 className="text-xl font-bold text-primary-600">Kevin's Konga</h1>
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-1 text-gray-500 rounded-md hover:bg-gray-100"
                    >
                        <Bars3Icon className="w-6 h-6" />
                    </button>
                </div>

                {/* Main content area */}
                <main className="py-6">
                    <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    )
}

export default DashboardLayout