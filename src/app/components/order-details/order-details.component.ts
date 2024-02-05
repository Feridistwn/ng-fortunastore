import { CommonModule, registerLocaleData } from '@angular/common';
import { Component, Input, LOCALE_ID } from '@angular/core';
import localeId from '@angular/common/locales/id';

registerLocaleData(localeId, 'id');

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.css',
  providers: [{ provide: LOCALE_ID, useValue: "id-ID" },],
})
export class OrderDetailsComponent {
  @Input() order: any;

  constructor() { }

  ngOnInit() {
  }

  formatRupiahDate(dateString: string): string {
    const formattedDate = new Date(dateString).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
    return formattedDate;
  }
}
