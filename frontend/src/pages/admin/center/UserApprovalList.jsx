import React, { useState, useEffect } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  Box,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Check as CheckIcon,
  Block as BlockIcon,
  Info as InfoIcon,
  VerifiedUser as VerifiedIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
  approveUser,
  fetchPendingUsers,
  fetchApprovedUsers,
  fetchApprovedHospitals,
  selectPendingUsers,
  selectApprovedUsers,
  selectApprovedHospitals,
  selectLoading
} from '../../../redux/slices/centerAdminSlice';

export default function UserApprovalList() {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(0);
  
  const pendingUsers = useSelector(selectPendingUsers);
  const approvedUsers = useSelector(selectApprovedUsers);
  const approvedHospitals = useSelector(selectApprovedHospitals);
  const loading = useSelector(state => selectLoading(state).users);

  useEffect(() => {
    switch (activeTab) {
      case 0:
        dispatch(fetchPendingUsers());
        break;
      case 1:
        dispatch(fetchApprovedHospitals());
        break;
      case 2:
        dispatch(fetchApprovedUsers());
        break;
    }
  }, [dispatch, activeTab]);

  const handleApprove = async (userId) => {
    await dispatch(approveUser(userId));
    dispatch(fetchPendingUsers());
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const renderTable = (data, isPending = false) => (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Role/Type</TableCell>
            <TableCell>Institution</TableCell>
            <TableCell>Contact</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.name}</TableCell>
              <TableCell>
                <Chip
                  label={item.role || item.type}
                  color={item.role === 'hospital_admin' || item.type === 'Hospital' ? 'primary' : 'secondary'}
                  size="small"
                />
              </TableCell>
              <TableCell>{item.institution}</TableCell>
              <TableCell>{item.email || item.contactEmail}</TableCell>
              <TableCell>
                <Chip
                  label={item.status}
                  color={item.status === 'active' ? 'success' : 'warning'}
                  size="small"
                  icon={item.status === 'active' ? <VerifiedIcon /> : undefined}
                />
              </TableCell>
              <TableCell align="right">
                <Tooltip title="View Details">
                  <IconButton size="small">
                    <InfoIcon />
                  </IconButton>
                </Tooltip>
                {isPending && (
                  <>
                    <Tooltip title="Approve">
                      <IconButton
                        color="success"
                        size="small"
                        onClick={() => handleApprove(item.id)}
                        disabled={loading}
                      >
                        <CheckIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Reject">
                      <IconButton color="error" size="small">
                        <BlockIcon />
                      </IconButton>
                    </Tooltip>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
          {data.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} align="center">
                No records found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box>
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}
      >
        <Tab label="Pending Approvals" />
        <Tab label="Approved Hospitals" />
        <Tab label="Approved Users" />
      </Tabs>

      {activeTab === 0 && renderTable(pendingUsers, true)}
      {activeTab === 1 && renderTable(approvedHospitals)}
      {activeTab === 2 && renderTable(approvedUsers)}
    </Box>
  );
}