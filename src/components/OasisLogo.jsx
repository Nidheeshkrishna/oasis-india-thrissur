import React from 'react';

export default function OasisLogo({ height = 48, className = '', style = {} }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', ...style }} className={className}>
      <img
        src="/oasis-thrissur-logo.jpg"
        alt="OASIS India Thrissur Logo"
        style={{
          height: `${height}px`,
          width: 'auto',
          objectFit: 'contain',
          borderRadius: '4px'
        }}
      />
    </div>
  );
}
