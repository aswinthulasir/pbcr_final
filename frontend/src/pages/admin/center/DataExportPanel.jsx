import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Snackbar,
  TextField,
  Chip,
  OutlinedInput
} from '@mui/material';
import {
  Download as DownloadIcon,
  DateRange as DateRangeIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
  exportData,
  selectLoading,
  selectError,
  selectSuccess,
  fetchCenterDetails,
  selectCurrentCenter
} from '../../../redux/slices/centerAdminSlice';

export default function DataExportPanel() {
  const dispatch = useDispatch();
  const currentCenter = useSelector(selectCurrentCenter);
  const loading = useSelector(state => selectLoading(state).export);
  const error = useSelector(state => selectError(state).export);
  const success = useSelector(state => selectSuccess(state).export);

  const [filters, setFilters] = useState({
    dataType: 'incidence',
    dateRange: 'all',
    startDate: '',
    endDate: '',
    districts: [], // Changed from single district to multiple
    status: 'verified'
  });

  useEffect(() => {
    dispatch(fetchCenterDetails());
  }, [dispatch]);

  const handleDistrictsChange = (event) => {
    const { value } = event.target;
    setFilters(prev => ({
      ...prev,
      districts: typeof value === 'string' ? value.split(',') : value
    }));
  };

  const handleExport = async () => {
    await dispatch(exportData({
      type: filters.dataType,
      filters: {
        ...filters,
        dateRange: filters.dateRange === 'custom' ? {
          start: filters.startDate,
          end: filters.endDate
        } : filters.dateRange
      }
    }));
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Export Verified Data
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Data Type Selection */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Data Type</InputLabel>
            <Select
              value={filters.dataType}
              label="Data Type"
              onChange={(e) => setFilters(prev => ({ ...prev, dataType: e.target.value }))}
            >
              <MenuItem value="incidence">Cancer Incidence Data</MenuItem>
              <MenuItem value="mortality">Mortality Data</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Date Range Selection */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Date Range</InputLabel>
            <Select
              value={filters.dateRange}
              label="Date Range"
              onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
            >
              <MenuItem value="all">All Time</MenuItem>
              <MenuItem value="thisYear">This Year</MenuItem>
              <MenuItem value="lastYear">Last Year</MenuItem>
              <MenuItem value="last6Months">Last 6 Months</MenuItem>
              <MenuItem value="custom">Custom Range</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Custom Date Range */}
        {filters.dateRange === 'custom' && (
          <>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </>
        )}

        {/* District Selection - Updated for multiple selection */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Districts</InputLabel>
            <Select
              multiple
              value={filters.districts}
              onChange={handleDistrictsChange}
              input={<OutlinedInput label="Districts" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              {currentCenter?.assignedDistricts?.map((district) => (
                <MenuItem key={district} value={district}>
                  {district}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Status Selection */}
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              label="Status"
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            >
              <MenuItem value="verified">Verified Only</MenuItem>
              <MenuItem value="all">All Records</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Export Button */}
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              variant="contained"
              startIcon={loading ? <CircularProgress size={20} /> : <DownloadIcon />}
              onClick={handleExport}
              disabled={loading || 
                (filters.dateRange === 'custom' && (!filters.startDate || !filters.endDate)) ||
                filters.districts.length === 0}
            >
              {loading ? 'Exporting...' : 'Export Data'}
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Success Snackbar */}
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => {}}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="success">Data exported successfully!</Alert>
      </Snackbar>
    </Paper>
  );
}