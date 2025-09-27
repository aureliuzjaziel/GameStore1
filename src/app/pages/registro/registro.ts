import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Autenticacion } from '../../services/autenticacion';

@Component({
  selector: 'app-registro',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro {
  servicio = inject(Autenticacion);
  router = inject(Router);

  email = "";
  password = "";
  nombre = "";
  edad = 0;
  ciudad = "";
  
  // Estado del formulario
  isSubmitting = false;
  successMessage = "";
  errorMessage = "";

  registro(datos: any) {
    if (datos.valid) {
      this.isSubmitting = true;
      this.errorMessage = "";
      this.successMessage = "";

      const usuario = {
        nombre: this.nombre,
        email: this.email,
        password: this.password,
        edad: this.edad,
        ciudad: this.ciudad,
        fechaRegistro: new Date().toISOString()
      };

      this.servicio.registerUser(usuario).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.successMessage = "¡Usuario registrado exitosamente!";
          
          // Limpiar el formulario
          this.limpiarFormulario();
          
          // Redirigir al login después de 2 segundos
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.errorMessage = "Error al registrar usuario. Inténtalo nuevamente.";
          console.error('Error en registro:', error);
        }
      });
    } else {
      this.errorMessage = "Por favor, completa todos los campos requeridos correctamente.";
    }
  }

  limpiarFormulario() {
    this.nombre = "";
    this.email = "";
    this.password = "";
    this.edad = 0;
    this.ciudad = "";
  }
}
