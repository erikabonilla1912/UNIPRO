import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <header class="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <a routerLink="/" class="text-2xl font-bold">
            <span class="text-blue-600">UNI</span><span class="text-gray-800">PRO</span>
          </a>

          <!-- Nav -->
          <nav class="hidden md:flex items-center gap-6">
            <a routerLink="/" routerLinkActive="text-blue-600" [routerLinkActiveOptions]="{exact:true}"
               class="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Inicio</a>
            <a routerLink="/proyectos" routerLinkActive="text-blue-600"
               class="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Proyectos</a>
            <a routerLink="/quienes-somos" routerLinkActive="text-blue-600"
               class="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Quiénes Somos</a>
            @if (auth.isLoggedIn()) {
              <a routerLink="/quejas-reclamos" routerLinkActive="text-blue-600"
                 class="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Reclamos</a>
              @if (auth.currentUser()?.role === 'admin') {
                <a routerLink="/admin" routerLinkActive="text-blue-600"
                   class="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">⚙ Admin</a>
                <a routerLink="/dashboard" routerLinkActive="text-blue-600"
                   class="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">📊 Dashboard</a>
              }
            }
          </nav>

          <!-- Actions -->
          <div class="flex items-center gap-3">
            @if (auth.isLoggedIn()) {
              <a routerLink="/publicar"
                 class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                + Publicar
              </a>
              <button (click)="auth.logout()"
                      class="text-sm text-gray-600 hover:text-red-600 transition-colors font-medium">
                Salir
              </button>
            } @else {
              <a routerLink="/login"
                 class="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                Iniciar Sesión
              </a>
              <a routerLink="/registro"
                 class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                Registrarse
              </a>
            }
          </div>
        </div>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  auth = inject(AuthService);
}
