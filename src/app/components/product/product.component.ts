import { Component, Input, LOCALE_ID } from '@angular/core';
import { Product } from '../../models/product.model';
import { ShoppingCartService } from '../../shopping-cart.service';
import { AddToCartSuccessComponent } from '../../add-to-cart-success/add-to-cart-success.component';
import { CommonModule, NgIf, registerLocaleData } from '@angular/common';
import { RouterLink } from '@angular/router';

import localeId from '@angular/common/locales/id';
import { ProductServiceService } from '../../service/product-service.service';
import { DomSanitizer } from '@angular/platform-browser';

registerLocaleData(localeId, 'id');

@Component({
  selector: 'app-product',
  standalone: true,
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
  imports: [CommonModule, AddToCartSuccessComponent, NgIf, RouterLink],
  providers: [{ provide: LOCALE_ID, useValue: 'id-ID' }],
})
export class ProductComponent {
  @Input() product: Product | undefined;
  showSuccessMessage = false;

  // imageUrl: string = '';

  constructor(
    private shoppingCartService: ShoppingCartService,
    private productService: ProductServiceService // private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    // console.log(
    //   require('../../../../../fortunapi/public/images/' +
    //     this.product!.image_url)
    // );
    // this.product!.image_url = this.sanitizer
    //   .bypassSecurityTrustUrl(
    //     'https://localhost:8000/public/images/' + this.product?.image_url
    //   )
    //   .toString();
    // this.imageUrl = 'http://localhost:8000/images/' + this.product!.image_url;
    // this.productService.getImageUrl(this.product!.image_url).subscribe(
    //   (response: any) => {
    //     this.imageUrl = response.imageUrl;
    //   },
    //   (error) => {
    //     console.error('Error getting base image URL:', error);
    //   }
    // );
  }

  addToCart(): void {
    this.shoppingCartService.addToCart(this.product!, 1);

    this.shoppingCartService.updateCart();

    this.showSuccessMessage = true;

    // console.log('added ' + this.product!.name);

    // Hide the success message after a certain duration (e.g., 3 seconds)
    setTimeout(() => {
      this.showSuccessMessage = false;
    }, 3000);
  }

  async getImageUrl(url: any) {
    let imgurl = await this.productService
      .getImageUrl(url)
      .subscribe((response: any) => {
        if (response.status === 200) {
          return response.imageUrl;
        }
        return '';
      });

    return imgurl;
  }
}
