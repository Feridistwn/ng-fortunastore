import { CommonModule, NgClass, NgIf } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupName, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MustMatch } from '../../validators/confirmed.validator';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { HttpClientModule } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [NgIf, NgClass, FormsModule, ReactiveFormsModule, HttpClientModule, ToastrModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  submitted = false;
  formRegister!: FormGroup;
  data: any;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private toastr: ToastrService) {

  }
  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.formRegister = this.formBuilder.group({
      name: [null, Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
  }

  get f() {
    return this.formRegister.controls;
  }
  submit() {
    this.submitted = true;
    if (this.formRegister.invalid) {
      return;
    }

    this.authService.registerUser(this.formRegister.value).subscribe(response => {
      this.data = response;
      //console.log(this.data);
      if (this.data['status'] === 200) {
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
    });
  }

}
