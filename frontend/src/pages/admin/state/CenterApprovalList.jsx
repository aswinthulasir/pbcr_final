import React, { useState, useEffect } from 'react';  
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Tooltip,
  TableContainer,
  Tabs,
  Tab,
  Box,
  Chip
} from '@mui/material';
import { 
  Check as CheckIcon, 
  Info as InfoIcon,
  VerifiedUser as VerifiedIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { 
  approveCenter, 
  fetchPendingCenters,
  fetchApprovedCenters,
  selectAllStateAdmin 
} from '../../../redux/slices/stateAdminSlice';

export default function CenterApprovalList() {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(0);
  const { pendingCenters, approvedCenters, loading } = useSelector((state) => state.stateAdmin);

  // Fetch data when component mounts and when tab changes
  useEffect(() => {
    if (activeTab === 0) {
      dispatch(fetchPendingCenters());
    } else {
      dispatch(fetchApprovedCenters());
    }
  }, [dispatch, activeTab]);

  // Centers data structure
  const allCenters = {
    pending: pendingCenters || [],
    approved: approvedCenters || []
  };

  const handleApprove = async (centerId) => {
    await dispatch(approveCenter(centerId));
    // Refresh both lists after approval
    dispatch(fetchPendingCenters());
    dispatch(fetchApprovedCenters());
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const renderCenterTable = (centers, showApproveButton = false) => (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Center Name</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Admin</TableCell>
            <TableCell>Contact</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {centers.map((center) => (
            <TableRow key={center.id}>
              <TableCell>{center.name}</TableCell>
              <TableCell>{center.region}</TableCell>
              <TableCell>{center.type}</TableCell>
              <TableCell>{center.adminName}</TableCell>
              <TableCell>{center.contactEmail}</TableCell>
              <TableCell>
                <Chip
                  label={center.status === 'active' || center.status === 'approved' ? 'Approved' : 'Pending'}
                  color={center.status === 'active' || center.status === 'approved' ? 'success' : 'warning'}
                  size="small"
                  icon={center.status === 'active' || center.status === 'approved' ? <VerifiedIcon /> : undefined}
                />
              </TableCell>
              <TableCell align="right">
                <Tooltip title="View Details">
                  <IconButton size="small">
                    <InfoIcon />
                  </IconButton>
                </Tooltip>
                {showApproveButton && (
                  <Button
                    startIcon={<CheckIcon />}
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={() => handleApprove(center.id)}
                    disabled={loading?.approval}
                    sx={{ ml: 1 }}
                  >
                    Approve
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
          {centers.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} align="center">
                {activeTab === 0 ? "No pending approvals" : "No approved centers"}
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
        <Tab label="Pending Approval" />
        <Tab label="Approved Centers" />
      </Tabs>

      {activeTab === 0 && renderCenterTable(allCenters.pending, true)}
      {activeTab === 1 && renderCenterTable(allCenters.approved)}
    </Box>
  );
}