Admin dashboard component
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import DashboardLayout from '../components/layouts/DashboardLayout'
import StatCard from '../components/dashboard/StatCard'
import EnrolleeTable from '../components/admin/EnrolleeTable'
import EnrollmentChart from '../components/admin/EnrollmentChart'
import CountdownTimer from '../components/dashboard/CountdownTimer'
import ReportGenerator from '../components/admin/ReportGenerator'
import AdminActionCard from '../components/admin/AdminActionCard'
import Spinner from '../components/common/Spinner'
import { fetchAdminStats } from '../redux/dashboard/dashboardSlice'
import { getEnrollees } from '../redux/enrollees/enrolleeSlice'

const AdminDashboard = () => {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { adminStats, isLoading } = useSelector(state => state.dashboard)
  const { enrollees, totalCount } = useSelector(state => state.enrollees)
  const [activeTab, setActiveTab] = useState('overview')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('')

  useEffect(() => {
    dispatch(fetchAdminStats())
    dispatch(getEnrollees({ page, limit, search }))
  }, [dispatch, page, limit, search])

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(1) // Reset to first page on new search
  }

  const handlePrint = () => {
    window.print()
  }

  if (isLoading && !adminStats) {
    return <Spinner />
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col lg:flex-row justify-between mb-6 items-center">
        <div>
          <h1 className="text-3xl font-bold text-blue-400">Admin Dashboard</h1>
          <p className="text-gray-400">Welcome back, {user?.firstName}</p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center print:hidden"
          >
            <i className="fas fa-print mr-2"></i> Print Report
          </button>
          <CountdownTimer deadline="2025-04-18T00:00:00Z" label="Pre-Enrollment Ends:" />
        </div>
      </div>
      
      <div className="mb-6 bg-gray-800 rounded-lg overflow-hidden print:hidden">
        <nav className="flex flex-wrap">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-3 text-center ${
              activeTab === 'overview' ? 'bg-blue-700 text-white' : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('enrollees')}
            className={`px-4 py-3 text-center ${
              activeTab === 'enrollees' ? 'bg-blue-700 text-white' : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            Manage Enrollees
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-3 text-center ${
              activeTab === 'reports' ? 'bg-blue-700 text-white' : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            Reports
          </button>
        </nav>
      </div>
      
      /* Tab Content */
      {activeTab === 'overview' && (
        <div className="space-y-6">
          /* Stats Row */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Enrollees"
              value={adminStats?.totalEnrollees || '0'}
              icon="users"
              color="blue"
            />
            <StatCard
              title="New Today"
              value={adminStats?.newToday || '0'}
              icon="user-plus"
              color="green"
            />
            <StatCard
              title="Completion Rate"
              value={`${adminStats?.completionRate || '0'}%`}
              icon="chart-pie"
              color="purple"
            />
            <StatCard
              title="Days Until Launch"
              value={adminStats?.daysUntilLaunch || '0'}
              icon="calendar"
              color="yellow"
            />
          </div>
          
          /* Main Content */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            /* Left Column */
            <div className="lg:col-span-2 space-y-6">
              /* Enrollment Chart */
              <div className="bg-gray-800 rounded-lg p-4">
                <h2 className="text-xl font-semibold mb-4 text-white">Enrollment Trends</h2>
                <EnrollmentChart data={adminStats?.enrollmentTrends || []} />
              </div>
              
              /* Recent Enrollees */
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-white">Recent Enrollees</h2>
                  <Link to="/admin/enrollees" className="text-blue-400 hover:text-blue-300">
                    View All
                  </Link>
                </div>
                <EnrolleeTable
                  enrollees={enrollees.slice(0, 5)}
                  compact={true}
                />
              </div>
            </div>
            
            /* Right Column */
            <div className="space-y-6">
              /* Quick Actions */
              <div className="bg-gray-800 rounded-lg p-4">
                <h2 className="text-xl font-semibold mb-4 text-white">Quick Actions</h2>
                <div className="space-y-3">
                  <AdminActionCard
                    title="Add New Enrollee"
                    icon="user-plus"
                    color="green"
                    link="/admin/enrollees/new"
                  />
                  <AdminActionCard
                    title="Generate Report"
                    icon="file-alt"
                    color="blue"
                    link="/admin/reports"
                  />
                  <AdminActionCard
                    title="Export Data"
                    icon="download"
                    color="purple"
                    link="/admin/export"
                  />
                  <AdminActionCard
                    title="System Settings"
                    icon="cog"
                    color="gray"
                    link="/admin/settings"
                  />
                </div>
              </div>
              
              /* Package Stats */
              <div className="bg-gray-800 rounded-lg p-4">
                <h2 className="text-xl font-semibold mb-4 text-white">Package Distribution</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Starter Package</span>
                    <span className="text-white font-semibold">{adminStats?.packageStats?.starter || '0'}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${adminStats?.packagePercents?.starter || 0}%` }}></div>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-300">Elite Package</span>
                    <span className="text-white font-semibold">{adminStats?.packageStats?.elite || '0'}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: `${adminStats?.packagePercents?.elite || 0}%` }}></div>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-300">Pro Package</span>
                    <span className="text-white font-semibold">{adminStats?.packageStats?.pro || '0'}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${adminStats?.packagePercents?.pro || 0}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'enrollees' && (
        <div className="space-y-6">
          /* Search and filters */
          <div className="bg-gray-800 rounded-lg p-4">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search by name or email"
                  className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <button
                type="submit