import { Injectable } from '@angular/core';

export interface ProductoCarrito {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  cantidad: number;
  stock: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private storageKey = 'gamestore-carrito';
  private carrito: ProductoCarrito[] = [];

  constructor() {
    this.cargarCarrito();
  }

  // Cargar carrito desde localStorage
  private cargarCarrito() {
    const carritoGuardado = localStorage.getItem(this.storageKey);
    if (carritoGuardado) {
      this.carrito = JSON.parse(carritoGuardado);
    }
  }

  // Guardar carrito en localStorage
  private guardarCarrito() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.carrito));
  }

  // Agregar producto al carrito
  agregarProducto(producto: any) {
    const productoExistente = this.carrito.find(item => item.id === producto.id);
    
    if (productoExistente) {
      // Si ya existe, aumentar cantidad
      if (productoExistente.cantidad < producto.stock) {
        productoExistente.cantidad++;
        this.guardarCarrito();
        return true;
      } else {
        return false; // No hay stock suficiente
      }
    } else {
      // Si no existe, agregarlo
      const nuevoItem: ProductoCarrito = {
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen: producto.imagen,
        cantidad: 1,
        stock: producto.stock
      };
      this.carrito.push(nuevoItem);
      this.guardarCarrito();
      return true;
    }
  }

  // Obtener todos los productos del carrito
  obtenerCarrito(): ProductoCarrito[] {
    return this.carrito;
  }

  // Obtener cantidad total de productos
  obtenerCantidadTotal(): number {
    return this.carrito.reduce((total, item) => total + item.cantidad, 0);
  }

  // Obtener total del carrito
  obtenerTotal(): number {
    return this.carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  }

  // Actualizar cantidad de un producto
  actualizarCantidad(id: number, cantidad: number) {
    const producto = this.carrito.find(item => item.id === id);
    if (producto) {
      if (cantidad <= 0) {
        this.eliminarProducto(id);
      } else if (cantidad <= producto.stock) {
        producto.cantidad = cantidad;
        this.guardarCarrito();
        return true;
      }
    }
    return false;
  }

  // Eliminar producto del carrito
  eliminarProducto(id: number) {
    this.carrito = this.carrito.filter(item => item.id !== id);
    this.guardarCarrito();
  }

  // Vaciar carrito
  vaciarCarrito() {
    this.carrito = [];
    this.guardarCarrito();
  }

  // Verificar si un producto está en el carrito
  estaEnCarrito(id: number): boolean {
    return this.carrito.some(item => item.id === id);
  }
}