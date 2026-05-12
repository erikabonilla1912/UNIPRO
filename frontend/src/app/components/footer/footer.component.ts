import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="bg-gray-900 text-gray-300 py-10 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div class="text-2xl font-bold mb-3">
              <span class="text-blue-400">UNI</span><span class="text-white">PRO</span>
            </div>
            <p class="text-sm text-gray-400">
              La plataforma líder de proyectos universitarios en Latinoamérica.
            </p>
          </div>
          <div>
            <h3 class="font-semibold text-white mb-3">Navegación</h3>
            <ul class="space-y-2 text-sm">
              <li><a routerLink="/" class="hover:text-blue-400 transition-colors">Inicio</a></li>
              <li><a routerLink="/proyectos" class="hover:text-blue-400 transition-colors">Proyectos</a></li>
              <li><a routerLink="/quienes-somos" class="hover:text-blue-400 transition-colors">Quiénes Somos</a></li>
            </ul>
          </div>
          <div>
            <h3 class="font-semibold text-white mb-3">Cuenta</h3>
            <ul class="space-y-2 text-sm">
              <li><a routerLink="/login" class="hover:text-blue-400 transition-colors">Iniciar Sesión</a></li>
              <li><a routerLink="/registro" class="hover:text-blue-400 transition-colors">Registrarse</a></li>
              <li><a routerLink="/publicar" class="hover:text-blue-400 transition-colors">Publicar Proyecto</a></li>
              <li><a routerLink="/quejas-reclamos" class="hover:text-blue-400 transition-colors">Quejas y Reclamos</a></li>
            </ul>
          </div>
        </div>
        <div class="border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
          © {{ year }} UNIPRO. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  year = new Date().getFullYear();
}
