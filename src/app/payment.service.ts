import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../environments/environment.development';
import { ShoppingCartService } from './shopping-cart.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private urlInitPayment = environment.apiUrl + '/payment/initiate';
  http = inject(HttpClient);
  cartService = inject(ShoppingCartService);

  constructor() { }

  tryCheckout(data: any, items: any) {

    data['products'] = { items };

    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    });


    //console.log(data);
    return this.http.post(this.urlInitPayment, data, { headers });
  }
}
