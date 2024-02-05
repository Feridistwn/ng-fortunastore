import { Component, inject } from '@angular/core';
import { RouterLinkActive, RouterModule, RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./components/navbar/navbar.component";
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [CommonModule, HttpClientModule, RouterOutlet, RouterModule, NavbarComponent, HeaderComponent, FooterComponent, RouterLinkActive]
})
export class AppComponent {
  title = 'fortunastore';
  module = 'user';
  authService = inject(AuthService);

  constructor() { }

  ngOnInit() {
    this.authService.getCurrentRole().then((res) => {
      this.module = res;
    });
    // console.log(this.module);
  }
}
