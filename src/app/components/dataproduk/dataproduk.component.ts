import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../../data-service.service';
import { ProductDetailsComponent } from '../product-details/product-details.component';
import { ProductAddComponent } from '../product-add/product-add.component';

@Component({
  selector: 'app-dataproduk',
  standalone: true,
  templateUrl: './dataproduk.component.html',
  styleUrl: './dataproduk.component.css',
  imports: [
    CommonModule,
    SidebarComponent,
    ProductDetailsComponent,
    ProductAddComponent,
  ],
})
export class DataprodukComponent {
  products: any[] = [];
  selectedProduct: any;
  addProduct: boolean = false;

  constructor(private http: HttpClient, private dataService: DataService) {
    //get request from web api
    dataService.getAllProducts().subscribe(
      (data: any) => {
        // console.log(data);
        // console.log(
        //   require('../../../../../fortunapi/public/images/' + data.image_url)
        // );

        this.products = data;

        setTimeout(() => {
          $('#datatableexample').DataTable({
            pagingType: 'full_numbers',
            pageLength: 25,
            processing: true,
            lengthMenu: [5, 10, 25],
          });
        }, 1);
      },
      (error) => console.error(error)
    );
  }

  showProductDetails(product: any) {
    this.selectedProduct = product;
    window.scrollTo(0, 0);
  }
}
