import { FrownOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import { Bar } from "react-chartjs-2";

export type Order = {
  id: number;
  address: string;
  tick: string;
  side: number;
  amt: number;
  price: number;
  expiration: string;
  expired: number;
};

interface BarProps {
  orders: Order[];
}

function BarChart({ orders }: BarProps) {
  // Prepare Data for Bar Chart
  const barData = {
    labels: orders.map((order) => order.tick),
    datasets: [
      {
        label: "Buys",
        data: orders.map((order) => order.amt),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        hoverOffset: 4,
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    plugins: {
      title: {
        display: true,
        text: "Spending",
        color: "#5D647B",
        padding: {
          top: 10,
          bottom: 30,
        },
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    maintainAspectRatio: false,
    responsive: true,
  };

  useEffect(() => {}, [orders]);

  return (
    <>
      {orders.length === 0 ? (
        <div style={{ textAlign: "center" }}>
          <FrownOutlined
            style={{ fontSize: 20, color: "#bfbfbf", paddingTop: 75 }}
          />
          <p style={{ color: "#bfbfbf" }}>No buys to chart</p>
        </div>
      ) : (
        <Bar
          style={{ height: "350px", border: "1px solid rgb(217, 217, 217)" }}
          data={barData}
          options={barOptions}
        />
      )}
    </>
  );
}

export default BarChart;

/*
-------------------- References --------------------
Chart.js Bar Chart - https://www.chartjs.org/docs/latest/charts/bar.html
Chart.js Configuration - https://www.geeksforgeeks.org/chart-js-title-configuration/#
Bar Graph - https://wanuja18.medium.com/here-are-some-errors-which-i-faced-while-implementing-bar-chart-and-doughnut-chart-8d2cb639b632
*/
