import { Component, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
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
import {catchError, Subscription, timeout} from 'rxjs';

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
export class StocksComponent implements OnInit, OnDestroy, OnChanges {
  public chartOptions: ChartOptions;
  public companyNews: any[] = [];
  private intervalId: any;
  private subscription: Subscription = new Subscription();



  data: any = 0;
  previousPrice: number = 0; // Set this to the last known price
  currentPrice: number = 0; // This will be updated with the latest price
  priceChange: number = 0;
  percentageChange: number = 0;

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
    if (typeof window !== 'undefined') {
      // Only execute client-side logic
      this.loadCompanyNews("AAPL", "2024-11-24","2024-11-24");
      this.startDataFetchInterval();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.getData();
    }
  }

  ngOnDestroy(): void {
    this.clearResources();
  }

  /**
   * Start the interval for fetching real-time data
   */
  startDataFetchInterval(): void {
    if (typeof window === 'undefined') {
      // SSR environment: Do not start intervals
      return;
    }

    this.getData();
    this.intervalId = setInterval(() => {
      this.getData();
    }, 10000);
  }


  /**
   * Fetch real-time data and handle errors
   */

  getData(): void {
    const dataSubscription = this.finnhubService
      .getRealTimeData()
      .pipe(
        timeout(10000),
        catchError((err) => {
          console.error("Error or timeout fetching data:", err);
          return []; // Return empty data or fallback
        })
      )
      .subscribe({
        next: (res) => {
          this.previousPrice = this.currentPrice; // Store the previous price
          this.data = res
          this.currentPrice = this.data.data[0].p; // Assuming res.price contains the current price
          this.calculateChange(); // Calculate the change
        },
      });
    this.subscription.add(dataSubscription);
  }

  calculateChange(): void {
    this.priceChange = this.currentPrice - this.previousPrice;
    this.percentageChange = this.previousPrice !== 0 ? (this.priceChange / this.previousPrice) * 100 : 0;
  }

  /**
   * Clear resources like intervals and subscriptions
   */
  clearResources(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.subscription.unsubscribe();
    this.subscription = new Subscription(); // Reset subscription
  }

  loadCompanyNews(symbol: string, from: string, to: string): void {
    const newsSubscription = this.finnhubService.getCompanyNews(symbol, from, to).subscribe({
      next: (news) => {
        this.companyNews = news;
        console.log("News: ", this.companyNews);
      },
      error: (error) => {
        console.error("Error fetching news: ", error);
      }
    });
    this.subscription.add(newsSubscription);
  }





}
