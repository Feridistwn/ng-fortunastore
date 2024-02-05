import { Component, inject } from '@angular/core';
import { ProductListComponent } from '../product-list/product-list.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Brand } from '../../models/brand.model';
import { DataService } from '../../data-service.service';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  imports: [CommonModule, ProductListComponent, RouterModule, FooterComponent],
})
export class HomeComponent {
  brands: Brand[] = [];
  dataService = inject(DataService);

  okgetbrands = false;

  constructor() {}

  ngOnInit() {
    this.dataService.getBrands().subscribe((result: any) => {
      if (result.status === 201) {
        this.brands = result.brands;
        this.okgetbrands = true;
      }
    });
  }
}
