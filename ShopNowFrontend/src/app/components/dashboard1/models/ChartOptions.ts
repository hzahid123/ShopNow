import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexYAxis, ApexTheme, ApexTooltip, ApexDataLabels, ApexLegend, ApexGrid, ApexPlotOptions, ApexFill } from "ng-apexcharts";

export type ChartOptions = {
    series: ApexAxisChartSeries;
    chart: ApexChart;
    xaxis: ApexXAxis;
    yaxis: ApexYAxis;
    stroke: any;
    theme: ApexTheme;
    tooltip: ApexTooltip;
    dataLabels: ApexDataLabels;
    legend: ApexLegend;
    colors: string[];
    markers: any;
    grid: ApexGrid;
    plotOptions: ApexPlotOptions;
    fill: ApexFill;
    labels: string[];
  };