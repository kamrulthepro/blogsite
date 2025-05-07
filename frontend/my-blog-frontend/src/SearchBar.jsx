// src/SearchBar.js
import React, { useState } from 'react';
import './App.css';

const SearchBar = ({ data }) => {
  const [query, setQuery] = useState('');

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const filteredData = data.filter(item =>
    item.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className='search'>
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={handleInputChange}
      />
      <div className='search_res'>
        {filteredData.map((item, index) => (
          <div key={index}>{item}</div>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
