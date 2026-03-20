import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProjectCardComponent } from '../../components/project-card/project-card.component';
import { ProjectService } from '../../services/project.service';
import { Project, CATEGORIES } from '../../models';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, FormsModule, ProjectCardComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <div class="bg-white border-b">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Proyectos Universitarios</h1>
          <p class="text-gray-600">
            @if (searchQuery) {
              Resultados para: <strong>"{{ searchQuery }}"</strong>
            } @else {
              Explora la colección completa de proyectos
            }
          </p>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col lg:flex-row gap-8">

          <!-- Sidebar Filters -->
          <aside class="lg:w-64 flex-shrink-0">
            <div class="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 class="font-semibold text-gray-900 mb-4">Categorías</h2>
              <div class="space-y-1">
                @for (cat of categories; track cat) {
                  <button
                    (click)="selectCategory(cat)"
                    class="w-full text-left px-3 py-2 rounded-md text-sm transition-colors"
                    [class.bg-blue-600]="selectedCategory === cat"
                    [class.text-white]="selectedCategory === cat"
                    [class.text-gray-700]="selectedCategory !== cat"
                    [class.hover:bg-gray-100]="selectedCategory !== cat">
                    {{ cat }}
                  </button>
                }
              </div>
              @if (selectedCategory !== 'Todos') {
                <button (click)="selectCategory('Todos')"
                        class="w-full mt-4 border border-gray-300 text-gray-700 text-sm py-1.5 rounded-md hover:bg-gray-50 transition-colors">
                  Limpiar Filtros
                </button>
              }
            </div>
          </aside>

          <!-- Projects Grid -->
          <div class="flex-1">
            <p class="text-sm text-gray-600 mb-6">
              {{ total }} proyecto{{ total !== 1 ? 's' : '' }} encontrado{{ total !== 1 ? 's' : '' }}
            </p>

            @if (loading) {
              <div class="text-center py-16 text-gray-500">Cargando proyectos...</div>
            } @else if (projects.length > 0) {
              <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                @for (project of projects; track project._id) {
                  <app-project-card [project]="project" />
                }
              </div>
              <!-- Pagination -->
              @if (pages > 1) {
                <div class="flex justify-center gap-2 mt-8">
                  @for (p of pagesArray; track p) {
                    <button (click)="goToPage(p)"
                            class="px-4 py-2 rounded-md text-sm font-medium transition-colors"
                            [class.bg-blue-600]="p === currentPage"
                            [class.text-white]="p === currentPage"
                            [class.bg-white]="p !== currentPage"
                            [class.text-gray-700]="p !== currentPage"
                            [class.border]="p !== currentPage">
                      {{ p }}
                    </button>
                  }
                </div>
              }
            } @else {
              <div class="text-center py-16">
                <p class="text-xl font-semibold text-gray-900 mb-2">No se encontraron proyectos</p>
                <p class="text-gray-600 mb-6">Intenta con otros filtros o términos de búsqueda</p>
                <button (click)="selectCategory('Todos')"
                        class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Ver Todos los Proyectos
                </button>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ProjectsComponent implements OnInit {
  private projectService = inject(ProjectService);
  private route = inject(ActivatedRoute);

  projects: Project[] = [];
  categories = CATEGORIES;
  selectedCategory = 'Todos';
  searchQuery = '';
  loading = true;
  total = 0;
  pages = 1;
  currentPage = 1;
  get pagesArray() { return Array.from({ length: this.pages }, (_, i) => i + 1); }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.searchQuery = params['search'] || '';
      this.load();
    });
  }

  selectCategory(cat: string) {
    this.selectedCategory = cat;
    this.currentPage = 1;
    this.load();
  }

  goToPage(p: number) {
    this.currentPage = p;
    this.load();
  }

  private load() {
    this.loading = true;
    this.projectService
      .getAll({ category: this.selectedCategory, search: this.searchQuery, page: this.currentPage })
      .subscribe({
        next: (res) => {
          this.projects = res.projects;
          this.total = res.total;
          this.pages = res.pages;
          this.loading = false;
        },
        error: () => (this.loading = false),
      });
  }
}
