import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DataService } from '../../data-service.service';
import { ProductServiceService } from '../../service/product-service.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent {
  @Input() product: any;

  prod: any = {}; // Objek untuk menyimpan detail produk
  categories: any[] = []; // Ganti ini dengan daftar kategori yang sesuai
  productForm!: FormGroup;
  submitted: boolean = false;
  imageUrlPreview: string | null = null;
  fileToUpload: File | null = null;

  constructor(
    private toastr: ToastrService,
    private fb: FormBuilder,
    private dataService: DataService,
    private productService: ProductServiceService,
    private router: Router
  ) {}

  ngOnInit() {
    this.createForm();
    this.loadCategories();
    this.loadImage();
  }

  private async loadImage() {
    if (this.product.image_url) {
      let imgUrl: any = await this.productService
        .getImageUrl(this.product.image_url)
        .subscribe((response: any) => {
          if (response.status === 200) {
            return response.imageUrl;
          }
        });
      this.imageUrlPreview = imgUrl;
    }
  }

  createForm() {
    this.productForm = this.fb.group({
      product_id: [this.product.product_id, Validators.required],
      name: [this.product.name, [Validators.required]],
      category_id: [this.product.category.category_id, Validators.required],
      price: [this.product.price],
      description: [this.product.description],
      image_url: [this.product.image_url],
    });
  }

  onImageChange(event: any) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.productForm.patchValue({ image_url: file.name });
      this.productForm.get('image_url')?.updateValueAndValidity();

      // Menampilkan preview gambar
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrlPreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.productForm.valid) {
      if (this.fileToUpload) {
        this.productService.uploadImage(this.fileToUpload).subscribe(
          (response: any) => {
            this.productForm.patchValue({ image_url: response.imageUrl });
            this.updateProduct();
          },
          (error) => {
            console.error('Error uploading image:', error);
          }
        );
      } else {
        // Jika tidak ada file untuk diunggah, lanjutkan dengan pembaruan produk langsung
        this.updateProduct();
      }
      // Add logic to send form data to the server or perform other actions
    } else {
      // Handle validation errors or display a message to the user
      console.log('Form not valid. Please check the fields.');
    }
  }

  private updateProduct() {
    const formValue = this.productForm.value;
    // console.log('Form Submitted:', formValue);
    this.productService.updateProduct(formValue).subscribe((response: any) => {
      if (response.status === 200) {
        this.toastr.success('Data berhasil diupdate. ', 'Sukses');
        this.router
          .navigateByUrl('/', { skipLocationChange: true })
          .then(() => this.router.navigate(['/dataproduk']));
      } else {
        this.toastr.error('Data gagal diupdate. ', 'Gagal');
      }
    });
  }

  hapusProduk() {
    this.productService
      .deleteProduct(this.product.product_id)
      .subscribe((response: any) => {
        if (response.status === 200) {
          this.toastr.success('Data berhasil dihapus. ', 'Sukses');
          this.router
            .navigateByUrl('/', { skipLocationChange: true })
            .then(() => this.router.navigate(['/dataproduk']));
        } else {
          this.toastr.error('Data gagal dihapus. ', 'Gagal');
        }
      });
  }

  private loadCategories() {
    this.dataService.getCategories().subscribe((data: any) => {
      this.categories = data;
    });
  }
}
