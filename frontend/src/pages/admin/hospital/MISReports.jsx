import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  LinearProgress
} from '@mui/material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

export default function MISReports({ data }) {
  if (!data) {
    return <LinearProgress />;
  }

  const { registrationStats, mortalityStats, dataCollectorStats, monthlyTrends } = data;

  const completionRate = Math.round((registrationStats.verified / registrationStats.total) * 100) || 0;
  const mortalityCompletionRate = Math.round((mortalityStats.verified / mortalityStats.total) * 100) || 0;
  const dataCollectorActiveRate = Math.round((dataCollectorStats.active / dataCollectorStats.total) * 100) || 0;

  return (
    <Grid container spacing={3}>
      {/* Registration Progress */}
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Registration Progress
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Completion Rate</Typography>
              <Typography variant="body2" color="primary">{completionRate}%</Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={completionRate} 
              sx={{ mb: 2, height: 8, borderRadius: 4 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Verified: {registrationStats.verified}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total: {registrationStats.total}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Grid>

      {/* Mortality Records Progress */}
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Mortality Records
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Verification Rate</Typography>
              <Typography variant="body2" color="error">{mortalityCompletionRate}%</Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={mortalityCompletionRate} 
              color="error"
              sx={{ mb: 2, height: 8, borderRadius: 4 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Verified: {mortalityStats.verified}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total: {mortalityStats.total}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Grid>

      {/* Data Collector Status */}
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Data Collectors
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2">Active Rate</Typography>
              <Typography variant="body2" color="success.main">{dataCollectorActiveRate}%</Typography>
            </Box>
            <LinearProgress 
              variant="determinate" 
              value={dataCollectorActiveRate} 
              color="success"
              sx={{ mb: 2, height: 8, borderRadius: 4 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Active: {dataCollectorStats.active}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total: {dataCollectorStats.total}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Grid>

      {/* Monthly Trends Chart */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Monthly Registration Trends
          </Typography>
          <Box sx={{ height: 400, mt: 2 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="registrations" 
                  stroke="#2196f3" 
                  name="New Registrations"
                />
                <Line 
                  type="monotone" 
                  dataKey="mortality" 
                  stroke="#f44336" 
                  name="Mortality Records"
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Grid>

      {/* Registration Distribution */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Data Status Distribution
          </Typography>
          <Box sx={{ height: 300, mt: 2 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                {
                  name: 'Registrations',
                  verified: registrationStats.verified,
                  pending: registrationStats.pending
                },
                {
                  name: 'Mortality Records',
                  verified: mortalityStats.verified,
                  pending: mortalityStats.total - mortalityStats.verified
                }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="verified" fill="#4caf50" name="Verified" />
                <Bar dataKey="pending" fill="#ff9800" name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}