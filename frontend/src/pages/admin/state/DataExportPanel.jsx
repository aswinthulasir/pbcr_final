import React, { useState } from 'react';
import {
  Box,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Alert
} from '@mui/material';
import { exportData } from '../../../redux/slices/stateAdminSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Download as DownloadIcon } from '@mui/icons-material';

export default function DataExportPanel() {
  const dispatch = useDispatch();
  const [dataType, setDataType] = useState('incidence');
  const [dateRange, setDateRange] = useState('all');
  const { loading, error, lastExport } = useSelector((state) => state.stateAdmin);

  const handleExport = () => {
    dispatch(exportData({
      dataType,
      filters: { dateRange }
    }));
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Export Verified Data
      </Typography>
      
      {error?.export && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error.export}
        </Alert>
      )}

      {lastExport && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Data exported successfully
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Data Type</InputLabel>
          <Select
            value={dataType}
            label="Data Type"
            onChange={(e) => setDataType(e.target.value)}
          >
            <MenuItem value="incidence">Incidence Data</MenuItem>
            <MenuItem value="mortality">Mortality Data</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Date Range</InputLabel>
          <Select
            value={dateRange}
            label="Date Range"
            onChange={(e) => setDateRange(e.target.value)}
          >
            <MenuItem value="all">All Time</MenuItem>
            <MenuItem value="thisYear">This Year</MenuItem>
            <MenuItem value="lastYear">Last Year</MenuItem>
            <MenuItem value="custom">Custom Range</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Button
        variant="contained"
        startIcon={<DownloadIcon />}
        onClick={handleExport}
        disabled={loading.export}
      >
        Export Data
      </Button>
    </Paper>
  );
}