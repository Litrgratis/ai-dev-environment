import React from 'react';
import { Line } from 'react-chartjs-2';

const FeedbackDashboard = ({ feedbackData }) => {
  const data = {
    labels: feedbackData.map(d => d.timestamp),
    datasets: [{
      label: 'Code Quality Score',
      data: feedbackData.map(d => d.score),
      borderColor: '#007bff',
      fill: false,
    }],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: { display: true },
      title: { display: true, text: 'Generator-Critic Feedback' },
    },
    scales: {
      y: { beginAtZero: true, max: 100 },
    },
  };
  return <Line data={data} options={options} />;
};

export default FeedbackDashboard;
