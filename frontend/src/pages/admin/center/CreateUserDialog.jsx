import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  CircularProgress,
  FormHelperText,
  Typography,
  Divider,
  Box
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  createUser,
  selectLoading,
  selectError,
  selectCurrentCenter,
  fetchCenterDetails,
  fetchApprovedHospitals,
  selectApprovedHospitals
} from '../../../redux/slices/centerAdminSlice';

const initialFormState = {
  // User Credentials
  username: '',
  password: '',
  confirmPassword: '',
  
  // Personal Information
  name: '',
  email: '',
  phone: '',
  role: '',

  // Address Information
  address: {
    street: '',
    city: '',
    state: 'Kerala',
    pincode: '',
    district: ''
  },

  // Hospital Specific (when creating hospital)
  hospitalDetails: {
    name: '',
    type: '',
    registrationNumber: '',
    district: ''
  },

  // Data Collector Specific
  dataCollectorDetails: {
    hospitalId: '',
    designation: ''
  }
};

export default function CreateUserDialog({ open, onClose, onSuccess }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(initialFormState);
  const [passwordError, setPasswordError] = useState('');
  
  const loading = useSelector(state => selectLoading(state).users);
  const error = useSelector(state => selectError(state).users);
  const currentCenter = useSelector(selectCurrentCenter);
  const approvedHospitals = useSelector(selectApprovedHospitals);

  useEffect(() => {
    if (open) {
      dispatch(fetchCenterDetails());
      dispatch(fetchApprovedHospitals());
    }
  }, [dispatch, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear role-specific fields when role changes
    if (name === 'role') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        hospitalDetails: initialFormState.hospitalDetails,
        dataCollectorDetails: initialFormState.dataCollectorDetails
      }));
    }
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const result = await dispatch(createUser(formData));
    if (!result.error) {
      onSuccess?.();
      setFormData(initialFormState);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Create New {formData.role === 'hospital_admin' ? 'Hospital' : 'Data Collector'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Role Selection */}
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Role</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  label="Role"
                >
                  <MenuItem value="hospital_admin">Hospital</MenuItem>
                  <MenuItem value="data_collector">Data Collector</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {formData.role && (
              <>
                {/* User Credentials Section */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    User Credentials
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    required
                    label="Username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    required
                    type="password"
                    label="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    error={!!passwordError}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    required
                    type="password"
                    label="Confirm Password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={!!passwordError}
                    helperText={passwordError}
                  />
                </Grid>

                {/* Personal Information Section */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Personal Information
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    required
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    required
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    required
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </Grid>

                {/* Address Section */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Address
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Street Address"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleChange}
                    multiline
                    rows={2}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="City"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleChange}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel>District</InputLabel>
                    <Select
                      name="address.district"
                      value={formData.address.district}
                      onChange={handleChange}
                      label="District"
                    >
                      {currentCenter?.assignedDistricts?.map((district) => (
                        <MenuItem key={district} value={district}>
                          {district}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Pincode"
                    name="address.pincode"
                    value={formData.address.pincode}
                    onChange={handleChange}
                  />
                </Grid>

                {/* Role Specific Sections */}
                {formData.role === 'hospital_admin' ? (
                  // Hospital Details
                  <>
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom>
                        Hospital Details
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        required
                        label="Hospital Name"
                        name="hospitalDetails.name"
                        value={formData.hospitalDetails.name}
                        onChange={handleChange}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth required>
                        <InputLabel>Hospital Type</InputLabel>
                        <Select
                          name="hospitalDetails.type"
                          value={formData.hospitalDetails.type}
                          onChange={handleChange}
                          label="Hospital Type"
                        >
                          <MenuItem value="Government">Government</MenuItem>
                          <MenuItem value="Private">Private</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        required
                        label="Registration Number"
                        name="hospitalDetails.registrationNumber"
                        value={formData.hospitalDetails.registrationNumber}
                        onChange={handleChange}
                      />
                    </Grid>
                  </>
                ) : (
                  // Data Collector Details
                  <>
                    <Grid item xs={12}>
                      <Typography variant="h6" gutterBottom>
                        Data Collector Details
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <FormControl fullWidth required>
                        <InputLabel>Associated Hospital</InputLabel>
                        <Select
                          name="dataCollectorDetails.hospitalId"
                          value={formData.dataCollectorDetails.hospitalId}
                          onChange={handleChange}
                          label="Associated Hospital"
                        >
                          {approvedHospitals.map((hospital) => (
                            <MenuItem key={hospital.id} value={hospital.id}>
                              {hospital.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        required
                        label="Designation"
                        name="dataCollectorDetails.designation"
                        value={formData.dataCollectorDetails.designation}
                        onChange={handleChange}
                      />
                    </Grid>
                  </>
                )}
              </>
            )}
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !formData.role}
          >
            {loading ? <CircularProgress size={24} /> : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}