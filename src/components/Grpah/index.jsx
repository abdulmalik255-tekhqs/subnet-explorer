import React, { useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useDispatch, useSelector } from "react-redux";

const TxHistoryChart = () => {
  const disptach = useDispatch();
  const { txnHistory } = useSelector((state) => state.blocks);
  const data = txnHistory?.dailyTxs;

  // data = last14DaysTxs.dailyTxs
  const handleFetchBlocks = () => {
    disptach.blocks.handleGetTxns();
  };

  useEffect(() => {
    handleFetchBlocks();
    const interval = setInterval(() => {
      handleFetchBlocks();
    }, 10000);

    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, []);
  const categories =
    data?.map((d) =>
      new Date(d.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    ) || [];

  const seriesData = data?.map((d) => Number(d.txCount)) || [];

  const options = {
    chart: {
      type: "line",
      backgroundColor: "transparent",
      height: 280,
      spacingBottom: 10,
      marginBottom: 80,
    },
    title: {
      text: "",
      style: { color: "#003768" },
    },
    xAxis: {
      categories,
      title: { text: "" },
      labels: { style: { color: "#aaa" } },
    },
    yAxis: {
      title: { text: "" },
      labels: { style: { color: "#aaa" } },
    },
    tooltip: {
      shared: true,
      backgroundColor: "#111",
      style: { color: "#fff" },
    },
    series: [
      {
        name: "Transactions",
        data: seriesData,
        color: "#3b82f6",
      },
    ],
    legend: {
      itemStyle: { color: "#003768" },
    },
    credits: {
      enabled: false,
    },
  };

  return (
    <div className="w-full h-full">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default TxHistoryChart;
