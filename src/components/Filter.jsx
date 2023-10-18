// src/components/Filter.js
import React from 'react';
import './Filter.css';

function Filter({ handleGroupingChange }) {
  return (
    <div className="filter">
      <button onClick={() => handleGroupingChange('status')}>Group by Status</button>
      <button onClick={() => handleGroupingChange('user')}>Group by User</button>
      <button onClick={() => handleGroupingChange('priority')}>Group by Priority</button>
    </div>
  );
}

export default Filter;
