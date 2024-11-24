import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StocksService {

  url = "http://localhost:5000" ;

  constructor(private httpClient:HttpClient) { }

  getData(data:any): Observable<any>{
    return this.httpClient.post(this.url+
      "/get_stock_data",data, {
      headers: new HttpHeaders().set('Content-Type','application/json')
    })
  }


  getRealTimeData(){
    return this.httpClient.get(this.url + "/data")
  }

  getPredictions(data:any){
    return this.httpClient.post(this.url+
      "/predictions",data, {
      headers: new HttpHeaders().set('Content-Type','application/json')
    })  }



}
