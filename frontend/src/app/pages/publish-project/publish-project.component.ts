import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProjectService } from '../../services/project.service';
import { CATEGORIES } from '../../models';

@Component({
  selector: 'app-publish-project',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-12 px-4">
      <div class="max-w-3xl mx-auto">
        @if (submitted) {
          <div class="bg-white rounded-lg shadow-sm p-8 text-center">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-6 text-3xl">✓</div>
            <h2 class="text-2xl font-bold text-gray-900 mb-4">¡Proyecto Enviado!</h2>
            <p class="text-gray-600 mb-6">Tu proyecto está siendo revisado. Te notificaremos cuando esté disponible.</p>
            <div class="flex flex-col gap-3 max-w-xs mx-auto">
              <button (click)="submitted = false"
                      class="bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors">
                Publicar Otro Proyecto
              </button>
              <a routerLink="/proyectos"
                 class="border border-gray-300 text-gray-700 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-center">
                Ver Proyectos
              </a>
            </div>
          </div>
        } @else {
          <div class="bg-white rounded-lg shadow-sm p-8">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Publicar Proyecto</h1>
            <p class="text-gray-600 mb-8">Comparte tu trabajo con la comunidad universitaria</p>

            <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Título del Proyecto *</label>
                <input formControlName="title" type="text" placeholder="Ej: Sistema de Gestión Bibliotecaria"
                       class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Descripción *</label>
                <textarea formControlName="description" rows="6"
                          placeholder="Describe tu proyecto, objetivos, metodología y resultados..."
                          class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"></textarea>
                <p class="text-xs text-gray-500 mt-1">Mínimo 100 caracteres</p>
              </div>

              <div class="grid md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Categoría *</label>
                  <select formControlName="category"
                          class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    <option value="">Selecciona una categoría</option>
                    @for (cat of categories.slice(1); track cat) {
                      <option [value]="cat">{{ cat }}</option>
                    }
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Universidad *</label>
                  <input formControlName="university" type="text" placeholder="Universidad Nacional"
                         class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Etiquetas / Tecnologías *</label>
                <input formControlName="tags" type="text" placeholder="React, Node.js, MongoDB (separadas por comas)"
                       class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Archivos del Proyecto</label>
                <div class="border-2 border-dashed border-gray-300 rounded-md p-6 text-center hover:border-blue-500 transition-colors">
                  <p class="text-4xl mb-2">📁</p>
                  <label class="cursor-pointer text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Sube archivos
                    <input type="file" multiple (change)="onFileChange($event)" class="hidden" accept=".pdf,.doc,.docx,.zip,.rar" />
                  </label>
                  <span class="text-sm text-gray-500"> o arrastra y suelta</span>
                  <p class="text-xs text-gray-400 mt-1">PDF, DOC, ZIP hasta 50MB</p>
                </div>
                @if (files.length > 0) {
                  <ul class="mt-3 space-y-1">
                    @for (f of files; track f.name) {
                      <li class="text-sm text-gray-600 flex items-center gap-2">
                        📄 {{ f.name }} <span class="text-gray-400">({{ (f.size / 1024 / 1024).toFixed(2) }} MB)</span>
                      </li>
                    }
                  </ul>
                }
              </div>

              @if (errorMsg) {
                <p class="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-md">{{ errorMsg }}</p>
              }

              <div class="flex gap-3 pt-2">
                <button type="submit" [disabled]="loading"
                        class="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium py-2.5 rounded-md transition-colors">
                  {{ loading ? 'Publicando...' : '📤 Publicar Proyecto' }}
                </button>
                <a routerLink="/proyectos"
                   class="flex-1 border border-gray-300 text-gray-700 font-medium py-2.5 rounded-md hover:bg-gray-50 transition-colors text-center">
                  Cancelar
                </a>
              </div>
            </form>
          </div>
        }
      </div>
    </div>
  `,
})
export class PublishProjectComponent {
  private fb = inject(FormBuilder);
  private projectService = inject(ProjectService);
  private router = inject(Router);

  categories = CATEGORIES;
  files: File[] = [];
  submitted = false;
  loading = false;
  errorMsg = '';

  form = this.fb.group({
    title: ['', Validators.required],
    description: ['', [Validators.required, Validators.minLength(100)]],
    category: ['', Validators.required],
    university: ['', Validators.required],
    tags: ['', Validators.required],
  });

  onFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files) this.files = Array.from(input.files);
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.errorMsg = '';

    const fd = new FormData();
    const { title, description, category, university, tags } = this.form.value;
    fd.append('title', title!);
    fd.append('description', description!);
    fd.append('category', category!);
    fd.append('university', university!);
    fd.append('tags', tags!);
    this.files.forEach((f) => fd.append('files', f));

    this.projectService.create(fd).subscribe({
      next: () => { this.submitted = true; this.loading = false; },
      error: (err) => {
        this.errorMsg = err.error?.message || 'Error al publicar';
        this.loading = false;
      },
    });
  }
}
