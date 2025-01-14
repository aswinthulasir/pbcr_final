import React, { useEffect, useCallback } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Button,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/slices/authSlice';
import { 
  fetchPatients, 
  fetchFollowUps, 
  fetchPatientsByStatus,
  setCurrentView 
} from '../redux/slices/patientSlice';

export default function ProfilePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Memoize the selectors
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.patient.loading.patients || 
    state.patient.loading.followUps || 
    state.patient.loading.entries);
  const error = useSelector((state) => state.patient.error.patients || 
    state.patient.error.followUps || 
    state.patient.error.entries);

  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate('/login');
  }, [dispatch, navigate]);

  const handleNavigation = useCallback(async (type) => {
    try {
      dispatch(setCurrentView(type));
      let route = '/profile/';
      switch (type) {
        case 'new':
          await dispatch(fetchPatients());
          route += 'registry';
          break;
        case 'followup':
          await dispatch(fetchFollowUps());
          route += 'follow-up';
          break;
        case 'accepted':
          await dispatch(fetchPatientsByStatus('verified'));
          route += 'accepted';
          break;
        case 'returned':
          await dispatch(fetchPatientsByStatus('returned'));
          route += 'returned';
          break;
        case 'mortality':
          await dispatch(fetchPatientsByStatus('mortality'));
          route += 'mortality';
          break;
        default:
          route = '/profile';
      }
      navigate(route);
    } catch (err) {
      console.error('Navigation error:', err);
    }
  }, [dispatch, navigate]);

  // Redirect non-data collectors
  useEffect(() => {
    if (user && user.role !== 'data_collector') {
      const route = {
        'state_admin': '/admin/state',
        'center_admin': '/admin/center',
        'hospital_admin': '/admin/hospital',
      }[user.role];
      
      if (route) {
        navigate(route);
      }
    }
  }, [user, navigate]);

  if (!user) {
    navigate('/login');
    return null;
  }

  const navigationButtons = [
    {
      title: "New Patient Registration",
      color: "primary",
      type: 'new',
      variant: "contained",
      description: "Register new cancer patient"
    },
    {
      title: "Patient Follow-up",
      color: "info",
      type: 'followup',
      variant: "contained",
      description: "Record follow-up information"
    },
    {
      title: "Mortality Records",
      color: "primary",
      type: 'mortality',
      variant: "contained",
      description: "Record mortality information"
    },
    {
      title: "Accepted Entries",
      color: "success",
      type: 'accepted',
      variant: "contained",
      description: "View approved registrations"
    },
    {
      title: "Returned Entries",
      color: "error",
      type: 'returned',
      variant: "contained",
      description: "View entries requiring revision"
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4,
        pb: 2,
        borderBottom: '1px solid #e0e0e0'
      }}>
        <Box>
          <Typography variant="h4">
            {user.name}'s Dashboard
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Welcome, {user.name} | {user.institution}
          </Typography>
        </Box>
        <Button 
          variant="outlined" 
          color="error" 
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error.toString()}
        </Alert>
      )}

      {/* Main Actions */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {navigationButtons.map((button, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Button
              variant={button.variant}
              color={button.color}
              size="large"
              fullWidth
              disabled={loading}
              sx={{
                py: 3,
                display: 'flex',
                flexDirection: 'column',
                height: '120px',
                textAlign: 'center',
                boxShadow: 2,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  transition: 'transform 0.2s'
                }
              }}
              onClick={() => handleNavigation(button.type)}
            >
              <Typography variant="h6" sx={{ mb: 1 }}>
                {button.title}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                {button.description}
              </Typography>
              {loading && (
                <CircularProgress 
                  size={20} 
                  sx={{ position: 'absolute', top: 8, right: 8 }} 
                />
              )}
            </Button>
          </Grid>
        ))}
      </Grid>

      {/* Statistics */}
      <Box sx={{ 
        mt: 4, 
        p: 3, 
        bgcolor: 'background.paper', 
        borderRadius: 2,
        boxShadow: 1
      }}>
        <Typography variant="h6" gutterBottom>
          Your Statistics
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ 
              textAlign: 'center', 
              p: 2, 
              bgcolor: '#f8f9fa',
              borderRadius: 1
            }}>
              <Typography variant="h3" color="primary">0</Typography>
              <Typography variant="subtitle1">Total Entries</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ 
              textAlign: 'center', 
              p: 2, 
              bgcolor: '#f8f9fa',
              borderRadius: 1
            }}>
              <Typography variant="h3" color="success.main">0</Typography>
              <Typography variant="subtitle1">Accepted</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box sx={{ 
              textAlign: 'center', 
              p: 2, 
              bgcolor: '#f8f9fa',
              borderRadius: 1
            }}>
              <Typography variant="h3" color="error.main">0</Typography>
              <Typography variant="subtitle1">Pending Review</Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}