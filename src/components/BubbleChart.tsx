import { FrownOutlined } from "@ant-design/icons";
import { useEffect } from "react";
import { Bubble } from "react-chartjs-2";
import { ChartOptions } from "chart.js";
import "chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm";

export type HistoricalRecord = {
  address: string;
  price: number;
  action: string;
  token_size: number;
  token: string;
  fee?: number;
  btc_amount?: number;
  datetime: string;
};

interface BubbleProps {
  records: HistoricalRecord[];
}

function BubbleChart({ records }: BubbleProps) {
  // Prepare Data for Bubble Chart
  const bubbleData = {
    datasets: [
      {
        label: "Buys",
        data: records
          .filter((record) => record.action === "buy")
          .map((buy: HistoricalRecord) => {
            return { x: buy.datetime, y: buy.price, r: buy.token_size };
          }),
        backgroundColor: ["rgba(76, 192, 192, 0.2)"],
        hoverOffset: 4,
        borderColor: ["rgba(76, 192, 192, 1)"],
        borderWidth: 1,
      },
      {
        label: "Sells",
        data: records
          .filter((record) => record.action === "sell")
          .map((sell: HistoricalRecord) => {
            return {
              x: sell.datetime,
              y: sell.price,
              r: sell.token_size,
            };
          }),
        backgroundColor: ["rgba(255, 100, 133, 0.2)"],
        hoverOffset: 4,
        borderColor: ["rgba(255, 100, 133, 0.2)"],
        borderWidth: 1,
      },
    ],
  };

  const bubbleOptions: ChartOptions<"bubble"> = {
    plugins: {
      title: {
        display: true,
        text: "Activity",
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
      x: {
        type: "time",
        time: {
          displayFormats: {
            quarter: "MMM DD YYYY",
          },
        },
      },
      y: {
        beginAtZero: true,
      },
    },
    maintainAspectRatio: false,
    responsive: true,
  };

  useEffect(() => {}, [records]);

  return (
    <>
      {records.length === 0 ? (
        <div style={{ textAlign: "center" }}>
          <FrownOutlined
            style={{ fontSize: 20, color: "#bfbfbf", paddingTop: 75 }}
          />
          <p style={{ color: "#bfbfbf" }}>No records to chart</p>
        </div>
      ) : (
        <Bubble
          style={{ height: "350px", border: "1px solid rgb(217, 217, 217)" }}
          data={bubbleData}
          options={bubbleOptions}
        />
      )}
    </>
  );
}

export default BubbleChart;

/*
-------------------- References --------------------
Chart.js Bubble Chart - https://www.chartjs.org/docs/latest/charts/bubble.html
Chart.js Guide - https://www.chartjs.org/docs/latest/getting-started/usage.html
Chart.js Time Cartesian Axis - https://www.chartjs.org/docs/latest/axes/cartesian/time.html
Chart.js Adapter - https://github.com/chartjs/awesome#adapters
*/
