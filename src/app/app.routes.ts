import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProductComponent } from './components/product/product.component';
import { ShopComponent } from './components/shop/shop.component';
import { AboutComponent } from './components/about/about.component';
import { ShoppingcartComponent } from './components/shoppingcart/shoppingcart.component';
import { ProductpageComponent } from './components/productpage/productpage.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TransaksiComponent } from './components/transaksi/transaksi.component';
import { AuthGuard } from './auth.guard';
import { DataprodukComponent } from './components/dataproduk/dataproduk.component';

export const routes: Routes = [
    { path: '', redirectTo: '/id', pathMatch: 'full' }, // Default route redirects to /id
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },

    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'transaksi', component: TransaksiComponent, canActivate: [AuthGuard] },
    { path: 'dataproduk', component: DataprodukComponent, canActivate: [AuthGuard] },

    { path: 'id', component: HomeComponent },
    { path: 'product/:id', component: ProductpageComponent },
    { path: 'shop', component: ShopComponent },
    { path: 'shoppingcart', component: ShoppingcartComponent },
    { path: 'about', component: AboutComponent },
];
