import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { AuthResponse, User } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = '/api/auth';
  currentUser = signal<User | null>(this.getUserFromStorage());

  constructor(private http: HttpClient, private router: Router) {}

  register(data: { name: string; email: string; university: string; password: string }) {
    return this.http.post<AuthResponse>(`${this.API}/register`, data).pipe(
      tap((res) => this.handleAuth(res))
    );
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponse>(`${this.API}/login`, { email, password }).pipe(
      tap((res) => this.handleAuth(res))
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private handleAuth(res: AuthResponse) {
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
    this.currentUser.set(res.user);
  }

  private getUserFromStorage(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}
