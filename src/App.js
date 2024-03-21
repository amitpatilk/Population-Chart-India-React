import React from 'react';
import logo from './logo.svg';
import './App.css';
import PopulationPyramid from './PopulationPyramid';
import censusData from './census_age_india_only.csv';


function App() {
  return (
    <div className="App">
      <PopulationPyramid csvFile={censusData} />
    </div>
  );
}

export default App;
