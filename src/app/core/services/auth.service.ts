import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private tokenKey = 'auth-token';
  private userIdKey = 'user-id'; // Cambiar de clienteIdKey a userIdKey
  private rolKey = 'rol'; // Mantener rolKey
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.isLoggedIn());
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        console.log('Respuesta del login:', response);
        if (response.jwt) {
          localStorage.setItem(this.tokenKey, response.jwt);
          const userId = response.userId; // Cambiar clienteId a userId
          if (userId) {
            localStorage.setItem(this.userIdKey, userId);
          } else {
            console.error('No se encontró userId en la respuesta del login');
          }
          if (response.rol) {
            localStorage.setItem(this.rolKey, response.rol);
          }
          console.log('Datos almacenados en localStorage:', {
            token: localStorage.getItem(this.tokenKey),
            userId: localStorage.getItem(this.userIdKey),
            rol: localStorage.getItem(this.rolKey)
          });
          this.isLoggedInSubject.next(true);
        }
      })
    );
  }

  register(userData: { dni: string, nombre: string, apellido: string, email: string, password: string, telefono: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userIdKey);
    localStorage.removeItem(this.rolKey);
    this.isLoggedInSubject.next(false);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    const token = localStorage.getItem(this.tokenKey);
    console.log('Recuperando token desde localStorage:', token);
    return token;
  }

  getUserId(): string | null {
    const userId = localStorage.getItem(this.userIdKey);
    console.log('Recuperando userId desde localStorage:', userId);
    return userId;
  }

  getRol(): string | null {
    return localStorage.getItem(this.rolKey);
  }

  isGerenteGeneral(): boolean {
    const rol = this.getRol();
    return rol === 'GERENTE_GENERAL';
  }

  isRecepcionista(): boolean {
    const rol = this.getRol();
    return rol === 'RECEPCIONISTA';
  }
}