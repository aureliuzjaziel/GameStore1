import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Autenticacion } from '../../services/autenticacion';
import { LoginA } from '../../services/login-a';

@Component({
  selector: 'app-productos',
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.html',
  styleUrl: './productos.css'
})
export class Productos implements OnInit {
  // Servicios inyectados
  servicio = inject(Autenticacion);
  loginService = inject(LoginA);

  // Search and filter properties
  searchTerm: string = '';
  sortBy: string = 'name';
  selectedCategory: string = 'all';
  
  // User role
  isAdmin: boolean = false;
  
  // Productos desde la API
  productos: any[] = [];
  productosFiltrados: any[] = [];
  
  // Form properties para crear/editar productos
  showProductForm: boolean = false;
  editingProduct: any = null;
  isSubmitting: boolean = false;
  
  // Formulario de producto
  nuevoProducto = {
    nombre: '',
    descripcion: '',
    precio: 0,
    categoria: '',
    imagen: '',
    stock: 0,
    activo: true
  };
  
  // Mensajes
  successMessage: string = '';
  errorMessage: string = '';

  ngOnInit() {
    this.checkUserRole();
    this.cargarProductos();
  }

  checkUserRole() {
    // Aquí puedes implementar la lógica para verificar si el usuario es admin
    this.isAdmin = this.loginService.logeado(); // Por ahora, cualquier usuario logueado es admin
  }

  cargarProductos() {
    this.servicio.getProducto().subscribe({
      next: (productos) => {
        this.productos = productos;
        this.productosFiltrados = productos;
        console.log('Productos cargados:', productos);
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        this.errorMessage = 'Error al cargar productos desde el servidor';
        // Fallback con datos de ejemplo
        this.productos = [];
        this.productosFiltrados = [];
      }
    });
  }

  // Métodos para gestión de productos
  mostrarFormularioProducto() {
    this.showProductForm = true;
    this.editingProduct = null;
    this.limpiarFormulario();
  }

  ocultarFormularioProducto() {
    this.showProductForm = false;
    this.editingProduct = null;
    this.limpiarFormulario();
  }

  guardarProducto(form: NgForm) {
    if (form.valid) {
      this.isSubmitting = true;
      this.errorMessage = '';
      this.successMessage = '';

      if (this.editingProduct) {
        // Actualizar producto existente
        const productoActualizado = {
          ...this.nuevoProducto,
          id: this.editingProduct.id
        };
        
        this.servicio.putProductos(productoActualizado).subscribe({
          next: (response) => {
            this.isSubmitting = false;
            this.successMessage = 'Producto actualizado exitosamente';
            this.cargarProductos();
            this.ocultarFormularioProducto();
          },
          error: (error) => {
            this.isSubmitting = false;
            this.errorMessage = 'Error al actualizar el producto';
            console.error('Error:', error);
          }
        });
      } else {
        // Crear nuevo producto
        this.servicio.postProducto(this.nuevoProducto).subscribe({
          next: (response) => {
            this.isSubmitting = false;
            this.successMessage = 'Producto creado exitosamente';
            this.cargarProductos();
            this.ocultarFormularioProducto();
          },
          error: (error) => {
            this.isSubmitting = false;
            this.errorMessage = 'Error al crear el producto';
            console.error('Error:', error);
          }
        });
      }
    }
  }

  editarProducto(producto: any) {
    this.editingProduct = producto;
    this.nuevoProducto = {
      nombre: producto.nombre || producto.title || '',
      descripcion: producto.descripcion || producto.description || '',
      precio: producto.precio || producto.price || 0,
      categoria: producto.categoria || producto.category || '',
      imagen: producto.imagen || producto.image || '',
      stock: producto.stock || 0,
      activo: producto.activo !== undefined ? producto.activo : true
    };
    this.showProductForm = true;
  }

  eliminarProducto(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      this.servicio.deleteProductos(id).subscribe({
        next: (response) => {
          this.successMessage = 'Producto eliminado exitosamente';
          this.cargarProductos();
        },
        error: (error) => {
          this.errorMessage = 'Error al eliminar el producto';
          console.error('Error:', error);
        }
      });
    }
  }

  limpiarFormulario() {
    this.nuevoProducto = {
      nombre: '',
      descripcion: '',
      precio: 0,
      categoria: '',
      imagen: '',
      stock: 0,
      activo: true
    };
  }
  
  // Methods for filtering and searching
  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.filtrarProductos();
  }

  filtrarProductos() {
    let productosFiltrados = this.productos;

    // Filtrar por categoría
    if (this.selectedCategory !== 'all') {
      productosFiltrados = productosFiltrados.filter(producto => 
        (producto.categoria || producto.category || '').toLowerCase() === this.selectedCategory.toLowerCase()
      );
    }

    // Filtrar por término de búsqueda
    if (this.searchTerm) {
      productosFiltrados = productosFiltrados.filter(producto => 
        (producto.nombre || producto.title || '').toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (producto.descripcion || producto.description || '').toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    this.productosFiltrados = productosFiltrados;
  }

  onSearchChange() {
    this.filtrarProductos();
  }
}
