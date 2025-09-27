import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Usuario {
  
  constructor( private http: HttpClient){}

  private API_USER = "http://localhost:3000/users"

  //GUARDAR - POST
  postUser(usuario : JSON):Observable<any> {
    return this.http.post(this.API_USER, usuario)
  }

  //LEER UNA LISTA - GET
  getUser(): Observable<any>{
    return this.http.get(this.API_USER)
  }

  //ELIMINAR ELEMENTO - DELETE
  deleteUser(id : any): Observable<any>{
    return this.http.delete(this.API_USER+"/"+id)
  }
///////////////////////////////////////////
  ///////////////////////////////
  ////// FALTA ESTO  necesario para editar///////////////


  //EDITAR - PUT
  updateUser(usuario : any): Observable<any>{
    return this.http.put(this.API_USER+"/"+usuario.id , usuario)
    //return this.http.delete( valor antiguo,  valor nuevo )
  }

  // TRAER UN USUARIO
  getUsuario(id: any):Observable<any>{
    return( this.http.get(this.API_USER+"/"+id))
  }
}
