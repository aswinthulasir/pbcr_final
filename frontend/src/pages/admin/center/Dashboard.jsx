import React, { useEffect, useState } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box,
  Grid,
  Button,
  Tab,
  Tabs,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Download as DownloadIcon,
  Assessment as AssessmentIcon,
  People as PeopleIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../redux/slices/authSlice';
import { 
  fetchPendingUsers,
  fetchDistrictData,
  fetchMISReports 
} from '../../../redux/slices/centerAdminSlice';

// Import sub-components
import UserApprovalList from './UserApprovalList';
import CreateUserDialog from './CreateUserDialog';
import DataQualityPanel from './DataQualityPanel';
import DataExportPanel from './DataExportPanel';
import MISReports from './MISReports';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function CenterAdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  
  const { 
    misReports,
    loading,
    error
  } = useSelector((state) => state.centerAdmin);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchMISReports());
    dispatch(fetchPendingUsers());
    dispatch(fetchDistrictData());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleRefresh = () => {
    dispatch(fetchMISReports());
    dispatch(fetchPendingUsers());
  };

  if (loading.reports && !misReports) {
    return (
      <Box display="flex" justifyContent="center" m={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4 
      }}>
        <Box>
          <Typography variant="h4" component="h1">
            Cancer Centre Administration
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {user.institution} | {user.region}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenCreateDialog(true)}
          >
            Create New User
          </Button>
          <Button onClick={handleLogout}>
          <Tooltip title="Logout">
            <IconButton color="inherit">
              <LogoutIcon />
            </IconButton>
          </Tooltip>
          Logout
          </Button>
        </Box>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Total Users
            </Typography>
            <Typography variant="h3" color="primary">
              {misReports?.userStats?.total || 0}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Pending Approvals
            </Typography>
            <Typography variant="h3" color="error">
              {misReports?.userStats?.pending || 0}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Registry Cases
            </Typography>
            <Typography variant="h3" color="primary">
              {misReports?.registryStats?.total || 0}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Pending Review
            </Typography>
            <Typography variant="h3" color="warning.main">
              {misReports?.registryStats?.pending || 0}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="center admin dashboard tabs"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="User Management" />
          <Tab label="Data Quality" />
          <Tab label="Data Export" />
          <Tab label="MIS Reports" />
        </Tabs>

        <TabPanel value={activeTab} index={0}>
          <UserApprovalList />
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          <DataQualityPanel />
        </TabPanel>
        <TabPanel value={activeTab} index={2}>
          <DataExportPanel />
        </TabPanel>
        <TabPanel value={activeTab} index={3}>
          <MISReports data={misReports} />
        </TabPanel>
      </Paper>

      <CreateUserDialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        onSuccess={() => {
          handleRefresh();
          setOpenCreateDialog(false);
        }}
      />
    </Container>
  );
}