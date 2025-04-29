import { Component } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [FormsModule]
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Login exitoso:', response);
        if (this.authService.isGerenteGeneral()) {
          this.router.navigate(['/dashboard/admin']); // Redirigir a dashboard de administrador
        } else if (this.authService.isRecepcionista()) {
          this.router.navigate(['/dashboard/recepcionista']); // Redirigir a dashboard de recepcionista
        } else {
          this.router.navigate(['/']); // Redirigir a la página principal para clientes comunes
        }
      },
      error: (error) => {
        console.error('Error en el login:', error);
        alert('Error al iniciar sesión. Por favor, verifica tus credenciales.');
      }
    });
  }
}