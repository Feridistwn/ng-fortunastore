import { CurrencyPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'indonesianCurrency',
  standalone: true
})
export class IndonesianCurrencyPipe implements PipeTransform {
  private currencyPipe: CurrencyPipe = new CurrencyPipe('id-ID');

  transform(value: any, currencyCode: string = 'IDR', display: 'symbol' | 'code' | 'symbol-narrow' | boolean = 'symbol', digitsInfo: string = '1.0-0'): any {
    return this.currencyPipe.transform(value, currencyCode, display, digitsInfo);
  }
}
