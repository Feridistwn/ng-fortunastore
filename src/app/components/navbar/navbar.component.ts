import { Component, OnInit, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLinkActive, RouterModule } from '@angular/router';
import { ShoppingCartService } from '../../shopping-cart.service';
import { filter } from 'rxjs';
import { NgIf } from '@angular/common';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../../auth.service';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../shared.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, RouterLinkActive, NgIf],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  appName = "Fortuna Furniture"
  cartCount = 0
  isProductActive: boolean = false;
  isLogin = false;
  authService = inject(AuthService);
  toastr = inject(ToastrService);
  isAdmin = false;

  constructor(private router: Router, private shopCartService: ShoppingCartService, private sharedService: SharedService) { }

  async ngOnInit(): Promise<void> {
    this.updateItemCount();
    // Subscribe to changes in the cart to update the item count
    this.shopCartService.cartUpdated.subscribe(() => this.updateItemCount());

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event) => {
      // Check if the current route is either '/shop' or '/product'
      event = <NavigationEnd>event;
      this.isProductActive = event.url === '/shop' || event.url.startsWith('/product');
    });


    this.isLogin = this.authService.isAuthenticated();
    this.isAdmin = await this.authService.isAuthenticatedAsAdmin();

    this.sharedService.isLogin$.subscribe((value) => {
      this.isLogin = value;
    });
  }

  logout() {
    this.authService.logoutUser().subscribe((res: any) => {
      if (res['status'] === 201) {
        // success logout
        this.sharedService.updateIsLogin(false);
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
        this.toastr.success(JSON.stringify(res['message']), 'Sukses', {
          timeOut: 2000,
          progressBar: true
        });
      } else {
        this.toastr.error(JSON.stringify(res['message']), 'Gagal', {
          timeOut: 2000,
          progressBar: true
        });
      }
    });
  }

  private updateItemCount(): void {
    this.cartCount = this.shopCartService.getCart().length;
  }
}
