import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import enrolleeService from '@services/enrolleeService'

const initialState = {
  enrollees: [],
  enrollee: null,
  isLoading: false,
  error: null,
  success: false,
  totalCount: 0,
  pageCount: 1
}

// Get all enrollees with pagination
export const getEnrollees = createAsyncThunk(
  'enrollees/getAll',
  async ({ page = 1, limit = 10, search = '' }, thunkAPI) => {
    try {
      return await enrolleeService.getEnrollees(page, limit, search)
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch enrollees'
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Get enrollee by ID
export const getEnrolleeById = createAsyncThunk(
  'enrollees/getById',
  async (id, thunkAPI) => {
    try {
      return await enrolleeService.getEnrolleeById(id)
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to fetch enrollee'
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Create new enrollee
export const createEnrollee = createAsyncThunk(
  'enrollees/create',
  async (enrolleeData, thunkAPI) => {
    try {
      return await enrolleeService.createEnrollee(enrolleeData)
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to create enrollee'
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Update enrollee
export const updateEnrollee = createAsyncThunk(
  'enrollees/update',
  async ({ id, enrolleeData }, thunkAPI) => {
    try {
      return await enrolleeService.updateEnrollee(id, enrolleeData)
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to update enrollee'
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Delete enrollee
export const deleteEnrollee = createAsyncThunk(
  'enrollees/delete',
  async (id, thunkAPI) => {
    try {
      await enrolleeService.deleteEnrollee(id)
      return id
    } catch (error) {
      const message = error.response?.data?.message || error.message || 'Failed to delete enrollee'
      return thunkAPI.rejectWithValue(message)
    }
  }
)

const enrolleeSlice = createSlice({
  name: 'enrollees',
  initialState,
  reducers: {
    resetEnrolleeState: (state) => {
      state.enrollee = null
      state.isLoading = false
      state.error = null
      state.success = false
    }
  },
  extraReducers: (builder) => {
    builder
      // Get all enrollees cases
      .addCase(getEnrollees.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getEnrollees.fulfilled, (state, action) => {
        state.isLoading = false
        state.enrollees = action.payload.enrollees
        state.totalCount = action.payload.totalCount
        state.pageCount = action.payload.pageCount
      })
      .addCase(getEnrollees.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      
      // Other action cases would follow the same pattern
      // ... (including getEnrolleeById, createEnrollee, updateEnrollee, deleteEnrollee)
  }
})

export const { resetEnrolleeState } = enrolleeSlice.actions
export default enrolleeSlice.reducer
