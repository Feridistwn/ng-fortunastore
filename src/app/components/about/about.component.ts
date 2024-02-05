import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-about',
  standalone: true,
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
  imports: [NavbarComponent, HeaderComponent, FooterComponent],
})
export class AboutComponent {
  title = 'Belanja di Fortuna Furniture';
  desc = 'Penuhi kebutuhan rumahmu';
}
