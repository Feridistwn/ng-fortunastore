import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private isLoginSubject = new BehaviorSubject<boolean>(true);

  isLogin$: Observable<boolean> = this.isLoginSubject.asObservable();

  updateIsLogin(value: boolean) {
    this.isLoginSubject.next(value);
  }
}
