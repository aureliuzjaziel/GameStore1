import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Productos as ProductosService } from '../../services/productos';
import { LoginA } from '../../services/login-a';

@Component({
  selector: 'app-productos',
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.html',
  styleUrl: './productos.css'
})
export class ProductosComponent implements OnInit {
  // Servicios inyectados
  productosService = inject(ProductosService);
  loginService = inject(LoginA);

  // Search and filter properties
  searchTerm: string = '';
  sortBy: string = 'name';
  selectedCategory: string = 'all';
  
  // User role
  isAdmin: boolean = false;
  
  // Productos y categorías desde la API
  productos: any[] = [];
  productosFiltrados: any[] = [];
  categorias: any[] = [];
  
  // Form properties para crear/editar productos
  showProductForm: boolean = false;
  editingProduct: any = null;
  isSubmitting: boolean = false;
  
  // Formulario de producto (ajustado para Spring Boot)
  nuevoProducto = {
    nombre: '',
    descripcion: '',
    precio: 0,
    imagen: '',
    stock: 0,
    desarrollador: '',
    plataforma: '',
    categoria: { id: null as number | null }
  };
  
  // Mensajes
  successMessage: string = '';
  errorMessage: string = '';

  ngOnInit() {
    this.checkUserRole();
    this.cargarCategorias();
    this.cargarProductos();
  }

  checkUserRole() {
    this.isAdmin = this.loginService.logeado();
  }

  cargarCategorias() {
    this.productosService.getCategorias().subscribe({
      next: (categorias: any) => {
        this.categorias = categorias;
        console.log('Categorías cargadas desde API:', categorias);
        this.clearMessages();
      },
      error: (error: any) => {
        console.error('Error al cargar categorías:', error);
        this.errorMessage = 'Error al conectar con el servidor de categorías';
        this.categorias = [];
      }
    });
  }

  cargarProductos() {
    this.productosService.getProductos().subscribe({
      next: (productos: any) => {
        this.productos = productos;
        this.productosFiltrados = productos;
        console.log('Productos cargados:', productos);
        this.clearMessages();
      },
      error: (error: any) => {
        console.error('Error al cargar productos:', error);
        this.errorMessage = 'Error al cargar productos desde el servidor';
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

      // Preparar el objeto para enviar
      const productoParaEnviar: any = {
        nombre: this.nuevoProducto.nombre,
        descripcion: this.nuevoProducto.descripcion,
        precio: this.nuevoProducto.precio,
        imagen: this.nuevoProducto.imagen,
        stock: this.nuevoProducto.stock,
        desarrollador: this.nuevoProducto.desarrollador,
        plataforma: this.nuevoProducto.plataforma,
        categoria: {
          id: this.nuevoProducto.categoria.id
        }
      };

      if (this.editingProduct) {
        // Actualizar producto existente
        productoParaEnviar.id = this.editingProduct.id;
        
        this.productosService.putProducto(productoParaEnviar).subscribe({
          next: (response: any) => {
            this.isSubmitting = false;
            this.successMessage = 'Producto actualizado exitosamente';
            this.cargarProductos();
            this.ocultarFormularioProducto();
          },
          error: (error: any) => {
            this.isSubmitting = false;
            this.errorMessage = 'Error al actualizar el producto';
            console.error('Error:', error);
          }
        });
      } else {
        // Crear nuevo producto
        this.productosService.postProducto(productoParaEnviar).subscribe({
          next: (response: any) => {
            this.isSubmitting = false;
            this.successMessage = 'Producto creado exitosamente';
            this.cargarProductos();
            this.ocultarFormularioProducto();
          },
          error: (error: any) => {
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
      nombre: producto.nombre || '',
      descripcion: producto.descripcion || '',
      precio: producto.precio || 0,
      imagen: producto.imagen || '',
      stock: producto.stock || 0,
      desarrollador: producto.desarrollador || '',
      plataforma: producto.plataforma || '',
      categoria: { id: producto.categoria?.id || null }
    };
    this.showProductForm = true;
  }

  eliminarProducto(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      this.productosService.deleteProducto(id).subscribe({
        next: (response: any) => {
          this.successMessage = 'Producto eliminado exitosamente';
          this.cargarProductos();
        },
        error: (error: any) => {
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
      imagen: '',
      stock: 0,
      desarrollador: '',
      plataforma: '',
      categoria: { id: null }
    };
  }

  clearMessages() {
    setTimeout(() => {
      this.successMessage = '';
      this.errorMessage = '';
    }, 5000);
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
        (producto.categoria?.nombre || '').toLowerCase() === this.selectedCategory.toLowerCase()
      );
    }

    // Filtrar por término de búsqueda
    if (this.searchTerm) {
      productosFiltrados = productosFiltrados.filter(producto => 
        (producto.nombre || '').toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (producto.descripcion || '').toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    this.productosFiltrados = productosFiltrados;
  }

  onSearchChange() {
    this.filtrarProductos();
  }
}