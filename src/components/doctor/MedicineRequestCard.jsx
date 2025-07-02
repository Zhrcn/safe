import React from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

const STATUS = {
  pending: { icon: Clock, color: 'text-warning', label: 'Pending' },
  available: { icon: CheckCircle, color: 'text-success', label: 'Available' },
  not_available: { icon: XCircle, color: 'text-error', label: 'Not Available' },
};

function getStatusMeta(status, available) {
  if (status === 'pending') return STATUS.pending;
  if (status === 'responded' && available === true) return STATUS.available;
  if (status === 'responded' && available === false) return STATUS.not_available;
  return STATUS.pending;
}

const MedicineRequestCard = ({ request }) => {
  const { medicineName, pharmacyName, status, available, message, createdAt } = request;
  const { icon: Icon, color, label } = getStatusMeta(status, available);
  return (
    <div className="bg-muted rounded-xl p-4 border border-border flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-4 transition-shadow hover:shadow-lg">
      <div className="flex-1">
        <div className="font-medium text-card-foreground">
          <span className="text-primary">{medicineName}</span> at <span className="text-primary">{pharmacyName}</span>
        </div>
        <div className="text-xs mt-1 text-muted-foreground">
          {new Date(createdAt).toLocaleString()}
        </div>
      </div>
      <div className="flex items-center gap-2 min-w-[140px]">
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full bg-background border ${color} border-opacity-30 font-semibold text-xs`}> 
          <Icon className={`w-4 h-4 ${color}`} />
          {label}
        </span>
      </div>
      {status === 'responded' && (
        <div className="w-full md:w-auto text-sm mt-2 md:mt-0 text-card-foreground">
          {message}
        </div>
      )}
    </div>
  );
};

export default MedicineRequestCard; 