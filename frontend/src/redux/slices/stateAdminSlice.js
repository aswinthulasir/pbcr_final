import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

// Async Thunks
export const fetchPendingCenters = createAsyncThunk(
  'stateAdmin/fetchPendingCenters',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getPendingCenters();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const approveCenter = createAsyncThunk(
  'stateAdmin/approveCenter',
  async (centerId, { rejectWithValue }) => {
    try {
      const response = await api.approveCenter(centerId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createApexCenter = createAsyncThunk(
  'stateAdmin/createApexCenter',
  async (centerData, { rejectWithValue }) => {
    try {
      const response = await api.createApexCenter(centerData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchVerifiedData = createAsyncThunk(
  'stateAdmin/fetchVerifiedData',
  async ({ dataType }, { rejectWithValue }) => {
    try {
      const response = await api.getVerifiedData(dataType);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const exportData = createAsyncThunk(
  'stateAdmin/exportData',
  async ({ dataType, filters }, { rejectWithValue }) => {
    try {
      const response = await api.exportData(dataType, filters);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMISReports = createAsyncThunk(
  'stateAdmin/fetchMISReports',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getMISReports();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const fetchApprovedCenters = createAsyncThunk(
  'stateAdmin/fetchApprovedCenters',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getApprovedCenters();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


const initialState = {
  pendingCenters: [],
  approvedCenters: [], // Add this line
  verifiedData: {
    incidence: [],
    mortality: []
  },
  misReports: {
    centerStats: {
      total: 0,
      approved: 0,
      pending: 0
    },
    patientStats: {
      total: 0,
      verified: 0
    },
    mortalityStats: {
      total: 0,
      verified: 0
    },
    monthlyTrends: [
      { month: 'Jan', registrations: 0, mortality: 0 },
      { month: 'Feb', registrations: 0, mortality: 0 },
      { month: 'Mar', registrations: 0, mortality: 0 }
    ]
  },
  loading: {
    centers: false,
    approval: false,
    creation: false,
    data: false,
    export: false,
    reports: false
  },
  error: {
    centers: null,
    approval: null,
    creation: null,
    data: null,
    export: null,
    reports: null
  },
  lastExport: null
};

export const selectMISReports = (state) => state.stateAdmin.misReports;
export const selectApprovedCenters = (state) => state.stateAdmin.approvedCenters;
export const selectLoadingState = (state) => state.stateAdmin.loading;
export const selectErrors = (state) => state.stateAdmin.error;
const stateAdminSlice = createSlice({
  name: 'stateAdmin',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = initialState.error;
    },
    resetExport: (state) => {
      state.lastExport = null;
      state.error.export = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Pending Centers
      .addCase(fetchPendingCenters.pending, (state) => {
        state.loading.centers = true;
        state.error.centers = null;
      })
      .addCase(fetchPendingCenters.fulfilled, (state, action) => {
        state.loading.centers = false;
        state.pendingCenters = action.payload;
      })
      .addCase(fetchPendingCenters.rejected, (state, action) => {
        state.loading.centers = false;
        state.error.centers = action.payload;
      })

      // Approved Centers
      .addCase(fetchApprovedCenters.pending, (state) => {
        state.loading.centers = true;
        state.error.centers = null;
      })
      .addCase(fetchApprovedCenters.fulfilled, (state, action) => {
        state.loading.centers = false;
        state.approvedCenters = action.payload;
      })
      .addCase(fetchApprovedCenters.rejected, (state, action) => {
        state.loading.centers = false;
        state.error.centers = action.payload;
      })

      // Approve Center
      .addCase(approveCenter.pending, (state) => {
        state.loading.approval = true;
        state.error.approval = null;
      })
      .addCase(approveCenter.fulfilled, (state, action) => {
        state.loading.approval = false;
        state.pendingCenters = state.pendingCenters.filter(
          center => center.id !== action.payload.id
        );
      })
      .addCase(approveCenter.rejected, (state, action) => {
        state.loading.approval = false;
        state.error.approval = action.payload;
      })

      // Create Center
      .addCase(createApexCenter.pending, (state) => {
        state.loading.creation = true;
        state.error.creation = null;
      })
      .addCase(createApexCenter.fulfilled, (state) => {
        state.loading.creation = false;
      })
      .addCase(createApexCenter.rejected, (state, action) => {
        state.loading.creation = false;
        state.error.creation = action.payload;
      })

      // Fetch Verified Data
      .addCase(fetchVerifiedData.pending, (state) => {
        state.loading.data = true;
        state.error.data = null;
      })
      .addCase(fetchVerifiedData.fulfilled, (state, action) => {
        state.loading.data = false;
        state.verifiedData[action.payload.type] = action.payload.data;
      })
      .addCase(fetchVerifiedData.rejected, (state, action) => {
        state.loading.data = false;
        state.error.data = action.payload;
      })

      // Export Data
      .addCase(exportData.pending, (state) => {
        state.loading.export = true;
        state.error.export = null;
      })
      .addCase(exportData.fulfilled, (state) => {
        state.loading.export = false;
        state.lastExport = new Date().toISOString();
      })
      .addCase(exportData.rejected, (state, action) => {
        state.loading.export = false;
        state.error.export = action.payload;
      })

      // MIS Reports
      .addCase(fetchMISReports.pending, (state) => {
        state.loading.reports = true;
        state.error.reports = null;
        console.log('Fetching MIS Reports...'); // Debug log
      })
      .addCase(fetchMISReports.fulfilled, (state, action) => {
        console.log('MIS Reports received:', action.payload); // Debug log
        state.loading.reports = false;
        // Ensure we have all required properties
        state.misReports = {
          centerStats: {
            total: action.payload?.centerStats?.total ?? 0,
            approved: action.payload?.centerStats?.approved ?? 0,
            pending: action.payload?.centerStats?.pending ?? 0
          },
          patientStats: {
            total: action.payload?.patientStats?.total ?? 0,
            verified: action.payload?.patientStats?.verified ?? 0
          },
          mortalityStats: {
            total: action.payload?.mortalityStats?.total ?? 0,
            verified: action.payload?.mortalityStats?.verified ?? 0
          },
          monthlyTrends: action.payload?.monthlyTrends || initialState.misReports.monthlyTrends
        };
        console.log('Updated MIS Reports state:', state.misReports); // Debug log
      })
      .addCase(fetchMISReports.rejected, (state, action) => {
        state.loading.reports = false;
        state.error.reports = action.payload;
        console.error('MIS Reports fetch failed:', action.payload); // Debug log
      })
  }
});

export const selectAllStateAdmin = (state) => state.stateAdmin;
export const selectPendingCenters = (state) => state.stateAdmin.pendingCenters;
export const selectVerifiedData = (state) => state.stateAdmin.verifiedData;

export const { clearErrors, resetExport } = stateAdminSlice.actions;
export default stateAdminSlice.reducer;