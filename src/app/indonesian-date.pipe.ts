import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'indonesianDate',
  standalone: true
})
export class IndonesianDatePipe implements PipeTransform {
  private datePipe: DatePipe = new DatePipe('id-ID');

  transform(value: any, format: string = 'shortDate'): any {
    return this.datePipe.transform(value, format);
  }

}
