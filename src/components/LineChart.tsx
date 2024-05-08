import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { FrownOutlined } from "@ant-design/icons";
import { ChartOptions } from "chart.js";

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

function calculateProfitsPerMonth(orders: Order[]) {
  const monthsOfYear = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const monthlyProfits = {
    months: monthsOfYear,
    profits: Array(monthsOfYear.length).fill(0),
  };

  for (let order of orders) {
    let revenue = order.price * order.amt;
    if (!order.expiration) {
      console.log("Dec");
      monthlyProfits.profits[11] += revenue;
    } else {
      let mon = Number(order.expiration.slice(5, 7));
      monthlyProfits.profits[mon - 1] += revenue;
    }
  }

  return monthlyProfits;
}

function LineChart({ orders }: { orders: Order[] }) {
  const [sellOrders, setSellOrders] = useState<any>([]);
  const [allOrders, setAllOrders] = useState(0);

  async function getSummary() {
    const elements = [];

    let totalOrders = 0;

    for (let order of orders) {
      totalOrders += 1;

      console.log(order);
      elements.push(order);
    }

    setSellOrders(elements);
    setAllOrders(totalOrders);
  }

  const monthlyProfits = calculateProfitsPerMonth(orders);

  // Prepare Data for Line Chart
  const lineData = {
    labels: monthlyProfits.months,
    datasets: [
      {
        label: "Sales",
        data: monthlyProfits.profits,
        fill: false,
        borderColor: "rgba(75,192,192,1)",
        hoverOffset: 4,
        tension: 0.1,
      },
    ],
  };

  const lineOptions: ChartOptions<"line"> = {
    plugins: {
      title: {
        display: true,
        text: "Profits",
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
  };

  useEffect(() => {
    getSummary();
  }, [orders]);

  return (
    <>
      {allOrders === 0 ? (
        <div style={{ textAlign: "center" }}>
          <FrownOutlined
            style={{ fontSize: 20, color: "#bfbfbf", paddingTop: 75 }}
          />
          <p style={{ color: "#bfbfbf" }}>No sales to chart</p>
        </div>
      ) : (
        <Line
          style={{ height: "350px", border: "1px solid rgb(217, 217, 217)" }}
          data={lineData}
          options={lineOptions}
        />
      )}
    </>
  );
}

export default LineChart;

/*
-------------------- References --------------------
Chart.js Line Chart - https://www.chartjs.org/docs/latest/charts/line.html
Chart.js Configuration - https://www.geeksforgeeks.org/chart-js-title-configuration/#
*/
