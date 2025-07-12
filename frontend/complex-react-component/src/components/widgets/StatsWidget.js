import React from 'react';
import { Paper, Box, Typography, Grid } from '@mui/material';
import { TrendingUp, TrendingDown, People, AttachMoney } from '@mui/icons-material';

const StatsWidget = ({ data, refreshCount, searchTerm, filter }) => {
  const performExpensiveCalculation = () => {
    let result = 0;
    for (let i = 0; i < 50000; i++) {
      result += Math.sin(i) * Math.cos(i);
    }
    return result;
  };

  const expensiveValue = performExpensiveCalculation();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(2)}%`;
  };

  const getRandomColor = () => {
    const colors = ['#1976d2', '#dc004e', '#388e3c', '#f57c00', '#7b1fa2'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const processedData = {
    ...data,
    expensiveCalculation: expensiveValue,
    randomColor: getRandomColor(),
    timestamp: new Date().toISOString()
  };

  const StatItem = ({ title, value, icon: Icon, trend }) => {
    const trendColor = trend > 0 ? 'success.main' : 'error.main';
    const TrendIcon = trend > 0 ? TrendingUp : TrendingDown;
    
    const performNestedCalculation = () => {
      let nestedResult = 0;
      for (let i = 0; i < 10000; i++) {
        nestedResult += Math.random() * i;
      }
      return nestedResult;
    };

    const nestedValue = performNestedCalculation();

    return (
      <Grid item xs={12}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Icon sx={{ mr: 1, color: 'primary.main' }} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {value}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TrendIcon sx={{ fontSize: 16, color: trendColor, mr: 0.5 }} />
            <Typography variant="caption" sx={{ color: trendColor }}>
              {formatPercentage(Math.abs(trend))}
            </Typography>
          </Box>
        </Box>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
          Nested calc: {nestedValue.toFixed(2)}
        </Typography>
      </Grid>
    );
  };

  return (
    <Paper sx={{ p: 2, height: 300 }}>
      <Typography variant="h6" gutterBottom>
        Statistics
      </Typography>
      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2 }}>
        Refresh: {refreshCount} | Search: "{searchTerm}" | Filter: {filter}
      </Typography>
      <Grid container spacing={1}>
        <StatItem 
          title="Total Users" 
          value={processedData.totalUsers.toLocaleString()} 
          icon={People}
          trend={2.3}
        />
        <StatItem 
          title="Active Users" 
          value={processedData.activeUsers.toLocaleString()} 
          icon={People}
          trend={-1.2}
        />
        <StatItem 
          title="Revenue" 
          value={formatCurrency(processedData.revenue)} 
          icon={AttachMoney}
          trend={5.7}
        />
        <Grid item xs={12}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Expensive calc: {processedData.expensiveCalculation.toFixed(2)}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default StatsWidget; 