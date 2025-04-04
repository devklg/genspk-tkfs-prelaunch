import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchDashboardStats, fetchRecentEnrollments } from '@store/admin/adminSlice'
import StatCard from '@components/admin/StatCard'
import EnrollmentTable from '@components/admin/EnrollmentTable'
import DashboardChart from '@components/admin/DashboardChart'
import PrintButton from '@components/shared/PrintButton'

import { 
  UserIcon, 
  UsersIcon, 
  ChartBarIcon, 
  CalendarIcon 
} from '@heroicons/react/24/outline'

function AdminDashboard() {
  const dispatch = useDispatch()
  const { stats, recentEnrollments, loading, error } = useSelector(state => state.admin)
  
  useEffect(() => {
    dispatch(fetchDashboardStats())
    dispatch(fetchRecentEnrollments())
  }, [dispatch])
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-gold"></div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="bg-red-500 bg-opacity-10 border border-red-500 text-red-500 p-4 rounded-lg">
        Error loading dashboard data: {error}
      </div>
    )
  }
  
  return (
    <div id="admin-dashboard" className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary-gold">Admin Dashboard</h1>
        <PrintButton targetId="admin-dashboard" filename="admin-dashboard-report" />
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Pre-Enrollees" 
          value={stats.totalEnrollees} 
          icon={<UserIcon className="h-6 w-6" />}
          change={stats.enrolleesChange}
          changeType={stats.enrolleesChange >= 0 ? 'positive' : 'negative'}
        />
        <StatCard 
          title="Active Today" 
          value={stats.activeToday} 
          icon={<UsersIcon className="h-6 w-6" />}
          change={stats.activeTodayChange}
          changeType={stats.activeTodayChange >= 0 ? 'positive' : 'negative'}
        />
        <StatCard 
          title="Conversion Rate" 
          value={`${stats.conversionRate}%`} 
          icon={<ChartBarIcon className="h-6 w-6" />}
          change={stats.conversionRateChange}
          changeType={stats.conversionRateChange >= 0 ? 'positive' : 'negative'}
        />
        <StatCard 
          title="Days Until Launch" 
          value={stats.daysUntilLaunch} 
          icon={<CalendarIcon className="h-6 w-6" />}
        />
      </div>
      
      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-background-darker rounded-lg p-4 shadow-card-dark">
          <h2 className="text-lg font-semibold text-primary-gold mb-4">Enrollment Trends</h2>
          <DashboardChart data={stats.enrollmentTrends} />
        </div>
        
        <div className="bg-background-darker rounded-lg p-4 shadow-card-dark">
          <h2 className="text-lg font-semibold text-primary-gold mb-4">Recent Enrollments</h2>
          <EnrollmentTable enrollments={recentEnrollments} />
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard