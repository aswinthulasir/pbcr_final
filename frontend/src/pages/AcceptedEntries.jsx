import React, { useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  Visibility as VisibilityIcon,
  Print as PrintIcon
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchPatientsByStatus, 
  selectAcceptedEntries,
  selectLoading,
  selectError 
} from '../redux/slices/patientSlice';

export default function AcceptedEntries() {
  const dispatch = useDispatch();
  const acceptedEntries = useSelector(selectAcceptedEntries);
  const loading = useSelector(state => selectLoading(state).entries);
  const error = useSelector(state => selectError(state).entries);

  useEffect(() => {
    dispatch(fetchPatientsByStatus('verified'));
  }, [dispatch]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" m={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Accepted Patient Entries
      </Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Patient ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Registration Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {acceptedEntries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{entry.patientId}</TableCell>
                <TableCell>{entry.name}</TableCell>
                <TableCell>{entry.registrationDate}</TableCell>
                <TableCell>{entry.status}</TableCell>
                <TableCell align="right">
                  <Tooltip title="View Details">
                    <IconButton>
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Print">
                    <IconButton>
                      <PrintIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {acceptedEntries.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No accepted entries found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}