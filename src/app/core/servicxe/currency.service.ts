import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { evn } from '../../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {

  private endPoin = evn.currencyUrl;

  constructor(private http: HttpClient) { }

  getExchangeCurrency(): Observable<any> {
    return this.http.get<Observable<any>>(this.endPoin);
  }

}
