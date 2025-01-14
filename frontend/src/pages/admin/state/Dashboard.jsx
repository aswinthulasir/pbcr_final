import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Add this import
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Tab,
  Tabs,
  CircularProgress,
  Tooltip,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Download as DownloadIcon,
  Assessment as AssessmentIcon,
  Logout as LogoutIcon  
} from '@mui/icons-material';
import {
  fetchPendingCenters,
  fetchMISReports,
  fetchVerifiedData
} from '../../../redux/slices/stateAdminSlice';
import { logout } from '../../../redux/slices/authSlice'; // Add this import


// Import subcomponents
import CenterApprovalList from './CenterApprovalList';
import CreateCenterDialog from './CreateCenterDialog';
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

export default function StateAdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Add this
  const [activeTab, setActiveTab] = useState(0);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  
  const { 
    misReports,
    loading,
    error
  } = useSelector((state) => state.stateAdmin);

  useEffect(() => {
    dispatch(fetchMISReports());
    dispatch(fetchPendingCenters());
    dispatch(fetchVerifiedData({ dataType: 'incidence' }));
  }, [dispatch]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleRefresh = () => {
    dispatch(fetchMISReports());
    dispatch(fetchPendingCenters());
  };
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };


  if (loading.reports && !misReports) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 4,
        gap: 2  // Add gap between elements
      }}>
        <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
          Kerala Cancer Registry
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenCreateDialog(true)}
        >
          New Cancer Centre
        </Button>
        <Tooltip title="Logout">
          <Button
            variant="outlined"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Tooltip>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <Typography variant="h6" gutterBottom>
              Total Centers
            </Typography>
            <Typography variant="h3" color="primary">
              {misReports?.centerStats?.total || 0}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <Typography variant="h6" gutterBottom>
              Pending Approvals
            </Typography>
            <Typography variant="h3" color="error">
              {misReports?.centerStats?.pending || 0}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <Typography variant="h6" gutterBottom>
              Incidence Data
            </Typography>
            <Typography variant="h3" color="primary">
              {misReports?.patientStats?.total || 0}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <Typography variant="h6" gutterBottom>
              Mortality Data
            </Typography>
            <Typography variant="h3" color="primary">
              {misReports?.mortalityStats?.total || 0}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Paper sx={{ width: '100%', mb: 2 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="admin dashboard tabs"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Cancer Centers" />
          <Tab label="Data Export" />
          <Tab label="MIS Reports" />
        </Tabs>

        <TabPanel value={activeTab} index={0}>
          <CenterApprovalList />
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          <DataExportPanel />
        </TabPanel>
        <TabPanel value={activeTab} index={2}>
          <MISReports data={misReports} />
        </TabPanel>
      </Paper>

      <CreateCenterDialog
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


