import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  LinearProgress,
  Box
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

export default function MISReports({ data }) {
  if (!data) return <LinearProgress />;

  const stats = [
    {
      title: 'Cancer Centers',
      total: data.centerStats.total,
      approved: data.centerStats.approved,
      color: 'primary'
    },
    {
      title: 'Incidence Data',
      total: data.patientStats.total,
      approved: data.patientStats.verified,
      color: 'info'
    },
    {
      title: 'Mortality Data',
      total: data.mortalityStats.total,
      approved: data.mortalityStats.verified,
      color: 'secondary'
    }
  ];

  return (
    <Grid container spacing={3}>
      {/* Stats Cards */}
      {stats.map((stat, index) => (
        <Grid item xs={12} md={4} key={index}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              {stat.title}
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Total: {stat.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Verified: {stat.approved}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={(stat.approved / stat.total) * 100 || 0}
              color={stat.color}
            />
          </Paper>
        </Grid>
      ))}

      {/* Charts */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Monthly Registration Trends
          </Typography>
          <Box sx={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.monthlyTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="registrations" fill="#2196f3" />
                <Bar dataKey="mortality" fill="#f44336" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}