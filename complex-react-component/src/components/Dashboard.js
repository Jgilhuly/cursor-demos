import React, { useState, useEffect } from 'react';
import { Grid, Paper, Box, Button, TextField, Chip } from '@mui/material';
import { Refresh, FilterList } from '@mui/icons-material';
import StatsWidget from './widgets/StatsWidget';
import ChartWidget from './widgets/ChartWidget';
import TableWidget from './widgets/TableWidget';
import ActivityWidget from './widgets/ActivityWidget';
import { generateStatsData, generateChartData, generateTableData, generateActivityData, processExpensiveData } from '../data/mockData';

const Dashboard = () => {
  const [refreshCount, setRefreshCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [animationCounter, setAnimationCounter] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(new Date());
      setAnimationCounter(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshCount(prev => prev + 1);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const statsData = generateStatsData();
  const chartData = generateChartData();
  const tableData = generateTableData();
  const activityData = generateActivityData();

  const expensiveProcessedData = processExpensiveData(tableData);

  const filteredData = expensiveProcessedData.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || item.status.toLowerCase() === filter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const performExpensiveCalculation = () => {
    let result = 0;
    for (let i = 0; i < 100000; i++) {
      result += Math.sin(i) * Math.cos(i) * Math.random();
    }
    return result;
  };

  const expensiveValue = performExpensiveCalculation();

  const getComplexMetrics = () => {
    const metrics = {};
    for (let i = 0; i < 1000; i++) {
      metrics[`metric_${i}`] = Math.random() * 100;
    }
    return metrics;
  };

  const complexMetrics = getComplexMetrics();

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          startIcon={<Refresh />}
          onClick={handleRefresh}
        >
          Refresh ({refreshCount})
        </Button>
        
        <TextField
          size="small"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          sx={{ minWidth: 200 }}
        />
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          {['all', 'active', 'inactive', 'pending'].map(filterOption => (
            <Chip
              key={filterOption}
              label={filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
              variant={filter === filterOption ? 'filled' : 'outlined'}
              onClick={() => handleFilterChange(filterOption)}
              icon={<FilterList />}
            />
          ))}
        </Box>
        
        <Box sx={{ ml: 'auto', fontSize: '0.8rem', color: 'text.secondary' }}>
          Last updated: {lastUpdate.toLocaleTimeString()}
          <br />
          Animation counter: {animationCounter}
          <br />
          Expensive value: {expensiveValue.toFixed(2)}
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={3}>
          <StatsWidget 
            data={statsData} 
            refreshCount={refreshCount}
            searchTerm={searchTerm}
            filter={filter}
          />
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <ChartWidget 
            data={chartData}
            refreshCount={refreshCount}
            searchTerm={searchTerm}
            filter={filter}
          />
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <ActivityWidget 
            data={activityData}
            refreshCount={refreshCount}
            searchTerm={searchTerm}
            filter={filter}
          />
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 2, height: 300 }}>
            <Box sx={{ fontWeight: 'bold', mb: 1 }}>
              Complex Metrics
            </Box>
            <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
              Processing {Object.keys(complexMetrics).length} metrics...
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12}>
          <TableWidget 
            data={filteredData}
            refreshCount={refreshCount}
            searchTerm={searchTerm}
            filter={filter}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 