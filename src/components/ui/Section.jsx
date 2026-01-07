import React from 'react';

const Section = ({ children, className = "", id = "" }) => (
  <section id={id} className={`py-20 px-4 md:px-8 max-w-7xl mx-auto ${className}`}>
    {children}
  </section>
);

export default Section;