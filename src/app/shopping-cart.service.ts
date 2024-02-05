import { Injectable } from '@angular/core';
import { Product } from './models/product.model';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  private storageKey = 'shoppingCart';
  cart: Product[] = [];
  cartUpdated = new Subject<void>();

  constructor() {
    // Load cart data from localStorage on service initialization
    if (this.isLocalStorageAvailable()) {
      this.loadCart();
    }
  }

  addToCart(product: Product, quantity : any): void {
    for (let i = 0; i < quantity; i++) {
      this.cart.push(product);
    }
    // Save updated cart to localStorage
    this.saveCart();
    // Notify subscribers that the cart has been updated
    this.cartUpdated.next();
  }

  updateCart(): void {
    this.cartUpdated.next();
  }

  getCart(): Product[] {
    return this.cart;
  }

  clearCart(): void {
    this.cart = [];
    // Clear cart data from localStorage
    localStorage.removeItem(this.storageKey);
    // Notify subscribers that the cart has been updated
    this.cartUpdated.next();
  }

  private saveCart(): void {
    // Save cart data to localStorage
    localStorage.setItem(this.storageKey, JSON.stringify(this.cart));
    // Notify subscribers that the cart has been updated
    this.cartUpdated.next();
  }

  private loadCart(): void {
    // Load cart data from localStorage
    const storedCart = localStorage.getItem(this.storageKey);
    this.cart = storedCart ? JSON.parse(storedCart) : [];
  }

  private isLocalStorageAvailable(): boolean {
    try {
      // Check if localStorage is available
      const testKey = 'test';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      // If an error occurs, localStorage is not available
      return false;
    }
  }
}
