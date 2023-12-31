/* eslint-disable react/prop-types */
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
    ResponsiveContainer,
} from "recharts";

const LineChartBox = ({ data }) => {
  return (
    <div>
      <ResponsiveContainer width="100%" height="100%">
      <LineChart width={600} height={300} data={data}>
        <XAxis dataKey="date" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="totalpresent" stroke="green" />
        <Line type="monotone" dataKey="totalabsent" stroke="red" />
      </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartBox;
