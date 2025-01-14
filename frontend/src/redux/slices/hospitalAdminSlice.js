import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

// Async Thunks
export const fetchHospitalData = createAsyncThunk(
  'hospitalAdmin/fetchHospitalData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getHospitalData();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchDataCollectors = createAsyncThunk(
  'hospitalAdmin/fetchDataCollectors',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getHospitalDataCollectors();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleUserStatus = createAsyncThunk(
  'hospitalAdmin/toggleUserStatus',
  async ({ userId, status }, { rejectWithValue }) => {
    try {
      const response = await api.toggleDataCollectorStatus(userId, status);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const exportHospitalData = createAsyncThunk(
  'hospitalAdmin/exportData',
  async ({ dataType, filters }, { rejectWithValue }) => {
    try {
      const response = await api.exportHospitalData(dataType, filters);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchHospitalMISReports = createAsyncThunk(
  'hospitalAdmin/fetchMISReports',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getHospitalMISReports();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const createDataCollector = createAsyncThunk(
    'hospitalAdmin/createDataCollector',
    async (userData, { rejectWithValue }) => {
      try {
        const response = await api.createDataCollector(userData);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );
  
const initialState = {
  verifiedData: {
    incidence: [],
    mortality: []
  },
  dataCollectors: [],
  misReports: {
    registrationStats: {
      total: 0,
      verified: 0,
      pending: 0
    },
    mortalityStats: {
      total: 0,
      verified: 0
    },
    dataCollectorStats: {
      total: 0,
      active: 0
    },
    monthlyTrends: []
  },
  loading: {
    data: false,
    users: false,
    export: false,
    reports: false
  },
  error: {
    data: null,
    users: null,
    export: null,
    reports: null
  },
  lastExport: null
};

const hospitalAdminSlice = createSlice({
  name: 'hospitalAdmin',
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
      // Hospital Data
      .addCase(fetchHospitalData.pending, (state) => {
        state.loading.data = true;
      })
      .addCase(fetchHospitalData.fulfilled, (state, action) => {
        state.loading.data = false;
        state.verifiedData = action.payload;
      })
      .addCase(fetchHospitalData.rejected, (state, action) => {
        state.loading.data = false;
        state.error.data = action.payload;
      })

      // Data Collectors
      .addCase(fetchDataCollectors.pending, (state) => {
        state.loading.users = true;
      })
      .addCase(fetchDataCollectors.fulfilled, (state, action) => {
        state.loading.users = false;
        state.dataCollectors = action.payload;
      })
      .addCase(fetchDataCollectors.rejected, (state, action) => {
        state.loading.users = false;
        state.error.users = action.payload;
      })

      // Toggle User Status
      .addCase(toggleUserStatus.pending, (state) => {
        state.loading.users = true;
      })
      .addCase(toggleUserStatus.fulfilled, (state, action) => {
        state.loading.users = false;
        const index = state.dataCollectors.findIndex(dc => dc.id === action.payload.id);
        if (index !== -1) {
          state.dataCollectors[index] = action.payload;
        }
      })
      .addCase(toggleUserStatus.rejected, (state, action) => {
        state.loading.users = false;
        state.error.users = action.payload;
      })

      // Export Data
      .addCase(exportHospitalData.pending, (state) => {
        state.loading.export = true;
      })
      .addCase(exportHospitalData.fulfilled, (state) => {
        state.loading.export = false;
        state.lastExport = new Date().toISOString();
      })
      .addCase(exportHospitalData.rejected, (state, action) => {
        state.loading.export = false;
        state.error.export = action.payload;
      })

      // MIS Reports
      .addCase(fetchHospitalMISReports.pending, (state) => {
        state.loading.reports = true;
      })
      .addCase(fetchHospitalMISReports.fulfilled, (state, action) => {
        state.loading.reports = false;
        state.misReports = action.payload;
      })
      .addCase(fetchHospitalMISReports.rejected, (state, action) => {
        state.loading.reports = false;
        state.error.reports = action.payload;
      })
      //Create Data Collector
      .addCase(createDataCollector.pending, (state) => {
        state.loading.users = true;
        state.error.users = null;
      })
      .addCase(createDataCollector.fulfilled, (state, action) => {
        state.loading.users = false;
        state.dataCollectors.push(action.payload);
      })
      .addCase(createDataCollector.rejected, (state, action) => {
        state.loading.users = false;
        state.error.users = action.payload;
      });
  }
});

// Selectors
export const selectVerifiedData = (state) => state.hospitalAdmin.verifiedData;
export const selectDataCollectors = (state) => state.hospitalAdmin.dataCollectors;
export const selectMISReports = (state) => state.hospitalAdmin.misReports;
export const selectLoading = (state) => state.hospitalAdmin.loading;
export const selectError = (state) => state.hospitalAdmin.error;
export const { clearErrors, resetExport } = hospitalAdminSlice.actions;
export default hospitalAdminSlice.reducer;