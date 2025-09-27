import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Autenticacion } from '../../services/autenticacion';
import { LoginA } from '../../services/login-a';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  servicio = inject(Autenticacion);
  servicio2 = inject(LoginA);
  router = inject(Router);

  email = "";
  password = "";
  
  // Estados del formulario
  isSubmitting = false;
  successMessage = "";
  errorMessage = "";
  showPassword = false;

  login(datos: NgForm) {
    if (datos.valid) {
      this.isSubmitting = true;
      this.errorMessage = "";
      this.successMessage = "";

      const credenciales = {
        email: this.email,
        password: this.password
      };

      this.servicio.loginUser(credenciales).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          if (response.success) {
            this.servicio2.login();
            this.successMessage = `¡Bienvenido ${response.user.nombre}!`;
            
            // Redirigir después de 1 segundo
            setTimeout(() => {
              this.router.navigate(['/productos']);
            }, 1000);
          } else {
            this.errorMessage = response.message || "Credenciales incorrectas. Inténtalo nuevamente.";
          }
        },
        error: (error) => {
          this.isSubmitting = false;
          this.errorMessage = error.message || "Error al conectar con el servidor.";
        }
      });
    } else {
      this.errorMessage = "Por favor, completa todos los campos correctamente.";
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  limpiarFormulario() {
    this.email = "";
    this.password = "";
  }
}
