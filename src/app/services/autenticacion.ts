import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Autenticacion {

  constructor(private http: HttpClient) { }

  private API_AUTOR = "http://localhost:9090/productos"
  private API_USUARIOS = "http://localhost:3000/usuarios"
  
  getProducto():Observable<any>{
    return this.http.get(this.API_AUTOR)
  }

  getProductoID(id: any):Observable<any>{
    return this.http.get(`${this.API_AUTOR}/${id}`)
  }

  postProducto(producto: any):Observable<any>{
    return this.http.post(this.API_AUTOR, producto)
  }

  putProductos( producto: any): Observable <any>{
    return this.http.put( `${this.API_AUTOR}/${producto.id}`, producto)
  }

  deleteProductos( id: any): Observable <any>{
    return this.http.delete(`${this.API_AUTOR}/${id}`)
  }

  // Métodos para usuarios
  registerUser(usuario: any): Observable<any> {
    return this.http.post(this.API_USUARIOS, usuario)
  }

  getUsuarios(): Observable<any> {
    return this.http.get(this.API_USUARIOS)
  }

  loginUser(credenciales: { email: string, password: string }): Observable<any> {
    // Consultamos todos los usuarios y validamos las credenciales
    return new Observable(observer => {
      this.getUsuarios().subscribe({
        next: (usuarios) => {
          const usuario = usuarios.find((u: any) => 
            u.email === credenciales.email && u.password === credenciales.password
          );
          
          if (usuario) {
            // Login exitoso
            observer.next({
              success: true,
              user: {
                id: usuario.id,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                email: usuario.email
              },
              message: 'Login exitoso'
            });
          } else {
            // Credenciales inválidas
            observer.next({
              success: false,
              message: 'Email o contraseña incorrectos'
            });
          }
          observer.complete();
        },
        error: (error) => {
          observer.error({
            success: false,
            message: 'Error al conectar con el servidor'
          });
        }
      });
    });
  }
}
