import React from 'react';
import { CheckCircle, AlertTriangle, Clock } from 'lucide-react';

const statusLabels = {
  active: "نشط",
  completed: "مكتمل",
  overdue: "متأخر",
  rented: "مؤجر",
  available: "متاح",
  maintenance: "صيانة"
};

const statusConfig = {
  active: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
  completed: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
  overdue: { color: 'bg-red-100 text-red-800', icon: AlertTriangle },
  rented: { color: 'bg-orange-100 text-orange-800', icon: Clock },
  available: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
  maintenance: { color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle }
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.active;
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      <Icon className="w-3 h-3 mr-1" />
      {statusLabels[status] || status}
    </span>
  );
}