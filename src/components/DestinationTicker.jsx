import React from 'react';
import { Star } from 'lucide-react';
import { DESTINATIONS } from '../data/destinationsData';

export default function DestinationTicker() {
  const items = [...DESTINATIONS, ...DESTINATIONS];

  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-track">
        {items.map((d, idx) => (
          <span key={`${d.id}-${idx}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}>
            <Star size={12} fill="#ffffff" stroke="none" />
            <span style={{ fontWeight: 700, letterSpacing: '0.04em', fontSize: '0.85rem' }}>{d.name}</span>
            <span style={{ opacity: 0.75, fontSize: '0.8rem' }}>{d.category}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
