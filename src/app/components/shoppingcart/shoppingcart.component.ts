import { Component, ElementRef, NgModule, Renderer2, ViewChild, inject } from '@angular/core';
import { ShoppingCartService } from '../../shopping-cart.service';
import { Product } from '../../models/product.model';
import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { User } from '../../models/user.model';
import { NavbarComponent } from "../navbar/navbar.component";
import { AuthService } from '../../auth.service';
import { HeaderComponent } from "../header/header.component";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaymentService } from '../../payment.service';
import { PaymentComponent } from "../payment/payment.component";
import bootstrap from '../../../main.server';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-shoppingcart',
  standalone: true,
  templateUrl: './shoppingcart.component.html',
  styleUrl: './shoppingcart.component.css',
  imports: [CommonModule, NgIf, NgFor, NavbarComponent, HeaderComponent, FormsModule, ReactiveFormsModule, NgClass, PaymentComponent]
})
export class ShoppingcartComponent {

  @ViewChild('paymentModal') paymentModal!: ElementRef;

  submitted = false;
  formCheckout!: FormGroup;

  title = "Fortuna Furniture"
  desc = "Checkout"

  cartItems: Product[] = [];
  calculatedItems: any[] = [];

  currentUser: User | undefined;
  acceptPay = false;
  ckey = '';
  skey = '';

  toastr = inject(ToastrService);
  totalPrice: number = 0;


  constructor(private renderer: Renderer2, private cartService: ShoppingCartService, private formBuilder: FormBuilder, private authService: AuthService, private payService: PaymentService) {

    this.cartItems = cartService.getCart();

    authService.getUserData().subscribe((user: any) => {
      this.currentUser = <User>user['user'];
      //console.log(this.currentUser);
    });

    this.cartService.cartUpdated.subscribe(() => {
      // Call your recalculateQuantities() method or perform any other updates here

      this.cartItems = cartService.getCart();
      this.calculateQuantities();
    });

    this.cartService.updateCart();
  }

  ngOnInit(): void {
    this.createForm();
  }

  openPaymentModal() {
    this.acceptPay = true;

  }

  closePaymentModal() {
    this.acceptPay = false;
  }

  createForm() {
    this.formCheckout = this.formBuilder.group({
      firstName: [null, Validators.required],
      lastName: [''],
      email: ['', [Validators.required, Validators.email]],
      address1: ['', Validators.required],
      address2: [''],
    });
  }

  submit() {
    this.submitted = true;
    if (this.formCheckout.invalid) {
      return;
    }

    this.payService.tryCheckout(this.formCheckout.value, this.cartItems).subscribe((result: any) => {

      if (result.status === 201) {
        this.toastr.success(JSON.stringify(result.message), 'Sukses', {
          timeOut: 2000,
          progressBar: true
        });
        // console.log("result of init payment");
        // console.log(result);
        let clientKey = result['clientKey'];
        let snapToken = result['token'];

        if (clientKey && snapToken) {
          // console.log('client key and snap token is available');
          this.ckey = clientKey;
          this.skey = snapToken;
          this.acceptPay = true;

          this.openPaymentModal();
        }
      } else {
        this.toastr.error(JSON.stringify(result.message), 'Gagal', {
          timeOut: 2000,
          progressBar: true
        });
      }
    });
  }

  get f() {
    return this.formCheckout.controls;
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.cartService.updateCart();
  }

  removeItem(index: number): void {
    // Remove item from the cart based on its index
    console.log(this.calculatedItems);
    this.calculatedItems.splice(index, 1);
    this.cartService.cart = [];

    this.calculatedItems.map(item => {
      this.cartService.addToCart(item.product, parseInt(item.quantity))
      console.log(item)
    })

    this.cartService.updateCart();
  }

  private calculateQuantities(): void {
    const quantityMap = new Map<number, number>();
    let totalAmount = 0;

    // Iterate through cart items to calculate quantities
    this.cartItems.forEach(item => {
      const id = item.product_id;

      if (quantityMap.has(id)) {
        quantityMap.set(id, quantityMap.get(id)! + 1);
      } else {
        quantityMap.set(id, 1);
      }
      totalAmount += parseFloat(item.price.toString());
    });

    // Convert the Map back to an array of grouped items if needed
    this.calculatedItems = Array.from(quantityMap.entries()).map(([id, quantity]) => ({
      product: this.cartItems.find(item => item.product_id === id),
      quantity: quantity,
    })
    );

    this.totalPrice = totalAmount;
    console.log('cartItems');
    console.log(this.cartItems);
    console.log('calculatedItems');
    console.log(this.calculatedItems);
  }
}
