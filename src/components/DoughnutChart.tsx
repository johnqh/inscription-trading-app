import { FrownOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";

export type Holding = {
  tick: string;
  address: string;
  amt: number;
  updated_at_block: number;
};

interface DoughnutProps {
  holdings: Holding[];
}

function DoughnutChart({ holdings }: DoughnutProps) {
  const [totalTokens, setTotalTokens] = useState(0);
  const [tick, setTick] = useState<any[]>([]);

  async function getSummary() {
    const elements = [];

    let tokens = 0;

    for (let token of holdings) {
      // If 0, Don't Include Token in User's BRC-20 Portfolio
      if (token.amt === 0) {
        continue;
      }
      console.log(token);
      elements.push(token);
      tokens += token.amt;
    }

    setTick(elements);
    setTotalTokens(tokens);
  }

  // Prepare Data for Doughnut Chart
  const doughnutData = {
    labels: tick.map((token) => token.tick),
    datasets: [
      {
        label: "Token Holdings",
        data: tick.map((token) => token.amt), // Use tick array to extract token amounts
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF8A65",
        ],
        hoverOffset: 4,
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF8A65",
        ],
      },
    ],
  };

  const doughnutOptions = {
    type: "doughnut",
    plugins: {
      title: {
        display: true,
        text: "BRC-20 Portfolio",
        color: "#5D647B",
        padding: {
          top: 10,
          bottom: 30,
        },
        font: {
          size: 16,
        },
      },
      legend: {
        display: true,
      },
      hover: {
        mode: "index",
      },
    },
  };

  useEffect(() => {
    getSummary();
  }, [holdings]);

  return (
    <>
      {totalTokens === 0 ? (
        <div style={{ textAlign: "center" }}>
          <FrownOutlined
            style={{ fontSize: 20, color: "#bfbfbf", paddingTop: 75 }}
          />
          <p style={{ color: "#bfbfbf" }}>No tokens to chart</p>
        </div>
      ) : (
        <div
          style={{ height: "350px", border: "1px solid rgb(217, 217, 217)" }}
        >
          <Doughnut
            data={doughnutData}
            options={doughnutOptions}
          ></Doughnut>
        </div>
      )}
    </>
  );
}

export default DoughnutChart;

/*
-------------------- References --------------------
Chart.js Doughnut Chart - https://www.chartjs.org/docs/latest/charts/doughnut.html
Chart.js Configuration - https://www.geeksforgeeks.org/chart-js-title-configuration/#
Chart.js Tooltip not Showing up - https://stackoverflow.com/questions/24867060/chart-js-tooltip-not-showing
*/
