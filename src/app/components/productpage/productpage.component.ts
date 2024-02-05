import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Product } from '../../models/product.model';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../../data-service.service';
import { ShoppingCartService } from '../../shopping-cart.service';
import { AddToCartSuccessComponent } from '../../add-to-cart-success/add-to-cart-success.component';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { ProductComponent } from '../product/product.component';

@Component({
  selector: 'app-productpage',
  standalone: true,
  templateUrl: './productpage.component.html',
  styleUrl: './productpage.component.css',
  imports: [
    CommonModule,
    AddToCartSuccessComponent,
    NgIf,
    ProductComponent,
    NgFor,
  ],
})
export class ProductpageComponent implements OnInit {
  product: Product | undefined;
  showSuccessMessage = false;
  relatedProducts: Product[] = [];
  quantity: number = 1;

  @ViewChild('quantityInput') quantityInput!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private shoppingCartService: ShoppingCartService
  ) {}

  getHigherPrice(): number {
    return (this.product!.price * 12) / 10;
  }

  getRelatedProducts(productId: number) {
    // Fetch related products
    this.dataService
      .getRelatedProducts(productId)
      .subscribe((relatedProducts) => {
        this.relatedProducts = <Product[]>relatedProducts;
      });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const productId = Number(params.get('id'));
      this.dataService.getProductById(productId).subscribe((product) => {
        this.product = <Product>product;

        // console.log(
        //   require('../../../../../fortunapi/public/images/' +
        //     this.product.image_url)
        // );

        this.getRelatedProducts(productId);
      });
    });
  }

  addToCart(): void {
    let qty = this.quantityInput.nativeElement.value;
    this.shoppingCartService.addToCart(this.product!, qty);

    this.shoppingCartService.updateCart();

    this.showSuccessMessage = true;

    console.log('added ' + this.product!.name);

    // Hide the success message after a certain duration (e.g., 3 seconds)
    setTimeout(() => {
      this.showSuccessMessage = false;
    }, 3000);
  }
}
