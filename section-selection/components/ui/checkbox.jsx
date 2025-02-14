import * as React from 'react';

const CheckBox = ({ label, value, onChange, fontSize = '0.9rem', fontWeight = 'normal', color = 'black', fontFamily = 'Arial, Helvetica, sans-serif' }) => {
  return (
    <label style={{ fontSize, fontWeight, color, fontFamily }} className="flex items-center space-x-2">
      <input type="checkbox" checked={value} onChange={onChange} />
      <span>{label}</span>
    </label>
  );
};

export { CheckBox };
