import { CommonModule, NgClass, NgIf } from '@angular/common';
import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, NgClass, FormsModule, ReactiveFormsModule, HttpClientModule, ToastrModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  submitted = false;
  formLogin!: FormGroup;
  data: any;
  token: any;
  toastr = inject(ToastrService);

  constructor(private router: Router, private formBuilder: FormBuilder, private authService: AuthService) {

  }
  ngOnInit(): void {
    this.loginForm();
  }

  loginForm() {
    this.formLogin = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  get f() {
    return this.formLogin.controls;
  }

  submit() {
    this.submitted = true;
    if (this.formLogin.invalid) {
      return;
    }

    this.authService.loginUser(this.formLogin.value).subscribe(async response => {
      this.data = response;
      //console.log(this.data);
      if (this.data['status'] === 200) {

        this.token = this.data['token'];
        localStorage.setItem('token', this.token);
        if (await this.authService.isAuthenticatedAsAdmin) this.router.navigate(['/dashboard']);
        else this.router.navigate(['/shoppingcart']);


        this.toastr.success(JSON.stringify(this.data.message), 'Sukses', {
          timeOut: 2000,
          progressBar: true
        });
      } else {
        this.toastr.error(JSON.stringify(this.data.message), 'Gagal', {
          timeOut: 2000,
          progressBar: true
        });
      }
      location.reload();
    });
  }

}
