import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { LoginA } from '../../services/login-a';
import { FormsModule } from '@angular/forms';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './nav-bar.html',
  styleUrls: ['./nav-bar.css']
})
export class NavBarComponent {
  isMobileMenuOpen = false;
  isCarritoOpen = false;

  constructor(
    private loginService: LoginA,
    private router: Router,
    private carritoService: CarritoService
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

  // Obtener cantidad total del carrito
  getCantidadCarrito(): number {
    return this.carritoService.obtenerCantidadTotal();
  }

  // Toggle carrito dropdown
  toggleCarrito() {
    this.isCarritoOpen = !this.isCarritoOpen;
  }

  // Cerrar carrito dropdown
  cerrarCarrito() {
    this.isCarritoOpen = false;
  }

  // Obtener productos del carrito
  getProductosCarrito() {
    return this.carritoService.obtenerCarrito();
  }

  // Obtener total del carrito
  getTotalCarrito(): number {
    return this.carritoService.obtenerTotal();
  }

  // Procesar compra (simple para presentación)
  procesarCompra() {
    if (this.getProductosCarrito().length > 0) {
      alert(`¡Compra procesada exitosamente!\nTotal: $${this.getTotalCarrito().toFixed(2)}\n¡Gracias por tu compra! 🎮`);
      this.carritoService.vaciarCarrito();
      this.cerrarCarrito();
    }
  }
}
