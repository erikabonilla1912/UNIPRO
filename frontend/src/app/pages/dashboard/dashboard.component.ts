import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { IaService } from '../../services/ia.service';

interface DashboardData {
  stats: {
    totalUsers: number;
    totalProjects: number;
    pendingProjects: number;
    approvedProjects: number;
    totalReclamos: number;
    openReclamos: number;
  };
  projectsByCategory: { _id: string; count: number }[];
  recentProjects: { title: string; status: string; createdAt: string; university: string }[];
  topProjects: { title: string; views: number; downloads: number }[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50 py-8 px-4">
      <div class="max-w-7xl mx-auto">

        <!-- Header -->
        <div class="flex items-center justify-between mb-8">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Dashboard Analytics</h1>
            <p class="text-gray-500 mt-1">Vista general de la plataforma UNIPRO</p>
          </div>
          <div class="flex gap-3">
            <a routerLink="/admin"
               class="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors">
              Panel Admin
            </a>
            <button (click)="generarAnalisisIA()"
                    [disabled]="generandoIA"
                    class="flex items-center gap-2 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-60 transition-colors"
                    style="background: linear-gradient(135deg, #4F46E5, #7C3AED)">
              {{ generandoIA ? 'Analizando...' : '✨ Analisis IA' }}
            </button>
          </div>
        </div>

        @if (loading) {
          <div class="text-center py-20 text-gray-500">Cargando analytics...</div>
        } @else if (data) {

          <!-- Stats Cards -->
          <div class="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <div class="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
              <p class="text-sm text-gray-500 mb-1">Total Usuarios</p>
              <p class="text-3xl font-bold text-gray-900">{{ data.stats.totalUsers }}</p>
              <p class="text-xs text-blue-600 mt-1">Registrados en la plataforma</p>
            </div>
            <div class="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
              <p class="text-sm text-gray-500 mb-1">Proyectos Aprobados</p>
              <p class="text-3xl font-bold text-gray-900">{{ data.stats.approvedProjects }}</p>
              <p class="text-xs text-green-600 mt-1">Visibles en la plataforma</p>
            </div>
            <div class="bg-white rounded-xl shadow-sm p-6 border-l-4 border-yellow-500">
              <p class="text-sm text-gray-500 mb-1">Proyectos Pendientes</p>
              <p class="text-3xl font-bold text-gray-900">{{ data.stats.pendingProjects }}</p>
              <p class="text-xs text-yellow-600 mt-1">Esperando revision</p>
            </div>
            <div class="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
              <p class="text-sm text-gray-500 mb-1">Total Proyectos</p>
              <p class="text-3xl font-bold text-gray-900">{{ data.stats.totalProjects }}</p>
              <p class="text-xs text-purple-600 mt-1">Incluyendo todos los estados</p>
            </div>
            <div class="bg-white rounded-xl shadow-sm p-6 border-l-4 border-red-500">
              <p class="text-sm text-gray-500 mb-1">Reclamos Abiertos</p>
              <p class="text-3xl font-bold text-gray-900">{{ data.stats.openReclamos }}</p>
              <p class="text-xs text-red-600 mt-1">Requieren atencion</p>
            </div>
            <div class="bg-white rounded-xl shadow-sm p-6 border-l-4 border-indigo-500">
              <p class="text-sm text-gray-500 mb-1">Tasa de Aprobacion</p>
              <p class="text-3xl font-bold text-gray-900">{{ getApprovalRate() }}%</p>
              <p class="text-xs text-indigo-600 mt-1">Proyectos aprobados vs total</p>
            </div>
          </div>

          <!-- AI Analysis -->
          @if (analisisIA) {
            <div class="bg-white rounded-xl shadow-sm p-6 mb-8 border border-indigo-100">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                     style="background: linear-gradient(135deg, #4F46E5, #7C3AED)">IA</div>
                <h2 class="text-lg font-semibold text-gray-900">Analisis Ejecutivo con IA</h2>
              </div>
              <p class="text-gray-700 leading-relaxed text-sm whitespace-pre-line">{{ analisisIA }}</p>
            </div>
          }

          <div class="grid lg:grid-cols-2 gap-6 mb-8">

            <!-- Projects by Category -->
            <div class="bg-white rounded-xl shadow-sm p-6">
              <h2 class="text-lg font-semibold text-gray-900 mb-4">Proyectos por Categoria</h2>
              @if (data.projectsByCategory.length === 0) {
                <p class="text-gray-400 text-sm text-center py-8">Sin datos aun</p>
              } @else {
                <div class="space-y-3">
                  @for (cat of data.projectsByCategory; track cat._id) {
                    <div>
                      <div class="flex justify-between text-sm mb-1">
                        <span class="text-gray-700 truncate">{{ cat._id || 'Sin categoria' }}</span>
                        <span class="font-medium text-gray-900 ml-2">{{ cat.count }}</span>
                      </div>
                      <div class="w-full bg-gray-100 rounded-full h-2">
                        <div class="h-2 rounded-full transition-all"
                             style="background: linear-gradient(135deg, #4F46E5, #7C3AED)"
                             [style.width]="getBarWidth(cat.count) + '%'">
                        </div>
                      </div>
                    </div>
                  }
                </div>
              }
            </div>

            <!-- Top Projects -->
            <div class="bg-white rounded-xl shadow-sm p-6">
              <h2 class="text-lg font-semibold text-gray-900 mb-4">Proyectos mas Vistos</h2>
              @if (data.topProjects.length === 0) {
                <p class="text-gray-400 text-sm text-center py-8">Sin datos aun</p>
              } @else {
                <div class="space-y-3">
                  @for (project of data.topProjects; track project.title; let i = $index) {
                    <div class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                           [style.background]="getRankColor(i)">
                        {{ i + 1 }}
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900 truncate">{{ project.title }}</p>
                        <p class="text-xs text-gray-500">{{ project.views }} vistas · {{ project.downloads }} descargas</p>
                      </div>
                    </div>
                  }
                </div>
              }
            </div>
          </div>

          <!-- Recent Projects -->
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Proyectos Recientes</h2>
            @if (data.recentProjects.length === 0) {
              <p class="text-gray-400 text-sm text-center py-8">Sin proyectos aun</p>
            } @else {
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead>
                    <tr class="text-left text-xs text-gray-500 border-b">
                      <th class="pb-3 font-medium">Proyecto</th>
                      <th class="pb-3 font-medium">Universidad</th>
                      <th class="pb-3 font-medium">Fecha</th>
                      <th class="pb-3 font-medium">Estado</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-50">
                    @for (project of data.recentProjects; track project.title) {
                      <tr class="text-sm">
                        <td class="py-3 font-medium text-gray-900 max-w-xs truncate">{{ project.title }}</td>
                        <td class="py-3 text-gray-500">{{ project.university }}</td>
                        <td class="py-3 text-gray-500">{{ project.createdAt | date:'dd/MM/yyyy' }}</td>
                        <td class="py-3">
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
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
})
export class DashboardComponent implements OnInit {
  private http = inject(HttpClient);
  private ia = inject(IaService);

  data: DashboardData | null = null;
  loading = true;
  generandoIA = false;
  analisisIA = '';

  ngOnInit() {
    this.http.get<DashboardData>('/api/admin/dashboard').subscribe({
      next: (res) => { this.data = res; this.loading = false; },
      error: () => (this.loading = false),
    });
  }

  generarAnalisisIA() {
    if (!this.data) return;
    this.generandoIA = true;
    const resumen = `Analiza estos datos de la plataforma UNIPRO y genera un resumen ejecutivo en español de maximo 200 palabras con conclusiones y recomendaciones:
- Total usuarios: ${this.data.stats.totalUsers}
- Proyectos aprobados: ${this.data.stats.approvedProjects}
- Proyectos pendientes: ${this.data.stats.pendingProjects}
- Reclamos abiertos: ${this.data.stats.openReclamos}
- Tasa de aprobacion: ${this.getApprovalRate()}%
- Categorias mas populares: ${this.data.projectsByCategory.slice(0, 3).map(c => c._id + ' (' + c.count + ')').join(', ')}`;

    this.ia.chat(resumen, []).subscribe({
      next: (res) => { this.analisisIA = res.respuesta; this.generandoIA = false; },
      error: () => (this.generandoIA = false),
    });
  }

  getApprovalRate(): number {
    if (!this.data || this.data.stats.totalProjects === 0) return 0;
    return Math.round((this.data.stats.approvedProjects / this.data.stats.totalProjects) * 100);
  }

  getBarWidth(count: number): number {
    if (!this.data || this.data.projectsByCategory.length === 0) return 0;
    const max = Math.max(...this.data.projectsByCategory.map(c => c.count));
    return Math.round((count / max) * 100);
  }

  getRankColor(index: number): string {
    const colors = ['#F59E0B', '#6B7280', '#92400E', '#4F46E5', '#059669'];
    return colors[index] || '#4F46E5';
  }

  statusLabel(status: string) {
    return { pending: 'Pendiente', approved: 'Aprobado', rejected: 'Rechazado' }[status] ?? status;
  }
}
