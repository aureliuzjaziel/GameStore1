import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { LoginA } from '../../services/login-a';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './nav-bar.html',
  styleUrls: ['./nav-bar.css']
})
export class NavBarComponent {
  isMobileMenuOpen = false;

  constructor(
    private loginService: LoginA,
    private router: Router
  ) {}

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  // Verificar si el usuario está logueado
  logeado(): boolean {
    return this.loginService.logeado();
  }

  // Obtener nombre del usuario logueado
  getUserName(): string {
    return this.loginService.getUserName() || 'Usuario';
  }

  // Cerrar sesión
  logout() {
    this.loginService.logout();
    this.closeMobileMenu();
    this.router.navigate(['/home']);
  }
}
