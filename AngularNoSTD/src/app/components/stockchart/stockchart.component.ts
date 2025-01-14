import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexLegend,
  ApexFill,
  ApexTooltip,
  ChartComponent
} from "ng-apexcharts";
import {StocksService} from '../../services/stocks/stocks.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  labels: string[];
  legend: ApexLegend;
  fill: ApexFill;
  tooltip: ApexTooltip;
};

@Component({
  selector: 'app-stockchart',
  templateUrl: './stockchart.component.html',
  styleUrl: './stockchart.component.scss',
  standalone: false
})
export class StockchartComponent implements OnInit{
  @ViewChild("lineChart") lineChart!: ChartComponent;
  @ViewChild("predictionChart") predictionChart!: ChartComponent;

  public lineChartOptions!: Partial<ChartOptions>;
  public predictionChartOptions!: Partial<ChartOptions>;

  data: any[] = [];
  predictionData: any[] = [];
  currentYear: number = new Date().getFullYear();
  startDate: string = '';
  endDate: string = '';

  par = {
    symbol: "META"
  };
  pp: string = "META";

  constructor(private stocksService: StocksService, private router: Router) {
    this.initializeCharts();
  }
  preventScroll(event: WheelEvent | TouchEvent) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  }
  initializeCharts() {
    this.lineChartOptions = {
      series: [{
        name: "Closing Price",
        data: []
      }],
      chart: {
        type: "area",
        height: 350,
        animations: {
          enabled: true,
          speed: 800,
          animateGradually: {
            enabled: true,
            delay: 150
          },
          dynamicAnimation: {
            enabled: true,
            speed: 350
          }
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth",
        width: 2
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.3
        }
      },
      xaxis: {
        type: "datetime"
      },
      tooltip: {
        x: {
          format: "dd MMM yyyy"
        }
      }
    };

  }
  ngOnInit(): void {
    this.getClose();
  }

  updatePar(p: string) {
    this.par = { symbol: p };
    this.getClose();
  }

  getClose() {
    this.stocksService.getData(this.par).subscribe((res: any) => {
      this.data = res.slice(-60);
      this.updateLineChart();
    });
  }


  updateLineChart(): void {
    const filteredData = this.data.filter(item => {
      const date = new Date(item.Date);
      const start = this.startDate ? new Date(this.startDate) : new Date(0);
      const end = this.endDate ? new Date(this.endDate) : new Date();
      return date >= start && date <= end;
    });

    const chartData = filteredData.map(item => ({
      x: new Date(item.Date).getTime(),
      y: item.Close
    }));

    this.lineChartOptions.series = [{
      name: "Closing Price",
      data: chartData
    }];
  }

}
