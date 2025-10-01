import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Productos {

  private API_PRODUCTOS = 'http://localhost:9090/api/juegos';
  private API_CATEGORIAS = 'http://localhost:9090/api/categorias';

  constructor(private http: HttpClient) { }

  // === PRODUCTOS ===
  getProductos(): Observable<any> {
    return this.http.get(this.API_PRODUCTOS);
  }

  getProductoPorId(id: any): Observable<any> {
    return this.http.get(`${this.API_PRODUCTOS}/${id}`);
  }

  postProducto(producto: any): Observable<any> {
    return this.http.post(this.API_PRODUCTOS, producto);
  }

  putProducto(producto: any): Observable<any> {
    return this.http.put(`${this.API_PRODUCTOS}/${producto.id}`, producto);
  }

  deleteProducto(id: any): Observable<any> {
    return this.http.delete(`${this.API_PRODUCTOS}/${id}`);
  }

  // === CATEGORÍAS ===
  getCategorias(): Observable<any> {
    return this.http.get(this.API_CATEGORIAS);
  }

  
}
