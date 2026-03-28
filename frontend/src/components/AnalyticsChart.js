import React from 'react';

const AnalyticsChart = ({ data, title, type = 'bar' }) => {
  const maxValue = Math.max(...Object.values(data), 1);
  
  const colors = {
    'Payment Issue': '#ef4444',
    'Delivery Issue': '#f59e0b', 
    'Auth Issue': '#6366f1',
    'Technical': '#a855f7',
    'General': '#6b7280',
    'Critical': '#ef4444',
    'High': '#f59e0b',
    'Medium': '#6366f1',
    'Low': '#10b981',
    'Positive': '#10b981',
    'Neutral': '#6b7280',
    'Negative': '#ef4444'
  };

  return (
    <div className="glass-card" style={{
      padding: '24px',
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(99, 102, 241, 0.02))',
      border: '1px solid rgba(99, 102, 241, 0.2)'
    }}>
      <h3 style={{ 
        margin: '0 0 20px 0', 
        fontSize: '1.1rem', 
        fontWeight: '800',
        color: 'var(--text-primary)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        📈 {title}
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {Object.entries(data).map(([key, value]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ 
              minWidth: '100px', 
              fontSize: '0.85rem', 
              fontWeight: '600',
              color: 'var(--text-secondary)'
            }}>
              {key}
            </span>
            <div style={{ 
              flex: 1, 
              height: '24px', 
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <div style={{
                width: `${(value / maxValue) * 100}%`,
                height: '100%',
                background: `linear-gradient(135deg, ${colors[key] || '#6366f1'}, ${colors[key] || '#818cf8'})`,
                borderRadius: '12px',
                transition: 'width 0.8s ease-out',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingRight: '8px'
              }}>
                {value > 0 && (
                  <span style={{ 
                    fontSize: '0.75rem', 
                    fontWeight: '700',
                    color: 'white',
                    textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                  }}>
                    {value}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {Object.keys(data).length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: 'var(--text-muted)',
          fontSize: '0.9rem'
        }}>
          No data available yet...
        </div>
      )}
    </div>
  );
};

export default AnalyticsChart;
