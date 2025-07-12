import React from 'react';
import type { ApiClient } from '../client/apiClient';

interface ApiStatsProps {
  client: ApiClient;
}

export const ApiStats: React.FC<ApiStatsProps> = ({ client }) => {
  const cacheSize = client.getCacheSize();

  return (
    <div className="api-stats">
      <h3>API Client Statistics</h3>
      <div className="stats-grid">
        <div className="stat-item">
          <label>Cache Size:</label>
          <span>{cacheSize} items</span>
        </div>
        <div className="stat-item">
          <label>Base URL:</label>
          <span>https://jsonplaceholder.typicode.com</span>
        </div>
        <div className="stat-item">
          <label>Cache TTL:</label>
          <span>5 minutes</span>
        </div>
        <div className="stat-item">
          <label>Max Retries:</label>
          <span>3 attempts</span>
        </div>
      </div>
      <div className="stats-description">
        <p>
          This client demonstrates TypeScript integration, automatic retries with exponential backoff,
          response caching, and comprehensive error handling.
        </p>
      </div>
    </div>
  );
}; 