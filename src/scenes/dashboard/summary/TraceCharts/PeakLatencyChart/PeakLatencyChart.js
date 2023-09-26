import React from "react";
import ReactApexChart from "react-apexcharts";

const PeakLatencyChart = () => {
  const data = [
    { serviceName: "Service A", peakLatency: 10 },
    { serviceName: "Service B", peakLatency: 20 },
    { serviceName: "Service C", peakLatency: 15 },
    // Add more data as needed
  ];
  const peakLatencyOptions = {
    chart: {
      type: "bar",
    },
    // zoom: {
    //   enabled: true,
    //   type: "x",
    //   resetIcon: {
    //     offsetX: -10,
    //     offsetY: 0,
    //     fillColor: "#fff",
    //     strokeColor: "#37474F",
    //   },
    //   selection: {
    //     background: "#90CAF9",
    //     border: "#0D47A1",
    //   },
    // },
    plotOptions: {
      bar: {
        columnWidth: "30px",
      },
    },
    xaxis: {
      categories: data.map((item) => item.serviceName),
      title: {
        text: "List of Services",
        style: {
          fontSize: "13px",
          fontWeight: "normal",
          // color:  '#263238'
        },
      },
    },
    yaxis: {
      title: {
        text: "Latency(ms)",
        style: {
          fontSize: "12px",
          fontWeight: "normal",
          // color:  '#263238'
        },
      },
    },
    title: {
      text: "Peak Latency(ms)",
      align: "center",
      margin: 5,
      offsetX: 0,
      offsetY: 5,
      style: {
        fontSize: "18px",
        fontWeight: "bold",
        // fontFamily:  undefined,
        color: "#263238",
      },
    },
  };

  const peakLatencySeries = [
    {
      name: "Peak Latency",
      data: data.map((item) => item.peakLatency),
    },
  ];
  return (
    <div>
      <ReactApexChart
        options={peakLatencyOptions}
        series={peakLatencySeries}
        type="bar"
        height={250}
      />
    </div>
  );
};

export default PeakLatencyChart;
