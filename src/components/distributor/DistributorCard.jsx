import React from 'react';

export default function DistributorCard({ distributor, onSelect }) {
  if (!distributor) return null;
  return (
    <div style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16, margin: 8, maxWidth: 350 }}>
      <h3>{distributor.companyName || distributor.user?.email}</h3>
      {distributor.contactName && <p><b>Contact:</b> {distributor.contactName}</p>}
      {distributor.contactEmail && <p><b>Email:</b> {distributor.contactEmail}</p>}
      {distributor.contactPhone && <p><b>Phone:</b> {distributor.contactPhone}</p>}
      {distributor.address && <p><b>Address:</b> {distributor.address}</p>}
      {onSelect && <button onClick={() => onSelect(distributor)}>Select</button>}
    </div>
  );
} 