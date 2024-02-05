import { Component, LOCALE_ID } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { NavbarComponent } from "../navbar/navbar.component";
import { DataTablesModule } from 'angular-datatables';
import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../../data-service.service';
import { OrderDetailsComponent } from "../order-details/order-details.component";
import localeId from '@angular/common/locales/id';

registerLocaleData(localeId, 'id');

@Component({
  selector: 'app-transaksi',
  standalone: true,
  templateUrl: './transaksi.component.html',
  styleUrl: './transaksi.component.css',
  providers: [{ provide: LOCALE_ID, useValue: "id-ID" },],
  imports: [CommonModule, RouterOutlet, SidebarComponent, NavbarComponent, DataTablesModule, OrderDetailsComponent]
})
export class TransaksiComponent {

  transactions: any[] = [
    // Add more transactions as needed
  ];

  selectedOrder: any;

  constructor(private http: HttpClient, private dataService: DataService) {
    //get request from web api
    dataService.getAllOrders().subscribe((data: any) => {
      console.log(data);
      this.transactions = data;
      setTimeout(() => {
        $('#datatableexample').DataTable({
          pagingType: 'full_numbers',
          pageLength: 5,
          processing: true,
          lengthMenu: [5, 10, 25],
        });
      }, 1);
    }, error => console.error(error));
  }

  showOrderDetails(order: any) {
    this.selectedOrder = order;
  }
}
