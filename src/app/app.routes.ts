import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Registro } from './pages/registro/registro';
import { Productos } from './pages/productos/productos';

export const routes: Routes = [
    { path: "", redirectTo: "/home", pathMatch: "full" },
    { path: "home", component: Home },
    { path: "productos", component: Productos },
    { path: "login", component: Login },
    { path: "registro", component: Registro },
    { path: "**", redirectTo: "/home" }
];
