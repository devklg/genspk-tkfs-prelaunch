import { configureStore } from '@reduxjs/toolkit'
import authReducer from './auth/authSlice'
import enrolleeReducer from './enrollees/enrolleeSlice'
import notificationReducer from './notifications/notificationSlice'
import dashboardReducer from './dashboard/dashboardSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    enrollees: enrolleeReducer,
    notifications: notificationReducer,
    dashboard: dashboardReducer
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({
      serializableCheck: false
    })
});

export default store;
