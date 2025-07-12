import React from 'react';

export const ApiStats: React.FC = () => {
  return (
    <div className="api-stats">
      <h3>API Client Info</h3>
      <div className="stats-grid">
        <div className="stat-item">
          <label>Base URL:</label>
          <span>https://jsonplaceholder.typicode.com</span>
        </div>
        <div className="stat-item">
          <label>API Type:</label>
          <span>REST</span>
        </div>
      </div>
      <div className="stats-description">
        <p>
          This is a basic REST API client stub. Features like caching, retry logic, and advanced error handling can be added.
        </p>
      </div>
    </div>
  );
}; 