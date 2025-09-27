import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  // Form data
  loginData = {
    email: '',
    password: ''
  };

  // Form state
  showPassword: boolean = false;
  rememberMe: boolean = false;
  isLoading: boolean = false;
  
  // Messages
  message: string = '';
  messageType: 'error' | 'success' = 'error';

  // Methods
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginData.email && this.loginData.password) {
      this.isLoading = true;
      
      // Simulate API call
      setTimeout(() => {
        this.isLoading = false;
        
        // Mock authentication logic
        if (this.loginData.email === 'admin@gamestore.com' && this.loginData.password === 'admin123') {
          this.message = '¡Bienvenido de vuelta!';
          this.messageType = 'success';
          // Redirect to home or dashboard
          console.log('Login successful');
        } else if (this.loginData.email === 'user@gamestore.com' && this.loginData.password === 'user123') {
          this.message = '¡Sesión iniciada correctamente!';
          this.messageType = 'success';
          console.log('Login successful');
        } else {
          this.message = 'Credenciales incorrectas. Intenta nuevamente.';
          this.messageType = 'error';
        }
        
        // Clear message after 3 seconds
        setTimeout(() => {
          this.message = '';
        }, 3000);
        
      }, 2000);
    } else {
      this.message = 'Por favor, completa todos los campos.';
      this.messageType = 'error';
      
      setTimeout(() => {
        this.message = '';
      }, 3000);
    }
  }
}
