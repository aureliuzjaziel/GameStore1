import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-registro',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro {
  // Form data
  registerData = {
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  // Form state
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  acceptTerms: boolean = false;
  acceptNewsletter: boolean = false;
  isLoading: boolean = false;
  
  // Messages
  message: string = '';
  messageType: 'error' | 'success' = 'error';

  // Methods
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  passwordsMatch(): boolean {
    return this.registerData.password === this.registerData.confirmPassword && 
           this.registerData.password !== '';
  }

  getPasswordStrength(): string {
    const password = this.registerData.password;
    if (password.length === 0) return 'none';
    if (password.length < 6) return 'weak';
    if (password.length < 8) return 'medium';
    if (password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)) {
      return 'strong';
    }
    return 'medium';
  }

  getPasswordStrengthPercent(): number {
    const strength = this.getPasswordStrength();
    switch (strength) {
      case 'weak': return 25;
      case 'medium': return 60;
      case 'strong': return 100;
      default: return 0;
    }
  }

  getPasswordStrengthText(): string {
    const strength = this.getPasswordStrength();
    switch (strength) {
      case 'weak': return 'Débil';
      case 'medium': return 'Media';
      case 'strong': return 'Fuerte';
      default: return '';
    }
  }

  isFormValid(): boolean {
    return this.registerData.username.length >= 3 &&
           this.registerData.email.includes('@') &&
           this.registerData.password.length >= 6 &&
           this.passwordsMatch() &&
           this.acceptTerms;
  }

  onSubmit(): void {
    if (this.isFormValid()) {
      this.isLoading = true;
      
      // Simulate API call
      setTimeout(() => {
        this.isLoading = false;
        
        // Mock registration logic
        if (this.registerData.email === 'test@test.com') {
          this.message = 'Este email ya está registrado. Intenta con otro.';
          this.messageType = 'error';
        } else {
          this.message = '¡Cuenta creada exitosamente! Bienvenido a GameStore.';
          this.messageType = 'success';
          
          // Reset form after success
          setTimeout(() => {
            this.registerData = {
              username: '',
              email: '',
              password: '',
              confirmPassword: ''
            };
            this.acceptTerms = false;
            this.acceptNewsletter = false;
          }, 2000);
        }
        
        // Clear message after 4 seconds
        setTimeout(() => {
          this.message = '';
        }, 4000);
        
      }, 2500);
    } else {
      this.message = 'Por favor, completa todos los campos correctamente y acepta los términos.';
      this.messageType = 'error';
      
      setTimeout(() => {
        this.message = '';
      }, 3000);
    }
  }
}
