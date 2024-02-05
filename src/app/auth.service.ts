import { Injectable, inject } from '@angular/core';
import { environment } from '../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private urlGetUserData = environment.apiUrl + '/profile';
  private urlRegisterUser = environment.apiUrl + '/register';
  private urlLoginUser = environment.apiUrl + '/login';
  private urlLogout = environment.apiUrl + '/logout';

  http = inject(HttpClient);
  role: any;

  ngOnInit() {
    this.getCurrentRole();
  }

  getUserData() {
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.get(this.urlGetUserData, { headers });
  }

  registerUser(data: any) {
    return this.http.post(this.urlRegisterUser, data);
  }

  loginUser(data: any) {
    return this.http.post(this.urlLoginUser, data);
  }

  logoutUser() {
    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.get(this.urlLogout, { headers });
  }


  isAuthenticated(): boolean {
    // Check if a valid JWT token exists in the browser storage or elsewhere
    if (localStorage) {
      const token = localStorage.getItem('token');

      if (token) {
        let decodedToken = jwtDecode(token);
        const isExpired = decodedToken && decodedToken.exp ? decodedToken.exp < Date.now() / 1000 : false;

        if (isExpired) {
          return false; // token expired
        } else {
          return true; // token not expired
        }

      }
    }

    return false;
  }

  async isAuthenticatedAsAdmin(): Promise<boolean> {
    // Check if a valid JWT token exists in the browser storage or elsewhere
    if (localStorage) {
      const token = localStorage.getItem('token');

      if (token) {
        let decodedToken = jwtDecode(token);
        const isExpired = decodedToken && decodedToken.exp ? decodedToken.exp < Date.now() / 1000 : false;

        if (isExpired) {
          return false; // token expired
        } else {
          let isAdmin = false;
          await this.getCurrentRole().then((res) => {
            isAdmin = res === 'admin';
          })
          return isAdmin; // token not expired
        }

      }
    }

    return false;
  }

  async getCurrentRole(): Promise<string> {
    const authenticated = this.isAuthenticated();

    if (authenticated) {
      try {
        const response: any = await this.getUserData().toPromise();

        if (response['status'] === 201) {
          this.role = response['user']['role'];
          return this.role;
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }

    this.role = 'unauthenticated';
    return this.role;
  }

}