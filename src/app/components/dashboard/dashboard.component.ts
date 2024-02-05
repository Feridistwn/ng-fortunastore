import { Component, Inject, OnInit } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { jwtDecode } from 'jwt-decode';
import { DOCUMENT } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FooterComponent } from '../footer/footer.component';
import { DataService } from '../../data-service.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  imports: [
    NavbarComponent,
    RouterLink,
    RouterLinkActive,
    SidebarComponent,
    FooterComponent,
  ],
})
export class DashboardComponent implements OnInit {
  userName = '';
  token!: string | null;
  userData: any;
  isLogin: boolean = false;
  localStorage: Storage | undefined;
  statsJumlahOrder = 0;
  statsJumlahProduk = 0;
  statsTransaksiLunas = 0;
  statsJumlahUser = 0;
  statsFailedTransaction = 0;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private dataService: DataService,
    private router: Router
  ) {
    this.localStorage = document.defaultView?.localStorage;
  }

  ngOnInit(): void {
    if (this.localStorage) {
      this.token = this.localStorage.getItem('token');
      if (this.token) {
        this.userData = jwtDecode(this.token!);
        // console.log(this.userData);
        if (this.userData.user_id) {
          this.isLogin = true;
          this.userName = this.userData.email;
        } else {
          this.isLogin = false;
        }
      }
    }

    this.dataService.getDashboardData().subscribe((result: any) => {
      if (result.status === 201) {
        this.statsJumlahProduk = result['totalProducts'];
        this.statsJumlahOrder = result['totalOrders'];
        this.statsJumlahUser = result['totalUsers'];
        this.statsTransaksiLunas = result['percentagePaidOrders'];
        this.statsFailedTransaction = result['cancelledOrders'];
      } else {
      }
    });
  }

  moreInfoOrders(event: Event) {
    event.preventDefault();
    this.router.navigate(['/transaksi']);
  }

  moreInfoProducts(event: Event) {
    event.preventDefault();
    this.router.navigate(['/dataproduk']);
  }
}
