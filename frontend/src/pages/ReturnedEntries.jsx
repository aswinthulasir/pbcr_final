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
  Chip,
  Tooltip
} from '@mui/material';
import { 
  Edit as EditIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchPatientsByStatus, 
  selectReturnedEntries,
  selectLoading,
  selectError 
} from '../redux/slices/patientSlice';

export default function ReturnedEntries() {
  const dispatch = useDispatch();
  const returnedEntries = useSelector(selectReturnedEntries);
  const loading = useSelector(state => selectLoading(state).entries);
  const error = useSelector(state => selectError(state).entries);

  useEffect(() => {
    dispatch(fetchPatientsByStatus('returned'));
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
        Returned Patient Entries
      </Typography>
      
      {returnedEntries.length === 0 ? (
        <Alert severity="info">
          No returned entries found.
        </Alert>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Patient ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Submission Date</TableCell>
                <TableCell>Returned By</TableCell>
                <TableCell>Return Reason</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {returnedEntries.map((entry) => (
                <TableRow key={entry.id} sx={{ 
                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } 
                }}>
                  <TableCell>{entry.patientId}</TableCell>
                  <TableCell>{entry.name}</TableCell>
                  <TableCell>{new Date(entry.registrationDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {entry.returnedBy?.name || 'Unknown'}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={entry.returnReason} 
                      color="error" 
                      variant="outlined" 
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="View Comments">
                      <IconButton size="small" color="primary">
                        <InfoIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Entry">
                      <IconButton 
                        size="small" 
                        color="primary" 
                        sx={{ ml: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}