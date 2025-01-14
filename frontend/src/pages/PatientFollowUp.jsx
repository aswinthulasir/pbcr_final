import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Divider,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  addFollowUpRecord,
  fetchPatients,
  selectPatients,
  selectLoading,
  selectError,
  selectSuccess
} from '../redux/slices/patientSlice';

const initialFormState = {
  patientId: '',
  followUpDate: '',
  nextFollowUpDate: '',
  hasSymptoms: false,
  symptoms: '',
  currentMedications: '',
  treatmentResponse: '',
  investigationsRequired: '',
  investigationResults: '',
  physicianNotes: '',
  treatmentModification: '',
  complicationsPresentent: false,
  complications: '',
  status: 'scheduled' // scheduled, completed, missed
};

export default function PatientFollowUp() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(initialFormState);
  const patients = useSelector(selectPatients);
  const loading = useSelector(state => selectLoading(state).followUps);
  const error = useSelector(state => selectError(state).followUps);
  const success = useSelector(state => selectSuccess(state).followUp);

  useEffect(() => {
    dispatch(fetchPatients());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(addFollowUpRecord(formData));
    if (!error) {
      setFormData(initialFormState);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Patient Follow-up Records
        </Typography>
        <Divider sx={{ mb: 4 }} />

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Follow-up record added successfully
          </Alert>
        )}

        <Paper sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Patient Selection */}
              <Grid item xs={12} md={12}>
                <FormControl fullWidth>
                  <InputLabel>Select Patient</InputLabel>
                  <Select
                    name="patientId"
                    value={formData.patientId}
                    onChange={handleChange}
                    required
                  >
                    {patients.map(patient => (
                      <MenuItem key={patient.id} value={patient.id}>
                        {patient.patientId} - {patient.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Follow-up Dates */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Follow-up Date"
                  type="date"
                  name="followUpDate"
                  value={formData.followUpDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Next Follow-up Date"
                  type="date"
                  name="nextFollowUpDate"
                  value={formData.nextFollowUpDate}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              {/* Symptoms and Medications */}
              <Grid item xs={12} md={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.hasSymptoms}
                      onChange={handleChange}
                      name="hasSymptoms"
                    />
                  }
                  label="Patient has symptoms"
                />
              </Grid>

              {formData.hasSymptoms && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Symptoms"
                    name="symptoms"
                    value={formData.symptoms}
                    onChange={handleChange}
                    multiline
                    rows={2}
                    required={formData.hasSymptoms}
                  />
                </Grid>
              )}

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Current Medications"
                  name="currentMedications"
                  value={formData.currentMedications}
                  onChange={handleChange}
                  multiline
                  rows={2}
                  required
                />
              </Grid>

              {/* Treatment Response */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Treatment Response"
                  name="treatmentResponse"
                  value={formData.treatmentResponse}
                  onChange={handleChange}
                  multiline
                  rows={2}
                  required
                />
              </Grid>

              {/* Investigations */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Investigations Required"
                  name="investigationsRequired"
                  value={formData.investigationsRequired}
                  onChange={handleChange}
                  multiline
                  rows={2}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Investigation Results"
                  name="investigationResults"
                  value={formData.investigationResults}
                  onChange={handleChange}
                  multiline
                  rows={2}
                />
              </Grid>

              {/* Treatment Modifications and Complications */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Treatment Modifications"
                  name="treatmentModification"
                  value={formData.treatmentModification}
                  onChange={handleChange}
                  multiline
                  rows={2}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.complicationsPresentent}
                      onChange={handleChange}
                      name="complicationsPresentent"
                    />
                  }
                  label="Complications Present"
                />
              </Grid>

              {formData.complicationsPresentent && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Complications"
                    name="complications"
                    value={formData.complications}
                    onChange={handleChange}
                    multiline
                    rows={2}
                    required={formData.complicationsPresentent}
                  />
                </Grid>
              )}

              {/* Physician Notes */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Physician Notes"
                  name="physicianNotes"
                  value={formData.physicianNotes}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  required
                />
              </Grid>

              {/* Status */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Follow-up Status</InputLabel>
                  <Select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                  >
                    <MenuItem value="scheduled">Scheduled</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="missed">Missed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{ minWidth: 150 }}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Save Follow-up'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}