import React, { useState, useEffect } from 'react';
import { 
  Avatar, 
  Button, 
  CssBaseline, 
  TextField, 
  Paper, 
  Box,
  Grid,
  Typography,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError, selectAuth } from '../redux/slices/authSlice';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('');
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated, user } = useSelector(selectAuth);

  useEffect(() => {
    // Clear any existing errors when component mounts
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect based on user role
      switch (user.role) {
        case 'state_admin':
          navigate('/admin/state');
          break;
        case 'center_admin':
          navigate('/admin/center');
          break;
        case 'hospital_admin':
          navigate('/admin/hospital');
          break;
        case 'data_collector':
          navigate('/profile');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(loginUser({ username, password }));
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      // In real implementation, call API to send reset email
      console.log('Sending password reset email to:', resetEmail);
      setResetSuccess(true);
      setTimeout(() => {
        setForgotPasswordOpen(false);
        setResetSuccess(false);
        setResetEmail('');
      }, 3000);
    } catch (err) {
      console.error('Failed to send reset email:', err);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(45deg, #4CAF50 30%, #2196F3 90%)'
      }}
    >
      <Grid 
        container 
        component="main" 
        sx={{ 
          maxWidth: '1200px',
          height: '80vh',
          m: 'auto',
          boxShadow: 24,
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(https://source.unsplash.com/random?hospital)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
            }
          }}
        >
          <Box
            sx={{
              position: 'relative',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              px: 4,
              zIndex: 1,
            }}
          >
            <Typography variant="h3" color="white" gutterBottom>
              CanCare - Kerala Cancer Registry
            </Typography>
            <Typography variant="h6" color="white">
              Comprehensive Cancer Care Data Management
            </Typography>
          </Box>
        </Grid>
        <Grid 
          item 
          xs={12} 
          sm={8} 
          md={5} 
          component={Paper} 
          elevation={6} 
          square
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white'
          }}
        >
          <Box
            sx={{
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              maxWidth: '400px'
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main', width: 56, height: 56 }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5" gutterBottom>
              Login
            </Typography>
            <Box component="form" noValidate onSubmit={handleLogin} sx={{ mt: 1, width: '100%' }}>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              
              <FormControl fullWidth margin="normal">
                <InputLabel>User Type</InputLabel>
                <Select
                  value={userType}
                  label="User Type"
                  onChange={(e) => setUserType(e.target.value)}
                  required
                >
                  <MenuItem value="state_admin">State</MenuItem>
                  <MenuItem value="center_admin">Cancer Centre</MenuItem>
                  <MenuItem value="hospital_admin">Hospital</MenuItem>
                  <MenuItem value="data_collector">Data Collector</MenuItem>
                </Select>
              </FormControl>

              <TextField
                margin="normal"
                required
                fullWidth
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, py: 1.5 }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Sign In'}
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Link
                  component="button"
                  variant="body2"
                  onClick={() => setForgotPasswordOpen(true)}
                  sx={{ cursor: 'pointer' }}
                  disabled={loading}
                >
                  Forgot password?
                </Link>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Forgot Password Dialog */}
      <Dialog 
        open={forgotPasswordOpen} 
        onClose={() => {
          setForgotPasswordOpen(false);
          setResetSuccess(false);
          setResetEmail('');
        }}
      >
        <DialogTitle>Reset Password</DialogTitle>
        <form onSubmit={handleForgotPassword}>
          <DialogContent>
            {resetSuccess ? (
              <Alert severity="success">
                Password reset link has been sent to your email.
              </Alert>
            ) : (
              <>
                <Typography gutterBottom>
                  Enter your email address and we'll send you a link to reset your password.
                </Typography>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Email Address"
                  type="email"
                  fullWidth
                  variant="outlined"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                />
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => {
                setForgotPasswordOpen(false);
                setResetSuccess(false);
                setResetEmail('');
              }}
            >
              Cancel
            </Button>
            {!resetSuccess && (
              <Button type="submit" variant="contained">
                Send Reset Link
              </Button>
            )}
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}