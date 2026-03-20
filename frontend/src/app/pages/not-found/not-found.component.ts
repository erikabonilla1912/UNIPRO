import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div class="max-w-md w-full text-center">
        <h1 class="text-9xl font-bold text-blue-600 mb-4">404</h1>
        <h2 class="text-3xl font-bold text-gray-900 mb-4">Página no encontrada</h2>
        <p class="text-gray-600 mb-8">Lo sentimos, la página que buscas no existe o ha sido movida.</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a routerLink="/" class="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors">
            🏠 Ir al Inicio
          </a>
          <a routerLink="/proyectos" class="border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium px-6 py-2.5 rounded-lg transition-colors">
            🔍 Ver Proyectos
          </a>
        </div>
      </div>
    </div>
  `,
})
export class NotFoundComponent {}
