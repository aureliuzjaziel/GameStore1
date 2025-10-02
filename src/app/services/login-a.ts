import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginA {
  private acceso = false;
  private currentUser: string | null = null; // Agregar esta línea

  login(userName: string){
    this.acceso = true;
    this.currentUser = userName; // Establecer el nombre de usuario en el inicio de sesión
  }

  logout(){
    this.acceso = false;
    this.currentUser = null; // Limpiar el nombre de usuario en el cierre de sesión
  }

  logeado(){
    return this.acceso;
  }

  // Agregar este método si no existe
  getUserName(): string | null {
    return this.currentUser;
  }
}
