import React from 'react';

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-3xl shadow-xl border border-primary-50 p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${className}`}>
    {children}
  </div>
);

export default Card;