import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../models';

@Component({
  selector: 'app-project-detail',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="bg-white border-b">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <a routerLink="/proyectos" class="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors">
            ← Volver a Proyectos
          </a>
        </div>
      </div>

      @if (loading) {
        <div class="text-center py-20 text-gray-500">Cargando proyecto...</div>
      } @else if (project) {
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <!-- Main Card -->
          <div class="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
            <img
              [src]="project.image || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=400&fit=crop'"
              [alt]="project.title"
              class="w-full h-64 lg:h-96 object-cover"
            />
            <div class="p-6 lg:p-8">
              <div class="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <span class="inline-block bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded-full mb-3">
                    {{ project.category }}
                  </span>
                  <h1 class="text-3xl lg:text-4xl font-bold text-gray-900">{{ project.title }}</h1>
                </div>
                <div class="flex gap-2">
                  <button class="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                    📤 Compartir
                  </button>
                  <button class="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                    ⬇ Descargar
                  </button>
                </div>
              </div>

              <div class="flex flex-wrap gap-6 text-sm text-gray-600 mb-6">
                <span>👤 {{ getAuthorName() }}</span>
                <span>🏛 {{ project.university }}</span>
                <span>📅 {{ project.createdAt | date:'longDate':'':'es' }}</span>
              </div>

              <div class="flex gap-6 mb-6 text-sm text-gray-600">
                <span>👁 {{ project.views | number }} visualizaciones</span>
                <span>⬇ {{ project.downloads }} descargas</span>
              </div>

              <div class="border-t pt-6">
                <h2 class="text-xl font-semibold mb-4">Descripción</h2>
                <p class="text-gray-700 leading-relaxed mb-6">{{ project.description }}</p>

                <h3 class="text-lg font-semibold mb-3">Tecnologías Utilizadas</h3>
                <div class="flex flex-wrap gap-2 mb-6">
                  @for (tag of project.tags; track tag) {
                    <span class="border border-gray-300 text-gray-700 text-sm px-3 py-1 rounded-full">{{ tag }}</span>
                  }
                </div>
              </div>
            </div>
          </div>

          <!-- Author Card -->
          <div class="bg-white rounded-lg shadow-sm p-6 lg:p-8">
            <h2 class="text-xl font-semibold mb-4">Sobre el Autor</h2>
            <div class="flex items-start gap-4">
              <div class="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl flex-shrink-0">
                {{ getAuthorName().charAt(0) }}
              </div>
              <div>
                <h3 class="font-semibold text-lg mb-1">{{ getAuthorName() }}</h3>
                <p class="text-gray-600 mb-2">{{ project.university }}</p>
                <p class="text-sm text-gray-700">Estudiante apasionado por la tecnología y la innovación.</p>
              </div>
            </div>
          </div>
        </div>
      } @else {
        <div class="text-center py-20">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Proyecto no encontrado</h2>
          <a routerLink="/proyectos" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Volver a Proyectos
          </a>
        </div>
      }
    </div>
  `,
})
export class ProjectDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private projectService = inject(ProjectService);
  project: Project | null = null;
  loading = true;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.projectService.getById(id).subscribe({
      next: (p) => { this.project = p; this.loading = false; },
      error: () => (this.loading = false),
    });
  }

    getAuthorName(): string {
    if (!this.project?.author) return 'Autor desconocido';
    if (typeof this.project.author === 'string') return this.project.author;
    if (typeof this.project.author === 'object' && 'name' in this.project.author) {
        return this.project.author.name;
    }
    return 'Autor desconocido';
    }
}
