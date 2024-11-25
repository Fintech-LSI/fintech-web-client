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
import { StocksService } from '../../services/stocks/stocks.service';
import { finalize } from 'rxjs/operators';

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
  selector: 'app-predictions',
  templateUrl: './predictions.component.html',
  styleUrl: './predictions.component.scss'
})
export class PredictionsComponent implements OnInit {
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

    this.predictionChartOptions = {
      series: [
        {
          name: "Actual Closing Price",
          data: [],
          color: '#2E93fA'  // Blue color for actual prices
        },
        {
          name: "Predicted Price",
          data: [],
          color: '#66DA26'  // Green color for predictions
        }
      ],
      chart: {
        type: "line",
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
      stroke: {
        width: [2, 2],
        curve: "smooth",
        dashArray: [0, 5]
      },
      fill: {
        opacity: 1
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
    this.getPredictions();
  }

  updatePar(p: string) {
    this.par = { symbol: p };
    this.getClose();
    this.getPredictions();
  }

  getClose() {
    this.stocksService.getData(this.par).subscribe((res: any) => {
      this.data = res;
      this.updateLineChart();
    });
  }

  getPredictions() {
    this.stocksService.getPredictions(this.par).subscribe((res: any) => {
      this.predictionData = res.filter((item: any) => {
        const itemDate = new Date(item.Date);
        const start = this.startDate ? new Date(this.startDate) : new Date(0);
        const end = this.endDate ? new Date(this.endDate) : new Date();
        return itemDate >= start && itemDate <= end;
      });
      this.updatePredictionChart();
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

  updatePredictionChart(): void {
    const actualData = this.predictionData.map(item => ({
      x: new Date(item.Date).getTime(),
      y: item.Close
    }));

    const predictedData = this.predictionData.map(item => ({
      x: new Date(item.Date).getTime(),
      y: item.Predictions
    }));

    this.predictionChartOptions.series = [
      {
        name: "Actual Closing Price",
        data: actualData
      },
      {
        name: "Predicted Price",
        data: predictedData
      }
    ];
  }
}
