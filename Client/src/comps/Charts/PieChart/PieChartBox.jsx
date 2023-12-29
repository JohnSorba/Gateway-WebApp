/* eslint-disable react/prop-types */
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import "./PieChartBox.css";

const PieChartBox = ({ genderCountData }) => {
  return (
    <div className="pie-chart-box">
      <h3 className="text-lg text-center py-2 font-semibold">
        Ratio of Boys and Girls in the School
      </h3>
      <div className="chart">
        <ResponsiveContainer width="99%" height={300}>
          <PieChart>
            <Tooltip
              contentStyle={{ backgroundColor: "white", borderRadius: "5px" }}
            />
            <Pie
              data={genderCountData}
              innerRadius={"70%"}
              outerRadius={"90%"}
              paddingAngle={5}
              dataKey="value"
            >
              {genderCountData &&
                genderCountData.map((item) => (
                  <Cell key={item.name} fill={item.color} />
                ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="chart-options">
        {genderCountData &&
          genderCountData.map((item) => (
            <div key={item.name} className="option">
              <div className="title">
                <div
                  className="dot"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-xl font-semibold">{item.name}</span>
              </div>
              <span className="text-lg">{item.value}</span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default PieChartBox;
