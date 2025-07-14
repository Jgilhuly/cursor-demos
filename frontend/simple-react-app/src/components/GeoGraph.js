import React, { useState, useEffect } from 'react';

const GeoGraph = () => {
  const [salesByRegion, setSalesByRegion] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalesByRegion = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/sales-by-region');
        const data = await response.json();
        setSalesByRegion(data);
      } catch (error) {
        console.error('Error fetching sales by region:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesByRegion();
  }, []);

  const getStateColor = (state) => {
    const stateData = salesByRegion.find(item => item.state === state);
    if (!stateData) return '#f0f0f0';
    
    const maxSales = Math.max(...salesByRegion.map(item => item.total_sales));
    const intensity = stateData.total_sales / maxSales;
    
    const alpha = 0.2 + (intensity * 0.8);
    return `rgba(59, 130, 246, ${alpha})`;
  };

  const getStateTooltip = (state) => {
    const stateData = salesByRegion.find(item => item.state === state);
    if (!stateData) return `${state}: No data`;
    return `${state}: ${stateData.total_sales.toLocaleString()} sales, $${stateData.total_revenue.toLocaleString()} revenue`;
  };

  if (loading) return <div>Loading geo graph...</div>;

  return (
    <div className="geo-graph">
      <h3>Sales by Region</h3>
      <div className="map-container">
        <svg viewBox="0 0 1000 600" className="us-map">
          {/* California */}
          <path
            d="M50 200 L100 150 L120 200 L140 250 L100 300 L80 280 L60 250 Z"
            fill={getStateColor('CA')}
            stroke="#333"
            strokeWidth="1"
          >
            <title>{getStateTooltip('CA')}</title>
          </path>
          
          {/* New York */}
          <path
            d="M700 120 L780 100 L800 140 L780 180 L720 160 Z"
            fill={getStateColor('NY')}
            stroke="#333"
            strokeWidth="1"
          >
            <title>{getStateTooltip('NY')}</title>
          </path>
          
          {/* Texas */}
          <path
            d="M400 350 L500 320 L520 380 L480 420 L400 400 Z"
            fill={getStateColor('TX')}
            stroke="#333"
            strokeWidth="1"
          >
            <title>{getStateTooltip('TX')}</title>
          </path>
          
          {/* Florida */}
          <path
            d="M650 420 L750 400 L780 450 L760 480 L650 460 Z"
            fill={getStateColor('FL')}
            stroke="#333"
            strokeWidth="1"
          >
            <title>{getStateTooltip('FL')}</title>
          </path>
          
          {/* Illinois */}
          <path
            d="M500 200 L550 180 L560 220 L540 250 L500 240 Z"
            fill={getStateColor('IL')}
            stroke="#333"
            strokeWidth="1"
          >
            <title>{getStateTooltip('IL')}</title>
          </path>
          
          {/* State labels */}
          <text x="90" y="230" fontSize="12" fill="#333">CA</text>
          <text x="740" y="140" fontSize="12" fill="#333">NY</text>
          <text x="450" y="370" fontSize="12" fill="#333">TX</text>
          <text x="700" y="440" fontSize="12" fill="#333">FL</text>
          <text x="520" y="220" fontSize="12" fill="#333">IL</text>
        </svg>
      </div>
      
      <div className="legend">
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: 'rgba(59, 130, 246, 0.2)' }}></div>
          <span>Low Sales</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: 'rgba(59, 130, 246, 1)' }}></div>
          <span>High Sales</span>
        </div>
      </div>
      
      <div className="sales-summary">
        {salesByRegion.map(region => (
          <div key={region.state} className="region-summary">
            <strong>{region.state}:</strong> {region.total_sales.toLocaleString()} sales, ${region.total_revenue.toLocaleString()} revenue
          </div>
        ))}
      </div>
    </div>
  );
};

export default GeoGraph;