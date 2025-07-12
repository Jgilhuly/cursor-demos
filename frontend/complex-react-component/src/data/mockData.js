export const generateStatsData = () => {
  return {
    totalUsers: 125847,
    activeUsers: 8934,
    revenue: 245890.50,
    conversionRate: 3.24,
    bounceRate: 67.8,
    pageViews: 1847293
  };
};

export const generateChartData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map(month => ({
    month,
    users: Math.floor(Math.random() * 5000) + 1000,
    revenue: Math.floor(Math.random() * 50000) + 10000,
    orders: Math.floor(Math.random() * 1000) + 100
  }));
};

export const generateTableData = () => {
  const users = [];
  const names = ['John Smith', 'Jane Doe', 'Bob Johnson', 'Alice Brown', 'Charlie Wilson', 'Diana Davis', 'Eve Miller', 'Frank Garcia', 'Grace Martinez', 'Henry Rodriguez'];
  const countries = ['USA', 'Canada', 'UK', 'Germany', 'France', 'Australia', 'Japan', 'Brazil', 'India', 'China'];
  const statuses = ['Active', 'Inactive', 'Pending', 'Suspended'];
  
  for (let i = 0; i < 1000; i++) {
    users.push({
      id: i + 1,
      name: names[Math.floor(Math.random() * names.length)],
      email: `user${i + 1}@example.com`,
      country: countries[Math.floor(Math.random() * countries.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      joinDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toLocaleDateString(),
      lastActive: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      purchases: Math.floor(Math.random() * 50),
      totalSpent: Math.floor(Math.random() * 10000) + 100
    });
  }
  
  return users;
};

export const generateActivityData = () => {
  const activities = [];
  const actions = ['User registered', 'Purchase made', 'Profile updated', 'Password changed', 'Account deleted', 'Support ticket created'];
  const users = ['John Smith', 'Jane Doe', 'Bob Johnson', 'Alice Brown', 'Charlie Wilson'];
  
  for (let i = 0; i < 500; i++) {
    activities.push({
      id: i + 1,
      action: actions[Math.floor(Math.random() * actions.length)],
      user: users[Math.floor(Math.random() * users.length)],
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 7) * 24 * 60 * 60 * 1000).toLocaleString(),
      details: `Activity ${i + 1} details with some additional information that makes this longer`
    });
  }
  
  return activities;
};

export const processExpensiveData = (data) => {
  return data.map(item => ({
    ...item,
    processedField: Math.sin(item.id) * Math.cos(item.id) * Math.random(),
    complexCalculation: Array.from({ length: 100 }, (_, i) => i * Math.random()).reduce((a, b) => a + b, 0)
  }));
}; 