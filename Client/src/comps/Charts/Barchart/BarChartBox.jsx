/* eslint-disable react/prop-types */
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function BarChartBox({ data }) {
  return (
    <div>
      <div className="h-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart width={600} height={200} data={data}>
            <XAxis dataKey="date" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 8" />
            <Tooltip />
            <Legend />
            <Bar dataKey="totalpresent" fill="#3399ff" />
            <Bar dataKey="totalabsent" fill="lightcoral" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default BarChartBox;
