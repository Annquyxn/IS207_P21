import React from 'react';

const FormGroup = ({ children, className = '' }) => (
  <div className={`form-group ${className}`.trim()}>
    {children}
  </div>
);

export default FormGroup;
