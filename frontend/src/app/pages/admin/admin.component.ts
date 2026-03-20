import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { Project } from '../../models';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50 py-12 px-4">
      <div class="max-w-6xl mx-auto">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Panel de Administración</h1>
            <p class="text-gray-600 mt-1">Gestiona y aprueba los proyectos publicados</p>
          </div>
          <div class="flex gap-3">
            <span class="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">
              {{ pendingCount }} pendientes
            </span>
            <span class="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
              {{ approvedCount }} aprobados
            </span>
          </div>
        </div>

        <!-- Filtros -->
        <div class="flex gap-2 mb-6">
          @for (f of filters; track f.value) {
            <button (click)="selectedFilter = f.value; applyFilter()"
                    class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    [class.bg-blue-600]="selectedFilter === f.value"
                    [class.text-white]="selectedFilter === f.value"
                    [class.bg-white]="selectedFilter !== f.value"
                    [class.text-gray-700]="selectedFilter !== f.value"
                    [class.border]="selectedFilter !== f.value">
              {{ f.label }}
            </button>
          }
        </div>

        @if (loading) {
          <div class="text-center py-16 text-gray-500">Cargando proyectos...</div>
        } @else if (filteredProjects.length === 0) {
          <div class="text-center py-16 bg-white rounded-lg shadow-sm">
            <p class="text-xl font-semibold text-gray-900 mb-2">No hay proyectos</p>
            <p class="text-gray-500">No hay proyectos con este filtro</p>
          </div>
        } @else {
          <div class="bg-white rounded-lg shadow-sm overflow-hidden">
            <table class="w-full">
              <thead class="bg-gray-50 border-b">
                <tr>
                  <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Proyecto</th>
                  <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Categoría</th>
                  <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Universidad</th>
                  <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th class="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                @for (project of filteredProjects; track project._id) {
                  <tr class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4">
                      <p class="font-medium text-gray-900 line-clamp-1">{{ project.title }}</p>
                      <p class="text-xs text-gray-400 mt-1">{{ project.createdAt | date:'dd/MM/yyyy' }}</p>
                    </td>
                    <td class="px-6 py-4">
                      <span class="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                        {{ project.category }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-sm text-gray-600">{{ project.university }}</td>
                    <td class="px-6 py-4">
                      <span class="text-xs px-2 py-1 rounded-full font-medium"
                            [class.bg-yellow-100]="project.status === 'pending'"
                            [class.text-yellow-700]="project.status === 'pending'"
                            [class.bg-green-100]="project.status === 'approved'"
                            [class.text-green-700]="project.status === 'approved'"
                            [class.bg-red-100]="project.status === 'rejected'"
                            [class.text-red-700]="project.status === 'rejected'">
                        {{ statusLabel(project.status) }}
                      </span>
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex gap-2">
                        @if (project.status !== 'approved') {
                          <button (click)="updateStatus(project, 'approved')"
                                  class="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1.5 rounded-lg transition-colors">
                            ✓ Aprobar
                          </button>
                        }
                        @if (project.status !== 'rejected') {
                          <button (click)="updateStatus(project, 'rejected')"
                                  class="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded-lg transition-colors">
                            ✕ Rechazar
                          </button>
                        }
                        @if (project.status !== 'pending') {
                          <button (click)="updateStatus(project, 'pending')"
                                  class="bg-yellow-500 hover:bg-yellow-600 text-white text-xs px-3 py-1.5 rounded-lg transition-colors">
                            ↺ Pendiente
                          </button>
                        }
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    </div>
  `,
})
export class AdminComponent implements OnInit {
  private http = inject(HttpClient);
  auth = inject(AuthService);

  projects: Project[] = [];
  filteredProjects: Project[] = [];
  loading = true;
  selectedFilter = 'all';

  filters = [
    { label: 'Todos', value: 'all' },
    { label: '⏳ Pendientes', value: 'pending' },
    { label: '✅ Aprobados', value: 'approved' },
    { label: '❌ Rechazados', value: 'rejected' },
  ];

  get pendingCount() { return this.projects.filter(p => p.status === 'pending').length; }
  get approvedCount() { return this.projects.filter(p => p.status === 'approved').length; }

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.loading = true;
    this.http.get<{ projects: Project[] }>('/api/admin/proyectos').subscribe({
      next: (res) => {
        this.projects = res.projects;
        this.applyFilter();
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  applyFilter() {
    this.filteredProjects = this.selectedFilter === 'all'
      ? this.projects
      : this.projects.filter(p => p.status === this.selectedFilter);
  }

  updateStatus(project: Project, status: string) {
    this.http.patch(`/api/proyectos/${project._id}/status`, { status }).subscribe({
      next: () => {
        project.status = status as any;
        this.applyFilter();
      },
    });
  }

  statusLabel(status: string) {
    return { pending: 'Pendiente', approved: 'Aprobado', rejected: 'Rechazado' }[status] ?? status;
  }
}
