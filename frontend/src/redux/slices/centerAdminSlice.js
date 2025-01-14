import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

// Async Thunks

export const fetchApprovedUsers = createAsyncThunk(
    'centerAdmin/fetchApprovedUsers',
    async (_, { rejectWithValue }) => {
      try {
        const response = await api.getApprovedUsers();
        return response.data;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
);
  
export const fetchApprovedHospitals = createAsyncThunk(
    'centerAdmin/fetchApprovedHospitals',
    async (_, { rejectWithValue }) => {
      try {
        const response = await api.getApprovedHospitals();
        return response.data;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
);

export const fetchPendingUsers = createAsyncThunk(
  'centerAdmin/fetchPendingUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getPendingUsers();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const approveUser = createAsyncThunk(
  'centerAdmin/approveUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.approveUser(userId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createUser = createAsyncThunk(
  'centerAdmin/createUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.createUser(userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchDistrictData = createAsyncThunk(
  'centerAdmin/fetchDistrictData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getDistrictData();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const fetchCenterDetails = createAsyncThunk(
   'centerAdmin/fetchCenterDetails',
  async (_, { rejectWithValue }) => {
    try {
        const response = await api.getCenterDetails();
        return response.data;
    } catch (error) {
        return rejectWithValue(error.message);
    }
  }
);

export const reviewData = createAsyncThunk(
  'centerAdmin/reviewData',
  async ({ dataId, reviewData }, { rejectWithValue }) => {
    try {
      const response = await api.reviewData(dataId, reviewData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchMISReports = createAsyncThunk(
  'centerAdmin/fetchMISReports',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getCenterMISReports();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const exportData = createAsyncThunk(
  'centerAdmin/exportData',
  async ({ type, filters }, { rejectWithValue }) => {
    try {
      const response = await api.exportCenterData(type, filters);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


const initialState = {
  pendingUsers: [],
  districtData: [],
  approvedUsers: [],
  approvedHospitals: [],
  districtWiseStats: {}, // Will store stats per district
  currentCenter: null, // Will store the current center's data including assigned districts
  
  verifiedData: {
    incidence: [],
    mortality: []
  },
  misReports: null,
  loading: {
    users: false,
    data: false,
    export: false,
    review: false,
    reports: false,
    centerDetails: false

  },
  error: {
    users: null,
    data: null,
    export: null,
    review: null,
    centerDetails: null,
    reports: null
  },
  success: {
    userCreation: false,
    dataReview: false,
    export: false
  }
};

const centerAdminSlice = createSlice({
  name: 'centerAdmin',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = initialState.error;
    },
    clearSuccess: (state) => {
      state.success = initialState.success;
    }
  },
  extraReducers: (builder) => {
    builder
      // Pending Users
      .addCase(fetchPendingUsers.pending, (state) => {
        state.loading.users = true;
      })
      .addCase(fetchPendingUsers.fulfilled, (state, action) => {
        state.loading.users = false;
        state.pendingUsers = action.payload;
      })
      .addCase(fetchPendingUsers.rejected, (state, action) => {
        state.loading.users = false;
        state.error.users = action.payload;
      })

      // Approve User
      .addCase(approveUser.pending, (state) => {
        state.loading.users = true;
      })
      .addCase(approveUser.fulfilled, (state, action) => {
        state.loading.users = false;
        state.pendingUsers = state.pendingUsers.filter(
          user => user.id !== action.payload.id
        );
      })
      .addCase(approveUser.rejected, (state, action) => {
        state.loading.users = false;
        state.error.users = action.payload;
      })
       // Fetch Approved Users and Hospitals
      .addCase(fetchApprovedUsers.fulfilled, (state, action) => {
        state.loading.users = false;
        state.approvedUsers = action.payload;
      })
      .addCase(fetchApprovedHospitals.fulfilled, (state, action) => {
        state.loading.users = false;
        state.approvedHospitals = action.payload;
      })

      // Create User
      .addCase(createUser.pending, (state) => {
        state.loading.users = true;
      })
      .addCase(createUser.fulfilled, (state) => {
        state.loading.users = false;
        state.success.userCreation = true;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading.users = false;
        state.error.users = action.payload;
      })

      // District Data
      .addCase(fetchDistrictData.pending, (state) => {
        state.loading.data = true;
      })
      .addCase(fetchDistrictData.fulfilled, (state, action) => {
        state.loading.data = false;
        state.districtData = action.payload;
      })
      .addCase(fetchDistrictData.rejected, (state, action) => {
        state.loading.data = false;
        state.error.data = action.payload;
      })

      // Review Data
      .addCase(reviewData.pending, (state) => {
        state.loading.review = true;
      })
      .addCase(reviewData.fulfilled, (state) => {
        state.loading.review = false;
        state.success.dataReview = true;
      })
      .addCase(reviewData.rejected, (state, action) => {
        state.loading.review = false;
        state.error.review = action.payload;
      })

      // MIS Reports
      .addCase(fetchMISReports.pending, (state) => {
        state.loading.reports = true;
      })
      .addCase(fetchMISReports.fulfilled, (state, action) => {
        state.loading.reports = false;
        state.misReports = action.payload;
      })
      .addCase(fetchMISReports.rejected, (state, action) => {
        state.loading.reports = false;
        state.error.reports = action.payload;
      })

      // Export Data
      .addCase(exportData.pending, (state) => {
        state.loading.export = true;
      })
      .addCase(exportData.fulfilled, (state) => {
        state.loading.export = false;
        state.success.export = true;
      })
      .addCase(exportData.rejected, (state, action) => {
        state.loading.export = false;
        state.error.export = action.payload;
      })
      // Center Details
      .addCase(fetchCenterDetails.pending, (state) => {
        state.loading.centerDetails = true;
        state.error.centerDetails = null;
      })
      .addCase(fetchCenterDetails.fulfilled, (state, action) => {
        state.loading.centerDetails = false;
        state.currentCenter = action.payload;
      })
      .addCase(fetchCenterDetails.rejected, (state, action) => {
        state.loading.centerDetails = false;
        state.error.centerDetails = action.payload;
      })
  }
});

export const { clearErrors, clearSuccess } = centerAdminSlice.actions;

// Selectors
export const selectPendingUsers = (state) => state.centerAdmin.pendingUsers;
export const selectDistrictData = (state) => state.centerAdmin.districtData;
export const selectMISReports = (state) => state.centerAdmin.misReports;
export const selectLoading = (state) => state.centerAdmin.loading;
export const selectError = (state) => state.centerAdmin.error;
export const selectSuccess = (state) => state.centerAdmin.success;
export const selectApprovedUsers = (state) => state.centerAdmin.approvedUsers;
export const selectApprovedHospitals = (state) => state.centerAdmin.approvedHospitals;
export const selectCurrentCenter = (state) => state.centerAdmin.currentCenter;
// Helper selector to get districts with their hospital counts
export const selectDistrictHospitals = (state) => {
    const hospitals = state.centerAdmin.approvedHospitals;
    return hospitals.reduce((acc, hospital) => {
      if (!acc[hospital.region]) {
        acc[hospital.region] = [];
      }
      acc[hospital.region].push(hospital);
      return acc;
    }, {});
  };
  
  // Helper selector to get all unique districts that have hospitals
  export const selectDistrictsWithHospitals = (state) => {
    const hospitals = state.centerAdmin.approvedHospitals;
    return [...new Set(hospitals.map(hospital => hospital.region))];
  };
  
  // Helper selector to get hospitals by district
  export const selectHospitalsByDistrict = (state, district) => {
    return state.centerAdmin.approvedHospitals.filter(
      hospital => hospital.region === district
    );
  };


export default centerAdminSlice.reducer;