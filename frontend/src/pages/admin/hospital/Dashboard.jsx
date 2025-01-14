import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Tabs,
  Tab,
  Button,
  CircularProgress,
  Stack
} from '@mui/material';
import {
  Add as AddIcon,
  Download as DownloadIcon,
  Assessment as AssessmentIcon,
  People as PeopleIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../redux/slices/authSlice';
import {
  fetchHospitalData,
  fetchDataCollectors,
  fetchHospitalMISReports
} from '../../../redux/slices/hospitalAdminSlice';

import CreateDataCollectorDialog from './CreateDataCollectorDialog';
import DataCollectorsList from './DataCollectorsList';
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

export default function HospitalAdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  
  const { misReports, loading, error } = useSelector((state) => state.hospitalAdmin);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchHospitalMISReports());
    dispatch(fetchDataCollectors());
    dispatch(fetchHospitalData());
  }, [dispatch]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
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
            Hospital Administration
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {user?.institution}
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setOpenCreateDialog(true)}
          >
            Add Data Collector
          </Button>
          <Button 
            variant="outlined" 
            color="error" 
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
          >
            Logout
          </Button>
        </Stack>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Total Registrations
            </Typography>
            <Typography variant="h3" color="primary">
              {misReports?.registrationStats?.total || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Verified: {misReports?.registrationStats?.verified || 0}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Mortality Records
            </Typography>
            <Typography variant="h3" color="error">
              {misReports?.mortalityStats?.total || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Verified: {misReports?.mortalityStats?.verified || 0}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Data Collectors
            </Typography>
            <Typography variant="h3" color="success.main">
              {misReports?.dataCollectorStats?.total || 0}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active: {misReports?.dataCollectorStats?.active || 0}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Pending Review
            </Typography>
            <Typography variant="h3" color="warning.main">
              {misReports?.registrationStats?.pending || 0}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="hospital admin dashboard tabs"
          >
            <Tab 
              icon={<PeopleIcon sx={{ mr: 1 }} />}
              iconPosition="start"
              label="Data Collectors" 
            />
            <Tab 
              icon={<DownloadIcon sx={{ mr: 1 }} />}
              iconPosition="start"
              label="Data Export" 
            />
            <Tab 
              icon={<AssessmentIcon sx={{ mr: 1 }} />}
              iconPosition="start"
              label="MIS Reports" 
            />
          </Tabs>
        </Box>

        <Box>
          <TabPanel value={activeTab} index={0}>
            <DataCollectorsList />
          </TabPanel>
          <TabPanel value={activeTab} index={1}>
            <DataExportPanel />
          </TabPanel>
          <TabPanel value={activeTab} index={2}>
            <MISReports data={misReports} />
          </TabPanel>
        </Box>
      </Paper>

      {/* Dialog */}
      <CreateDataCollectorDialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        onSuccess={() => {
          setOpenCreateDialog(false);
          dispatch(fetchDataCollectors());
        }}
      />
    </Container>
  );
}