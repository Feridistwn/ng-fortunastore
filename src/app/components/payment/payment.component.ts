import { Component, Input, OnInit, Renderer2 } from '@angular/core';
import { DataService } from '../../data-service.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';

declare var snap: any; // Declare Snap as a variable (assuming it's included in your project)

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit {
  @Input() ckey: string = '';
  @Input() snapkey: string = '';


  private midtransScriptSrc = 'https://app.sandbox.midtrans.com/snap/snap.js';
  constructor(private renderer: Renderer2) {

  }


  ngOnInit(): void {
    this.startSnapPayment(this.ckey, this.snapkey);
  }


  private loadScript(clientKey: string): any {
    const script = this.renderer.createElement('script');
    this.renderer.setAttribute(script, 'type', 'text/javascript');
    this.renderer.setAttribute(script, 'src', this.midtransScriptSrc);
    this.renderer.setAttribute(script, 'data-client-key', clientKey);


    // Optionally, you can add attributes or set an onload callback
    // this.renderer.setAttribute(script, 'async', 'true');
    // this.renderer.listen(script, 'load', () => console.log('Script loaded successfully'));

    // Append the script to the head of the document
    this.renderer.appendChild(document.head, script);

    return script;
  }

  startSnapPayment(clientKey: any, snapToken: any): void {
    // console.log('starting snap payment')
    let script = this.loadScript(clientKey);
    script.onload = () => {
      // console.log('initializing snap');
      // this.initSnap(snapToken);

      snap.pay(snapToken, {
        onSuccess: function (result: any) {
          console.log('success'); console.log(result);
        },
        onPending: function (result: any) {
          console.log('pending'); console.log(result);
        },
        onError: function (result: any) {
          console.log('error'); console.log(result);
        },
        onClose: function () {
          console.log('customer closed the popup without finishing the payment'); }
      })
    }
  }

  private initSnap(token: string): void {
    snap.embed(token, {
      embedId: 'snap-container',
      onSuccess: (result: any) => {
        console.log('Payment success:', result);
        // Add your success handling logic here
      },
      onPending: (result: any) => {
        console.log('Payment pending:', result);
        // Add your pending handling logic here
      },
      onError: (result: any) => {
        console.error('Payment error:', result);
        // Add your error handling logic here
      },
      onClose: () => {
        console.log('Payment closed');
        // Add your close handling logic here
      }
    });
  }
}
