import { Component } from '@angular/core';
import { DataService } from '../../data-service.service';
import { ProductComponent } from "../product/product.component";
import { NgFor } from '@angular/common';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
  imports: [ProductComponent, NgFor]
})
export class ProductListComponent {
  products: any = [];

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.dataService.getProducts()
      .subscribe(
        (data) => {
          //console.log(data)
          this.products = data;
        },
        (error) => {
          console.error('Error fetching products:', error);
        }
      );
  }
}
