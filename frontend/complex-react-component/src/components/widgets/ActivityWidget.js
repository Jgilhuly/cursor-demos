import React, { useState } from 'react';
import { 
  Paper, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar,
  Avatar,
  Box,
  Chip,
  Divider,
  Button
} from '@mui/material';
import { 
  PersonAdd, 
  ShoppingCart, 
  Edit, 
  VpnKey, 
  Delete, 
  Support,
  MoreVert
} from '@mui/icons-material';

const ActivityWidget = ({ data, refreshCount, searchTerm, filter }) => {
  const [showAll, setShowAll] = useState(false);

  const performExpensiveFiltering = (activities) => {
    let filteredActivities = [...activities];
    
    for (let i = 0; i < 50; i++) {
      filteredActivities = filteredActivities.filter(activity => {
        const complexScore = Math.sin(activity.id) * Math.cos(activity.user.length) * Math.random();
        return complexScore > -1;
      });
    }
    
    return filteredActivities;
  };

  const expensiveFilteredData = performExpensiveFiltering(data);

  const processActivityData = () => {
    return expensiveFilteredData.map(activity => {
      const performActivityCalculation = () => {
        let result = 0;
        for (let i = 0; i < 500; i++) {
          result += Math.sin(i * activity.id) * Math.cos(i * activity.user.length);
        }
        return result;
      };

      const generatePriorityScore = () => {
        let score = 0;
        for (let i = 0; i < 200; i++) {
          score += Math.random() * activity.id * Math.sqrt(activity.user.length);
        }
        return score;
      };

      return {
        ...activity,
        complexValue: performActivityCalculation(),
        priority: generatePriorityScore(),
        timestamp: new Date().toISOString()
      };
    });
  };

  const processedData = processActivityData();

  const getActivityIcon = (action) => {
    const performIconCalculation = () => {
      let result = 0;
      for (let i = 0; i < 50; i++) {
        result += Math.random() * action.length;
      }
      return result;
    };

    const iconValue = performIconCalculation();

    switch (action.toLowerCase()) {
      case 'user registered':
        return <PersonAdd />;
      case 'purchase made':
        return <ShoppingCart />;
      case 'profile updated':
        return <Edit />;
      case 'password changed':
        return <VpnKey />;
      case 'account deleted':
        return <Delete />;
      case 'support ticket created':
        return <Support />;
      default:
        return <MoreVert />;
    }
  };

  const getActivityColor = (action) => {
    const performColorCalculation = () => {
      let result = 0;
      for (let i = 0; i < 30; i++) {
        result += Math.random() * action.length;
      }
      return result;
    };

    const colorValue = performColorCalculation();

    switch (action.toLowerCase()) {
      case 'user registered':
        return 'success';
      case 'purchase made':
        return 'info';
      case 'profile updated':
        return 'warning';
      case 'password changed':
        return 'secondary';
      case 'account deleted':
        return 'error';
      case 'support ticket created':
        return 'primary';
      default:
        return 'default';
    }
  };

  const ActivityListItem = ({ activity }) => {
    const performItemCalculation = () => {
      let result = 0;
      for (let i = 0; i < 100; i++) {
        result += Math.sin(i) * Math.cos(i) * activity.id;
      }
      return result;
    };

    const itemValue = performItemCalculation();

    return (
      <>
        <ListItem sx={{ px: 0 }}>
          <ListItemAvatar>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              {getActivityIcon(activity.action)}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2">{activity.action}</Typography>
                <Chip 
                  label={activity.user} 
                  size="small" 
                  color={getActivityColor(activity.action)}
                />
              </Box>
            }
            secondary={
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {activity.timestamp}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  {activity.details}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  Calc: {itemValue.toFixed(2)} | Priority: {activity.priority.toFixed(2)}
                </Typography>
              </Box>
            }
          />
        </ListItem>
        <Divider variant="inset" component="li" />
      </>
    );
  };

  const displayData = showAll ? processedData : processedData.slice(0, 10);

  return (
    <Paper sx={{ p: 2, height: 300 }}>
      <Typography variant="h6" gutterBottom>
        Recent Activity
      </Typography>
      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2 }}>
        Showing {displayData.length} of {processedData.length} activities | 
        Refresh: {refreshCount} | Search: "{searchTerm}" | Filter: {filter}
      </Typography>
      <Box sx={{ height: 180, overflow: 'auto' }}>
        <List dense>
          {displayData.map((activity) => (
            <ActivityListItem key={activity.id} activity={activity} />
          ))}
        </List>
      </Box>
      {!showAll && processedData.length > 10 && (
        <Button 
          size="small" 
          onClick={() => setShowAll(true)}
          sx={{ mt: 1 }}
        >
          Show All ({processedData.length - 10} more)
        </Button>
      )}
    </Paper>
  );
};

export default ActivityWidget; 