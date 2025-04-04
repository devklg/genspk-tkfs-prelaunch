import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import DashboardLayout from '../components/layouts/DashboardLayout'
import StatCard from '../components/dashboard/StatCard'
import ReferralList from '../components/dashboard/ReferralList'
import NotificationFeed from '../components/dashboard/NotificationFeed'
import VideoPlayer from '../components/common/VideoPlayer'
import LeaderboardWidget from '../components/dashboard/LeaderboardWidget'
import CountdownTimer from '../components/dashboard/CountdownTimer'
import ShareTools from '../components/dashboard/ShareTools'
import CompPlanTraining from '../components/training/CompPlanTraining'
import ProfileForm from '../components/forms/ProfileForm'
import { fetchDashboardStats } from '../redux/dashboard/dashboardSlice'
import { fetchNotifications } from '../redux/notifications/notificationSlice'

const UserDashboard = () => {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { stats, isLoading } = useSelector(state => state.dashboard)
  const { notifications } = useSelector(state => state.notifications)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    dispatch(fetchDashboardStats())
    dispatch(fetchNotifications())
    
    // Set up real-time updates (could use WebSockets in a real implementation)
    const interval = setInterval(() => {
      dispatch(fetchNotifications())
    }, 30000) // Every 30 seconds
    
    return () => clearInterval(interval)
  }, [dispatch])

  // Generate referral links with current user's ID
  const referralLinks = {
    getpaidn1minute: `https://getpaidn1minute.com/enroll?ref=${user?.id}`,
    magnwm: `https://magnwm.com/enroll?ref=${user?.id}`,
    joinkevn: `https://joinkevn.online/enroll?ref=${user?.id}`,
    womp: `https://womp.pro/enroll?ref=${user?.id}`
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col lg:flex-row justify-between mb-6 items-center">
        <h1 className="text-3xl font-bold text-blue-400">
          Welcome, {user?.firstName}!
        </h1>
        <CountdownTimer deadline="2025-04-18T00:00:00Z" label="Pre-Enrollment Ends In:" />
      </div>
      
      <div className="mb-6 bg-gray-800 rounded-lg overflow-hidden">
        <nav className="flex">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-3 w-full md:w-auto text-center ${
              activeTab === 'overview' ? 'bg-blue-700 text-white' : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('training')}
            className={`px-4 py-3 w-full md:w-auto text-center ${
              activeTab === 'training' ? 'bg-blue-700 text-white' : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            Training
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-3 w-full md:w-auto text-center ${
              activeTab === 'profile' ? 'bg-blue-700 text-white' : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            My Profile
          </button>
          <button
            onClick={() => setActiveTab('share')}
            className={`px-4 py-3 w-full md:w-auto text-center ${
              activeTab === 'share' ? 'bg-blue-700 text-white' : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            Share Tools
          </button>
        </nav>
      </div>
      
      /* Tab Content */
      {activeTab === 'overview' && (
        <div className="space-y-6">
          /* Stats Row */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Your Position"
              value={stats?.positionNumber || 'N/A'}
              icon="user"
              color="blue"
            />
            <StatCard
              title="People Enrolled"
              value={stats?.directReferrals || '0'}
              icon="users"
              color="green"
            />
            <StatCard
              title="Team Size"
              value={stats?.teamSize || '0'}
              icon="network-wired"
              color="purple"
            />
            <StatCard
              title="Days Until Launch"
              value={stats?.daysUntilLaunch || '0'}
              icon="calendar"
              color="yellow"
            />
          </div>
          
          /* Main Content */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            /* Left Column */
            <div className="lg:col-span-2 space-y-6">
              /* Video Player */
              <div className="bg-gray-800 rounded-lg p-4">
                <h2 className="text-xl font-semibold mb-4 text-white">Talk Fusion Opportunity</h2>
                <VideoPlayer videoId="HW6NqKkbs6M" />
              </div>
              
              /* Referrals */
              <ReferralList referrals={stats?.recentReferrals || []} />
            </div>
            
            /* Right Column */
            <div className="space-y-6">
              /* Leaderboard */
              <LeaderboardWidget />
              
              /* Activity Feed */
              <NotificationFeed notifications={notifications} />
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'training' && (
        <CompPlanTraining />
      )}
      
      {activeTab === 'profile' && (
        <ProfileForm user={user} />
      )}
      
      {activeTab === 'share' && (
        <ShareTools referralLinks={referralLinks} />
      )}
    </DashboardLayout>
  )
}

export default UserDashboard