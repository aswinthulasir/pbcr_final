import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Chip,
  OutlinedInput
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { createApexCenter } from '../../../redux/slices/stateAdminSlice';

const KERALA_DISTRICTS = [
  'Alappuzha', 'Ernakulam', 'Idukki', 'Kannur', 'Kasaragod',
  'Kollam', 'Kottayam', 'Kozhikode', 'Malappuram', 'Palakkad',
  'Pathanamthitta', 'Thiruvananthapuram', 'Thrissur', 'Wayanad'
];

const initialFormState = {
  name: '',
  region: '',
  adminName: '',
  adminEmail: '',
  contactNumber: '',
  address: '',
  assignedDistricts: []
};

export default function CreateCenterDialog({ open, onClose, onSuccess }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(initialFormState);
  const { loading, error } = useSelector((state) => ({
    loading: state.stateAdmin.loading.creation,
    error: state.stateAdmin.error.creation
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDistrictsChange = (event) => {
    const { value } = event.target;
    setFormData(prev => ({
      ...prev,
      assignedDistricts: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(createApexCenter(formData));
    if (!result.error) {
      setFormData(initialFormState);
      onSuccess?.();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Create New Cancer Centre</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Center Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Region"
                name="region"
                value={formData.region}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Admin Name"
                name="adminName"
                value={formData.adminName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Admin Email"
                name="adminEmail"
                type="email"
                value={formData.adminEmail}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Contact Number"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Address"
                name="address"
                multiline
                rows={2}
                value={formData.address}
                onChange={handleChange}
              />
            </Grid>

            {/* Districts Selection */}
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel id="districts-label">Assigned Districts</InputLabel>
                <Select
                  labelId="districts-label"
                  multiple
                  value={formData.assignedDistricts}
                  onChange={handleDistrictsChange}
                  input={<OutlinedInput label="Assigned Districts" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {KERALA_DISTRICTS.map((district) => (
                    <MenuItem key={district} value={district}>
                      {district}
                    </MenuItem>
                  ))}
                </Select>
                {formData.assignedDistricts.length === 0 && (
                  <Alert severity="info" sx={{ mt: 1 }}>
                    Please select at least one district
                  </Alert>
                )}
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button 
            type="submit" 
            variant="contained"
            disabled={loading || formData.assignedDistricts.length === 0}
          >
            Create Centre
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}