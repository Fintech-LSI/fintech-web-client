import { Component, OnInit } from '@angular/core';
import { FinnhubService } from "../../services/finnhub/finnhub.service";
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.scss']
})
export class StocksComponent implements OnInit {
  public chartOptions: ChartOptions;
  public companyNews: any[] = [];

  constructor(private finnhubService: FinnhubService) {
    this.chartOptions = {
      series: [
        {
          name: "Stock Prices",
          data: [10, 20, 30, 40, 50, 60, 70, 80, 90]
        }
      ],
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth"
      },
      title: {
        text: "Stock Trends by Month",
        align: "left"
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.5
        }
      },
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"]
      }
    };
  }

  ngOnInit(): void {
    this.loadCompanyNews("AAPL", "2024-11-23", "2024-11-24");
  }

  loadCompanyNews(symbol: string, from: string, to: string): void {
    this.finnhubService.getCompanyNews(symbol, from, to).subscribe(
      (news) => {
        this.companyNews = news;
        console.log("News: ", this.companyNews);
      },
      (error) => {
        console.error("Error fetching news: ", error);
      }
    );
  }
}
