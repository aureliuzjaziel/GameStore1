import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Productos as ProductosService } from '../../services/productos';
import { LoginA } from '../../services/login-a';
import { CarritoService } from '../../services/carrito.service';

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
  carritoService = inject(CarritoService);

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
  
  // Propiedades para manejo de archivos
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  
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

      // Crear FormData para envío con archivo
      const formData = new FormData();
      formData.append('nombre', this.nuevoProducto.nombre);
      formData.append('descripcion', this.nuevoProducto.descripcion);
      formData.append('precio', this.nuevoProducto.precio.toString());
      formData.append('stock', this.nuevoProducto.stock.toString());
      formData.append('desarrollador', this.nuevoProducto.desarrollador);
      formData.append('plataforma', this.nuevoProducto.plataforma);
      formData.append('categoriaId', this.nuevoProducto.categoria.id?.toString() || '');
      
      // Agregar imagen si se seleccionó una
      if (this.selectedFile) {
        formData.append('imagen', this.selectedFile);
      }

      if (this.editingProduct) {
        // Actualizar producto existente
        formData.append('id', this.editingProduct.id.toString());
        
        this.productosService.putProductoWithFile(formData).subscribe({
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
        this.productosService.postProductoWithFile(formData).subscribe({
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
    // Limpiar archivo seleccionado y previsualización
    this.selectedFile = null;
    this.imagePreview = null;
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

  // Métodos para manejo de archivos
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        this.errorMessage = 'Por favor selecciona un archivo de imagen válido';
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = 'La imagen debe ser menor a 5MB';
        return;
      }

      this.selectedFile = file;
      this.errorMessage = '';

      // Crear previsualización
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.selectedFile = null;
    this.imagePreview = null;
    this.nuevoProducto.imagen = '';
  }

  // Método para obtener la URL completa de la imagen
  getImageUrl(imagePath: string): string {
    if (!imagePath) return '';
    
    // Si ya es una URL completa, la devolvemos tal como está
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Si es una ruta relativa, agregamos la URL base del servidor
    const fullUrl = `http://localhost:9090${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
    
    return fullUrl;
  }

  // Métodos para manejo de errores de imagen
  onImageLoad(imagePath: string) {
    // Imagen cargada correctamente
    const producto = this.productos.find(p => p.imagen === imagePath);
    if (producto) {
      producto.imageError = false;
    }
  }

  onImageError(imagePath: string, event: any) {
    // Marcar que la imagen tiene error para mostrar placeholder
    const producto = this.productos.find(p => p.imagen === imagePath);
    if (producto) {
      producto.imageError = true;
    }
    
    // También marcar en productos filtrados
    const productoFiltrado = this.productosFiltrados.find(p => p.imagen === imagePath);
    if (productoFiltrado) {
      productoFiltrado.imageError = true;
    }
  }

  // Métodos para el carrito
  agregarAlCarrito(producto: any) {
    if (producto.stock > 0) {
      const agregado = this.carritoService.agregarProducto(producto);
      if (agregado) {
        this.successMessage = `${producto.nombre} agregado al carrito 🛒`;
        setTimeout(() => this.successMessage = '', 3000);
      } else {
        this.errorMessage = 'No hay stock suficiente';
        setTimeout(() => this.errorMessage = '', 3000);
      }
    } else {
      this.errorMessage = 'Producto sin stock';
      setTimeout(() => this.errorMessage = '', 3000);
    }
  }

  estaEnCarrito(productoId: number): boolean {
    return this.carritoService.estaEnCarrito(productoId);
  }
}