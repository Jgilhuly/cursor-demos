import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ChartWidget = ({ data, refreshCount, searchTerm, filter }) => {
  const performExpensiveDataProcessing = () => {
    let processedData = [...data];
    
    for (let i = 0; i < 1000; i++) {
      processedData = processedData.map(item => ({
        ...item,
        complexValue: Math.sin(item.users * i) * Math.cos(item.revenue * i),
        expensiveCalc: Array.from({ length: 100 }, (_, index) => index * Math.random()).reduce((a, b) => a + b, 0)
      }));
    }
    
    return processedData;
  };

  const expensiveProcessedData = performExpensiveDataProcessing();

  const generateRandomData = () => {
    const newData = [];
    for (let i = 0; i < 12; i++) {
      newData.push({
        month: data[i]?.month || `Month ${i + 1}`,
        users: Math.floor(Math.random() * 5000) + 1000,
        revenue: Math.floor(Math.random() * 50000) + 10000,
        randomValue: Math.random() * 1000
      });
    }
    return newData;
  };

  const randomData = generateRandomData();

  const processChartData = () => {
    const processed = expensiveProcessedData.map(item => {
      const heavyCalculation = () => {
        let result = 0;
        for (let j = 0; j < 10000; j++) {
          result += Math.sin(j) * Math.cos(j) * item.users;
        }
        return result;
      };

      return {
        ...item,
        heavyValue: heavyCalculation(),
        timestamp: new Date().toISOString()
      };
    });

    return processed;
  };

  const finalData = processChartData();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const performTooltipCalculation = () => {
        let result = 0;
        for (let i = 0; i < 5000; i++) {
          result += Math.random() * i;
        }
        return result;
      };

      const tooltipValue = performTooltipCalculation();

      return (
        <Box sx={{ 
          bgcolor: 'background.paper', 
          p: 1, 
          border: 1, 
          borderColor: 'divider',
          borderRadius: 1,
          boxShadow: 1 
        }}>
          <Typography variant="body2">{`${label}`}</Typography>
          {payload.map((entry, index) => (
            <Typography key={index} variant="body2" sx={{ color: entry.color }}>
              {`${entry.name}: ${entry.value.toLocaleString()}`}
            </Typography>
          ))}
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Tooltip calc: {tooltipValue.toFixed(2)}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Paper sx={{ p: 2, height: 300 }}>
      <Typography variant="h6" gutterBottom>
        User Growth
      </Typography>
      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2 }}>
        Refresh: {refreshCount} | Search: "{searchTerm}" | Filter: {filter}
      </Typography>
      <Box sx={{ height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={finalData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="users" 
              stroke="#1976d2" 
              strokeWidth={2}
              dot={{ fill: '#1976d2', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        Processed {finalData.length} data points
      </Typography>
    </Paper>
  );
};

export default ChartWidget; 