import { DOCUMENT, NgIf } from '@angular/common';
import { AfterViewInit, Component, Inject, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../../auth.service';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../shared.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgIf],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})

export class SidebarComponent implements AfterViewInit {

  userEmail = "";
  token!: string | null;
  isLogin: boolean = false;
  authService = inject(AuthService);
  doneUserEmail = false;

  toastr = inject(ToastrService);

  constructor(private router: Router, private sharedService: SharedService) {
  }

  ngOnInit(): void {
    this.isLogin = this.authService.isAuthenticated();
    this.sharedService.isLogin$.subscribe((value) => {
      this.isLogin = value;
    });

  }

  ngAfterViewInit(): void {
    this.authService.getUserData().subscribe((res: any) => {
      if (res['status'] === 201 && !this.doneUserEmail) {
        this.userEmail = res['user']['email'];
        this.doneUserEmail = true;
      }
    });
  }

  logout(event: Event) {
    event.preventDefault();
    this.authService.logoutUser().subscribe((res: any) => {
      if (res['status'] === 201) {
        // success logout
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
        this.sharedService.updateIsLogin(false);
        this.toastr.success(JSON.stringify(res['message']), 'Sukses', {
          timeOut: 2000,
          progressBar: true
        });
      } else {
        this.toastr.error(JSON.stringify(res['message']), 'Gagal', {
          timeOut: 2000,
          progressBar: true
        });
      }
    });
  }
}
