import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import * as d3 from 'd3';

const readCsvData = (csvFile, setChartData, dataSelection) => {
  d3.csv(csvFile).then((data) => {
    const filteredData = data.filter(row => row['Age Group'] !== 'All ages' && row['Age Group'] !== 'Age not stated');
    filteredData.reverse();

    // It calculates totals for males, females, rural males, rural females, urban males, and urban females.
    const totalMales = d3.sum(filteredData, row => +row['Total Males']);
    const totalFemales = d3.sum(filteredData, row => +row['Total Females']);
    const totalRuralMales = d3.sum(filteredData, row => +row['Rural Males']);
    const totalRuralFemales = d3.sum(filteredData, row => +row['Rural Females']);
    const totalUrbanMales = d3.sum(filteredData, row => +row['Urban Males']);
    const totalUrbanFemales = d3.sum(filteredData, row => +row['Urban Females']);


    // Depending on the dataSelection parameter ('total', 'rural', or 'urban'), it prepares datasets for the chart, where the data points are percentages of the total population within each category.
    const datasets = dataSelection === 'total' ? [
      {
        label: 'Males',
        // Minus sign to display Male bars on the left and vice versa.
        data: filteredData.map(row => -Math.abs((+row['Total Males'] / totalMales) * 100)),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
      {
        label: 'Females',
        data: filteredData.map(row => Math.abs((+row['Total Females'] / totalFemales) * 100)),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }
    ] : dataSelection === 'rural' ?[
      {
        label: 'Rural Males',
        data: filteredData.map(row => -Math.abs((+row['Rural Males'] / totalRuralMales) * 100)),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
      {
        label: 'Rural Females',
        data: filteredData.map(row => Math.abs((+row['Rural Females'] / totalRuralFemales) * 100)),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }
    ] : [
      {
        label: 'Urban Males',
        // Minus sign to display Male bars on the left and vice versa
        data: filteredData.map(row => -Math.abs((+row['Urban Males'] / totalUrbanMales) * 100)),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
      {
        label: 'Urban Females',
        data: filteredData.map(row => Math.abs((+row['Urban Females'] / totalUrbanFemales) * 100)),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }
    ];
    
    setChartData({
      labels: filteredData.map(row => row['Age Group']),
      datasets,
    });
  });
};

const PopulationPyramid = ({ csvFile }) => {
  // It maintains the chartData state for storing the processed chart data and dataSelection state to determine the type of data to display (total, rural, or urban).
  const [chartData, setChartData] = useState(null);
  const [dataSelection, setDataSelection] = useState('total');

  // Updates the dataSelection state based on the user's choice (total, rural, urban) from the dropdown. This selection change triggers a chart update to display the corresponding population data.
  const handleSelectionChange = (event) => {
    setDataSelection(event.target.value);
  };

  // The useEffect hook re-runs the readCsvData function whenever the csvFile or dataSelection changes, to update the chart data accordingly.
  useEffect(() => {
    readCsvData(csvFile, setChartData, dataSelection);
  }, [csvFile, dataSelection]);

  const options = {
    indexAxis: 'y',
    scales: {
      x: {
        stacked: true,
        grid: {
          display: false,
        },
        title: {
          display: true,
          text: 'Percentage',
          color: '#666',
          fontWeight: 'bold',
        },
        ticks: {
          callback: value => Math.abs(value),
        },
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: 'Age Group',
          color: '#666',
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: context => {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            label += Math.abs(context.parsed.x).toFixed(2) + '%';
            return label;
          },
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    // A selection dropdown allows the user to switch between total, rural, and urban population types, which updates the dataSelection state and consequently the displayed data.
    // The chart options are configured to customize the appearance and behavior of the chart, including setting the x-axis to display absolute values and customizing tooltips.
    <div style={{ height: '500px', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px', marginTop: '20px' }}>
        <span style={{ marginRight: '10px', fontWeight: 'bold'}}>India Population Graph || Select Population Type: </span>
        <select value={dataSelection} onChange={handleSelectionChange}>
          <option value="total">Total</option>
          <option value="rural">Rural</option>
          <option value="Urban">Urban</option>
        </select>
      </div>
      {/* The component renders a div that contains the selection dropdown and the Bar chart. The chart is only rendered if chartData is not null, ensuring that there's valid data to display. */}
      {chartData && <Bar data={chartData} options={options} />}
    </div>
  );
};

export default PopulationPyramid;
