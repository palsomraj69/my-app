// src/components/Sort.js
import React from 'react';
import './Sort.css';

function Sort({ handleSortingChange }) {
  return (
    <div className="sort">
      <button onClick={() => handleSortingChange('title')}>Sort by Title</button>
      <button onClick={() => handleSortingChange('priority')}>Sort by Priority</button>
    </div>
  );
}

export default Sort;
