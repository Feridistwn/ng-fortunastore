import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../data-service.service';
import { ProductServiceService } from '../../service/product-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-add',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './product-add.component.html',
  styleUrl: './product-add.component.css',
})
export class ProductAddComponent {
  productForm!: FormGroup;
  submitted: boolean = false;
  categories: any[] = []; // Ganti ini dengan daftar kategori yang sesuai
  imageUrlPreview: string | null = null;
  fileToUpload: File | null = null;

  constructor(
    private toastr: ToastrService,
    private fb: FormBuilder,
    private productService: ProductServiceService,
    private dataService: DataService,
    private router: Router
  ) {}

  ngOnInit() {
    this.createForm();
    this.loadCategories();
  }

  private loadCategories() {
    this.dataService.getCategories().subscribe((data: any) => {
      this.categories = data;
    });
  }

  createForm() {
    this.productForm = this.fb.group({
      name: ['', [Validators.required]],
      category_id: ['', Validators.required],
      price: [''],
      description: [''],
      image_url: [''],
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
    console.log(this.productForm);
    if (this.productForm.valid) {
      if (this.fileToUpload) {
        this.productService.uploadImage(this.fileToUpload).subscribe(
          (response: any) => {
            this.productForm.patchValue({ image_url: response.imageUrl });
            this.addProduct();
          },
          (error) => {
            console.error('Error uploading image:', error);
          }
        );
      } else {
        // Jika tidak ada file untuk diunggah, lanjutkan dengan pembaruan produk langsung
        this.addProduct();
      }
      // Add logic to send form data to the server or perform other actions
    } else {
      // Handle validation errors or display a message to the user
      console.log('Form not valid. Please check the fields.');
    }
  }

  private addProduct() {
    const formValue = this.productForm.value;
    // console.log('Form Submitted:', formValue);
    this.productService.addProduct(formValue).subscribe((response: any) => {
      if (response.status === 201) {
        this.toastr.success('Data berhasil ditambahkan. ', 'Sukses');
        this.router
          .navigateByUrl('/', { skipLocationChange: true })
          .then(() => this.router.navigate(['/dataproduk']));
      } else {
        this.toastr.error('Data gagal ditambahkan. ', 'Gagal');
      }
    });
  }
}
