import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';

const Chartdata = [
  { name: 'Jan', income: 5200, expense: 820 },
  { name: 'Feb', income: 3000, expense: 1000 },
  { name: 'Jan', income: 5200, expense: 820 },
  { name: 'Feb', income: 3000, expense: 1000 },
  { name: 'Jan', income: 5200, expense: 820 },
  { name: 'Feb', income: 3000, expense: 1000 },
  { name: 'Jan', income: 5200, expense: 820 },
];

function StudentChart() {
  return (
    <div style={{ width: '100%', height: 250 }}>
      <ResponsiveContainer width="98%" height="90%">
        <BarChart
          data={Chartdata}
          margin={{
            top: 30,
            right: 25,
            left: 0,
            bottom: 5,
          }}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <Bar dataKey="income" fill="#178C4B" name="Income" />
          <Bar dataKey="expense" fill="#D80808" name="Expense" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default StudentChart;