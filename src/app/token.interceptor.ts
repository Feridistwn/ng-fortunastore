import { HttpClient, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../environments/environment.development';
import { Router } from '@angular/router';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  let router = inject(Router);

  if (localStorage) {
    const token = localStorage.getItem('token');

    if (token) {
      let decodedToken = jwtDecode(token);
      const isExpired = decodedToken && decodedToken.exp ? decodedToken.exp < Date.now() / 1000 : false;

      if (isExpired) {
        // httpClient.post(environment.apiUrl + '/refresh', {}).subscribe((newToken: any) => {
        localStorage.removeItem('token');
        router.navigateByUrl('/login');
        //   req.clone({
        //     setHeaders: {
        //       Authorization: 'Bearer ${newToken}'
        //     }
        //   });
        // });
      } else {
        // console.log('token not expired');
      }
    } else {
      router.navigateByUrl('/login');
    }
  }

  return next(req);
};
