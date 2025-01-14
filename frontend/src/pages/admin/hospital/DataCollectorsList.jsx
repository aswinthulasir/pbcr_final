import React, { useEffect } from 'react';  
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Switch,
  Chip,
  IconButton,
  Tooltip,
  Box,
  CircularProgress,
  Alert,
  Typography
} from '@mui/material';
import {
  Info as InfoIcon,
  Email as EmailIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchDataCollectors,  // Add this import
  toggleUserStatus,
  selectDataCollectors,
  selectLoading,
  selectError
} from '../../../redux/slices/hospitalAdminSlice';

export default function DataCollectorsList() {
  const dispatch = useDispatch();
  const dataCollectors = useSelector(selectDataCollectors);
  const loading = useSelector(state => selectLoading(state).users);
  const error = useSelector(state => selectError(state).users);

  // Add useEffect to fetch data collectors
  useEffect(() => {
    dispatch(fetchDataCollectors());
  }, [dispatch]);

  const handleStatusToggle = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    await dispatch(toggleUserStatus({ userId, status: newStatus }));
  };

  if (loading && !dataCollectors.length) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Data Collectors Management
      </Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Contact Info</TableCell>
              <TableCell>Registrations</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Account Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataCollectors.map((collector) => (
              <TableRow key={collector.id}>
                <TableCell>{collector.name}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Tooltip title="Send Email">
                      <IconButton size="small" href={`mailto:${collector.email}`}>
                        <EmailIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Call">
                      <IconButton size="small" href={`tel:${collector.phone}`}>
                        <PhoneIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={`${collector.registrations || 0} entries`}
                    color="primary"
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={collector.status}
                    color={collector.status === 'active' ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  <Switch
                    checked={collector.status === 'active'}
                    onChange={() => handleStatusToggle(collector.id, collector.status)}
                    disabled={loading}
                  />
                </TableCell>
                <TableCell>
                  <Tooltip title="View Details">
                    <IconButton size="small">
                      <InfoIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {dataCollectors.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No data collectors found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}