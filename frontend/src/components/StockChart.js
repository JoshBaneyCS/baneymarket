import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

function StockChart({ data, label, themePreference }) {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (!data || !data.length) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map(entry => entry.date),
        datasets: [
          {
            label: label || 'Stock Price',
            data: data.map(entry => entry.close),
            borderColor: themePreference ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
            backgroundColor: themePreference ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)',
            fill: true,
            tension: 0.1
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            ticks: {
              color: themePreference ? '#000' : '#fff'
            }
          },
          y: {
            ticks: {
              color: themePreference ? '#000' : '#fff'
            }
          }
        },
        plugins: {
          legend: {
            labels: {
              color: themePreference ? '#000' : '#fff'
            }
          },
          title: {
            display: true,
            text: label || 'Stock Price History',
            color: themePreference ? '#000' : '#fff'
          }
        }
      }
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [data, label, themePreference]);

  return (
    <div className={`${themePreference ? 'bg-white' : 'bg-gray-800'} p-4 rounded shadow`}>
      <canvas ref={chartRef} />
    </div>
  );
}

export default StockChart;
