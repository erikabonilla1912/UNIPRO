import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProjectCardComponent } from '../../components/project-card/project-card.component';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule, ProjectCardComponent],
  template: `
    <!-- Hero -->
    <section class="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden">
      <div class="absolute inset-0 bg-cover bg-center opacity-20"
           style="background-image:url('https://images.unsplash.com/photo-1640556795357-71d4078d6228?w=1920&fit=crop')"></div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36">
        <div class="max-w-3xl">
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Publica tus proyectos universitarios con los Mejores
          </h1>
          <p class="text-lg sm:text-xl text-blue-100 mb-8 leading-relaxed">
            Comparte tu trabajo, inspira a otros estudiantes y construye tu portafolio académico.
          </p>
          <div class="flex flex-col sm:flex-row gap-4">
            <a routerLink="/publicar"
               class="inline-block bg-white text-blue-600 hover:bg-gray-100 font-semibold text-lg px-8 py-3 rounded-lg text-center transition-colors">
              ¡COMIENZA YA!
            </a>
            <a routerLink="/proyectos"
               class="inline-block border-2 border-white text-white hover:bg-white/10 font-semibold text-lg px-8 py-3 rounded-lg text-center transition-colors">
              Ver Proyectos
            </a>
          </div>
        </div>
      </div>
      <div class="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
    </section>

    <!-- Stats -->
    <section class="py-12 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          @for (stat of stats; track stat.label) {
            <div>
              <div class="text-3xl lg:text-4xl font-bold text-blue-600 mb-1">{{ stat.value }}</div>
              <div class="text-sm text-gray-600">{{ stat.label }}</div>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="py-16 lg:py-24">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">¿Por qué elegir UNIPRO?</h2>
          <p class="text-lg text-gray-600 max-w-2xl mx-auto">La plataforma más completa para compartir proyectos universitarios</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          @for (feature of features; track feature.title) {
            <div class="text-center p-6">
              <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-4 text-3xl">
                {{ feature.icon }}
              </div>
              <h3 class="text-xl font-semibold mb-3">{{ feature.title }}</h3>
              <p class="text-gray-600">{{ feature.desc }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- Featured Projects -->
    <section class="py-16 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Proyectos Destacados</h2>
          <p class="text-lg text-gray-600">Descubre los proyectos más populares de nuestra comunidad</p>
        </div>
        @if (loading) {
          <div class="text-center py-12 text-gray-500">Cargando proyectos...</div>
        } @else {
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            @for (project of featuredProjects; track project._id) {
              <app-project-card [project]="project" />
            }
          </div>
        }
        <div class="text-center">
          <a routerLink="/proyectos"
             class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors">
            Ver Todos los Proyectos
          </a>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
      <div class="max-w-4xl mx-auto px-4 text-center">
        <h2 class="text-3xl lg:text-4xl font-bold mb-6">¿Listo para compartir tu proyecto?</h2>
        <p class="text-lg text-blue-100 mb-8">Únete a miles de estudiantes construyendo su futuro en UNIPRO</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a routerLink="/registro"
             class="inline-block bg-white text-blue-600 hover:bg-gray-100 font-semibold text-lg px-8 py-3 rounded-lg transition-colors">
            Registrarse Gratis
          </a>
          <a routerLink="/quienes-somos"
             class="inline-block border-2 border-white text-white hover:bg-white/10 font-semibold text-lg px-8 py-3 rounded-lg transition-colors">
            Conoce Más
          </a>
        </div>
      </div>
    </section>
  `,
})
export class HomeComponent implements OnInit {
  private projectService = inject(ProjectService);
  featuredProjects: Project[] = [];
  loading = true;

  stats = [
    { value: '2,500+', label: 'Proyectos Publicados' },
    { value: '1,200+', label: 'Estudiantes Activos' },
    { value: '50+', label: 'Universidades' },
    { value: '95%', label: 'Satisfacción' },
  ];

  features = [
    { icon: '📤', title: 'Fácil Publicación', desc: 'Sube tus proyectos en minutos con nuestro sistema intuitivo.' },
    { icon: '👥', title: 'Comunidad Activa', desc: 'Conecta con miles de estudiantes y profesionales.' },
    { icon: '🔒', title: 'Seguro y Confiable', desc: 'Protección de autoría y almacenamiento seguro.' },
    { icon: '⚡', title: 'Búsqueda Rápida', desc: 'Encuentra proyectos con nuestro potente motor de búsqueda.' },
    { icon: '📈', title: 'Visibilidad', desc: 'Aumenta el alcance de tu trabajo y construye tu portafolio.' },
    { icon: '🏆', title: 'Calidad Verificada', desc: 'Todos los proyectos son revisados para garantizar calidad.' },
  ];

  ngOnInit() {
    this.projectService.getAll({ page: 1 }).subscribe({
      next: (res) => {
        this.featuredProjects = res.projects.slice(0, 3);
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }
}
