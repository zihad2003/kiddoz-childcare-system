import React from 'react';

const Badge = ({ children, color = "bg-primary-100 text-primary-700" }) => (
  <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${color}`}>
    {children}
  </span>
);

export default Badge;