import { FrownOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
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

function BarChart({ orders }: { orders: Order[] }) {
  const [buyOrders, setBuyOrders] = useState<any>([]);
  const [allOrders, setAllOrders] = useState(0);

  async function getSummary() {
    const elements = [];

    let totalOrders = 0;

    for (let order of orders) {
      totalOrders += 1;

    //   console.log(order);
      elements.push(order);
    }

    setBuyOrders(elements);
    setAllOrders(totalOrders);
    // console.log("----- BUY ORDERS ARRAY -----");
    // console.log(buyOrders);
  }

  const barData = {
    labels: buyOrders.map((order: Order) => order.tick),
    datasets: [
      {
        label: "Buys",
        data: buyOrders.map((order: Order) => order.amt),
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
          size: 16, // Specify the font size here
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    maintainAspectRatio: false, // Add this line to allow customizing the aspect ratio
    responsive: true, // Add this line to make the chart responsive
    // aspectRatio: 5, // Adjust this value to increase the height of the chart
  };

  useEffect(() => {
    getSummary();
    // console.log("----- BUY ORDERS ARRAY -----");
    // console.log(buyOrders);
    // console.log("----- TOTAL ORDERS -----");
    // console.log(allOrders);
  }, [orders]);

  return (
    <>
      {allOrders === 0 ? (
        <div style={{ textAlign: "center" }}>
          <FrownOutlined
            style={{ fontSize: 20, color: "#bfbfbf", paddingTop: 75 }}
          />
          <p style={{ color: "#bfbfbf" }}>No buys to chart</p>
        </div>
      ) : (
        <Bar style={{height: "350px"}} data={barData} options={barOptions} />
      )}
    </>
  );
}

export default BarChart;

/*
-------------------- References --------------------
Chart.js Bar Chart - https://www.chartjs.org/docs/latest/charts/bar.html
Chart.js Configuration - https://www.geeksforgeeks.org/chart-js-title-configuration/#
*/