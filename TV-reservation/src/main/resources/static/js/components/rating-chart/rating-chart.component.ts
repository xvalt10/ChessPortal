import { JwtAuthenticationService } from './../../services/jwtAuthenticationService';
import { HttpService } from './../../services/http-service.service';
import { Component, Input, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-rating-chart',
  templateUrl: './rating-chart.component.html',
  styleUrls: ['./rating-chart.component.css']
})
export class RatingChartComponent implements OnInit {

  public lineChartData: ChartDataSets[] = [];
  public lineChartLabels: Label[] = [];
  public lineChartOptions: ChartOptions = {
    scales: {
      xAxes: [{
        type: 'time',
        time: {
          unit: 'day',
          displayFormats: {
            day: 'MMM D', // This is the default
          },
        },
      }]
    },
    responsive: true,
  };
  public lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,0,0,0.3)',
    },
  ];
  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';
  public lineChartPlugins = [];

  @Input()
  public ratingType: string;

  constructor(private http: HttpService, private authService: JwtAuthenticationService) { }

  ngOnInit() {
    let user = this.authService.getUsername();
    this.http.getRatingHistoryByPlayerAndGameType(user, this.ratingType).subscribe(data => {
      let backenddata: any = data;
      this.lineChartLabels = backenddata.map(rating => new Date(rating.ratingTimestamp));
      //.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric' }));
      this.lineChartData[0] = { data: backenddata.map(rating => rating.userRating), label: this.ratingType.toLocaleLowerCase() + ' rating' };
      this.lineChartColors[0] = {
        borderColor: 'lightblue',
        backgroundColor: 'rgba(255,255,255,0.3)',
      }
    });

  }

}
