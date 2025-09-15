import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { BaseURL } from '../../helper/helper'; // Adjust path as needed

function StudentChart() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartYear, setChartYear] = useState(new Date().getFullYear());

  // Fetch data from backend
  const fetchChartData = async () => {
    try {
      setLoading(true);
      // Fetch both income and expense data for the selected year
      const [incomeRes, expenseRes] = await Promise.all([
        axios.get(`${BaseURL}/accounts/income/yearly-summary?year=${chartYear}`),
        axios.get(`${BaseURL}/accounts/expense/yearly-summary?year=${chartYear}`)
      ]);
      
      const incomeData = incomeRes.data;
      const expenseData = expenseRes.data;
      
      // Combine the data
      const combinedData = incomeData.map((incomeMonth, index) => {
        const expenseMonth = expenseData[index] || { expense: 0 };
        return {
          name: incomeMonth.name,
          income: incomeMonth.income || 0,
          expense: expenseMonth.expense || 0
        };
      });
      
      setChartData(combinedData);
    } catch (error) {
      console.error("Error fetching chart data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChartData();
  }, [chartYear]);

  if (loading) {
    return <div>Loading chart data...</div>;
  }

  return (
    <div className='w-full'>
      <h2 className="text-xl font-bold text-gray-800 mb-2">Income & Expense for {chartYear}</h2>
      <div style={{ width: '100%', height: 250 }}>
        <ResponsiveContainer width="98%" height="90%">
          <BarChart
            data={chartData}
            margin={{
              top: 30,
              right: 25,
              left: 0,
              bottom: 5,
            }}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="income" fill="#178C4B" name="Income" />
            <Bar dataKey="expense" fill="#D80808" name="Expense" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default StudentChart;
