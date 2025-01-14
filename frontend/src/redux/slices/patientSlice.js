import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/api';

// Async Thunks for Patient Management
export const fetchPatients = createAsyncThunk(
  'patient/fetchPatients',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getPatients();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const registerNewPatient = createAsyncThunk(
  'patient/registerNewPatient',
  async (patientData, { rejectWithValue }) => {
    try {
      const response = await api.addPatient(patientData);
      if (!response.success) {
        return rejectWithValue(response.message);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPatientsByStatus = createAsyncThunk(
  'patient/fetchPatientsByStatus',
  async (status, { rejectWithValue }) => {
    try {
      const response = await api.getPatientsByStatus(status);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


// Follow-up Thunks
export const fetchFollowUps = createAsyncThunk(
  'patient/fetchFollowUps',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getFollowUps();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addFollowUpRecord = createAsyncThunk(
  'patient/addFollowUp',
  async (followUpData, { rejectWithValue }) => {
    try {
      const response = await api.addFollowUp(followUpData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Mortality Record Thunks
export const fetchMortalityRecords = createAsyncThunk(
  'patient/fetchMortalityRecords',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.getMortalityRecords();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addMortalityRecord = createAsyncThunk(
  'patient/addMortalityRecord',
  async (mortalityData, { rejectWithValue }) => {
    try {
      const response = await api.addMortalityRecord(mortalityData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
const validatePatientForm = (data) => {
  const errors = {};
  
  // Mandatory field validation
  if (!data.centreName?.trim()) errors.centreName = 'Centre name is required';
  if (!data.centreCode?.trim()) errors.centreCode = 'Centre code is required';
  if (!data.registrationNumber?.year) errors.registrationYear = 'Registration year is required';
  if (!data.registrationNumber?.regNo) errors.registrationNumber = 'Registration number is required';
  if (!data.fullName?.first?.trim()) errors.fullName = 'At least first name is required';
  if (!data.dateOfRegistration) errors.dateOfRegistration = 'Date of registration is required';
  
  // Add more validations based on form requirements
  
  return Object.keys(errors).length > 0 ? errors : null;
};

const patientSlice = createSlice({
  name: 'patient',
  initialState: {
    patients: [],
    currentPatient: null,
    followUps: [],
    mortalityRecords: [],
    acceptedEntries: [],
    returnedEntries: [],
    loading: {
      patients: false,
      followUps: false,
      mortality: false,
      entries: false,
      registration: false  // Add registration loading state

    },
    error: {
      patients: null,
      followUps: null,
      mortality: null,
      entries: null,
      registration: null  // Add registration error state

    },
    success: {
      followUp: false,
      mortality: false,
      registration: false
    },
    currentView: 'new', // 'new', 'followup', 'mortality', 'accepted', 'returned'
    validationErrors: null,  // Add form validation errors
    formDraft: null  // Add form draft for saving incomplete forms
  },
  reducers: {
    addPatient: (state, action) => {
      state.patients.push(action.payload);
      state.success.registration = true;
    },
    setCurrentPatient: (state, action) => {
      state.currentPatient = action.payload;
    },
    clearCurrentPatient: (state) => {
      state.currentPatient = null;
    },
    updatePatient: (state, action) => {
      const index = state.patients.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.patients[index] = action.payload;
      }
    },
    setCurrentView: (state, action) => {
      state.currentView = action.payload;
    },
    clearSuccess: (state) => {
      state.success = {
        followUp: false,
        mortality: false,
        registration: false
      };
    },
    clearErrors: (state) => {
      state.error = {
        patients: null,
        followUps: null,
        mortality: null,
        entries: null
      };
    },
    validateForm: (state, action) => {
      state.validationErrors = validatePatientForm(action.payload);
    },
    clearValidationErrors: (state) => {
      state.validationErrors = null;
    },
    saveFormDraft: (state, action) => {
      state.formDraft = action.payload;
    },
    clearFormDraft: (state) => {
      state.formDraft = null;
    },
    clearSuccess: (state) => {
      state.success = {
        followUp: false,
        mortality: false,
        registration: false
      };
    },
    clearErrors: (state) => {
      state.error = {
        patients: null,
        followUps: null,
        mortality: null,
        entries: null,
        registration: null
      };
      state.validationErrors = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Patients
      .addCase(fetchPatients.pending, (state) => {
        state.loading.patients = true;
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.loading.patients = false;
        state.patients = action.payload;
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.loading.patients = false;
        state.error.patients = action.payload;
      })

      // Fetch Patients by Status
      .addCase(fetchPatientsByStatus.pending, (state) => {
        state.loading.entries = true;
      })
      .addCase(fetchPatientsByStatus.fulfilled, (state, action) => {
        state.loading.entries = false;
        if (action.meta.arg === 'verified') {
          state.acceptedEntries = action.payload;
        } else if (action.meta.arg === 'returned') {
          state.returnedEntries = action.payload;
        }
      })
      .addCase(fetchPatientsByStatus.rejected, (state, action) => {
        state.loading.entries = false;
        state.error.entries = action.payload;
      })

      // Follow-ups
      .addCase(fetchFollowUps.pending, (state) => {
        state.loading.followUps = true;
      })
      .addCase(fetchFollowUps.fulfilled, (state, action) => {
        state.loading.followUps = false;
        state.followUps = action.payload;
      })
      .addCase(fetchFollowUps.rejected, (state, action) => {
        state.loading.followUps = false;
        state.error.followUps = action.payload;
      })

      // Add Follow-up
      .addCase(addFollowUpRecord.pending, (state) => {
        state.loading.followUps = true;
      })
      .addCase(addFollowUpRecord.fulfilled, (state, action) => {
        state.loading.followUps = false;
        state.followUps.push(action.payload);
        state.success.followUp = true;
      })
      .addCase(addFollowUpRecord.rejected, (state, action) => {
        state.loading.followUps = false;
        state.error.followUps = action.payload;
      })

      // Mortality Records
      .addCase(fetchMortalityRecords.pending, (state) => {
        state.loading.mortality = true;
      })
      .addCase(fetchMortalityRecords.fulfilled, (state, action) => {
        state.loading.mortality = false;
        state.mortalityRecords = action.payload;
      })
      .addCase(fetchMortalityRecords.rejected, (state, action) => {
        state.loading.mortality = false;
        state.error.mortality = action.payload;
      })

      // Add Mortality Record
      .addCase(addMortalityRecord.pending, (state) => {
        state.loading.mortality = true;
      })
      .addCase(addMortalityRecord.fulfilled, (state, action) => {
        state.loading.mortality = false;
        state.mortalityRecords.push(action.payload);
        state.success.mortality = true;
      })
      .addCase(addMortalityRecord.rejected, (state, action) => {
        state.loading.mortality = false;
        state.error.mortality = action.payload;
      })
      // Add new cases for patient registration
      .addCase(registerNewPatient.pending, (state) => {
        state.loading.registration = true;
        state.error.registration = null;
        state.success.registration = false;
      })
      .addCase(registerNewPatient.fulfilled, (state, action) => {
        state.loading.registration = false;
        state.patients.push(action.payload);
        state.success.registration = true;
        state.error.registration = null;
        state.validationErrors = null;
        state.formDraft = null;
      })
      .addCase(registerNewPatient.rejected, (state, action) => {
        state.loading.registration = false;
        state.error.registration = action.payload;
        state.success.registration = false;
      })
  }
});


export const { 
  addPatient, 
  setCurrentPatient, 
  clearCurrentPatient,
  updatePatient,
  setCurrentView,
  clearSuccess,
  clearErrors,
  validateForm,
  clearValidationErrors,
  saveFormDraft,
  clearFormDraft
} = patientSlice.actions;

// Selectors
export const selectCurrentView = (state) => state.patient.currentView;
export const selectPatients = (state) => state.patient.patients;
export const selectFollowUps = (state) => state.patient.followUps;
export const selectMortalityRecords = (state) => state.patient.mortalityRecords;
export const selectAcceptedEntries = (state) => state.patient.acceptedEntries;
export const selectReturnedEntries = (state) => state.patient.returnedEntries;
export const selectLoading = (state) => state.patient.loading;
export const selectError = (state) => state.patient.error;
export const selectSuccess = (state) => state.patient.success;
export const selectCurrentPatient = (state) => state.patient.currentPatient;

export const selectValidationErrors = (state) => state.patient.validationErrors;
export const selectFormDraft = (state) => state.patient.formDraft;

export default patientSlice.reducer;