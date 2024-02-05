import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ProductServiceService {
  private urlAddProduct = environment.apiUrl + '/product/store';
  private urlUpdateProduct = environment.apiUrl + '/product/:id/update';
  private urlDeleteProduct = environment.apiUrl + '/product/:id/delete';
  private urlUploadImage = environment.apiUrl + '/upload-image';
  private urlGetImage = environment.apiUrl + '/get-image';

  http = inject(HttpClient);

  constructor() {}

  addProduct(data: any) {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });

    return this.http.post(this.urlAddProduct, data, { headers });
  }

  updateProduct(data: any) {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });

    return this.http.patch(
      this.urlUpdateProduct.replace(':id', data.product_id),
      data,
      { headers }
    );
  }

  deleteProduct(product_id: any) {
    const headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });

    return this.http.delete(this.urlDeleteProduct.replace(':id', product_id), {
      headers,
    });
  }

  uploadImage(file: File) {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post(this.urlUploadImage, formData);
  }

  getImageUrl(imageName: string) {
    return this.http.get(`${this.urlGetImage}/${imageName}`);
  }
}
