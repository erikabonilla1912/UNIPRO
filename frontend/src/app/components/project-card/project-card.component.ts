import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Project } from '../../models';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <div class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100">
      <a [routerLink]="['/proyectos', project._id]">
        <img
          [src]="project.image || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=200&fit=crop'"
          [alt]="project.title"
          class="w-full h-44 object-cover"
        />
      </a>
      <div class="p-4">
        <span class="inline-block bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full mb-2">
          {{ project.category }}
        </span>
        <a [routerLink]="['/proyectos', project._id]">
          <h3 class="font-semibold text-gray-900 mb-1 hover:text-blue-600 transition-colors line-clamp-2">
            {{ project.title }}
          </h3>
        </a>
        <p class="text-gray-500 text-sm mb-3 line-clamp-2">{{ project.description }}</p>

        <div class="flex flex-wrap gap-1 mb-3">
          @for (tag of project.tags.slice(0, 3); track tag) {
            <span class="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">{{ tag }}</span>
          }
        </div>

        <div class="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-gray-50">
          <span>{{ getAuthorName() }}</span>
          <div class="flex gap-3">
            <span>👁 {{ project.views }}</span>
            <span>⬇ {{ project.downloads }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ProjectCardComponent {
  @Input({ required: true }) project!: Project;

    getAuthorName(): string {
    if (!this.project?.author) return 'Autor desconocido';
    if (typeof this.project.author === 'string') return this.project.author;
    if (typeof this.project.author === 'object' && 'name' in this.project.author) {
        return this.project.author.name;
    }
    return 'Autor desconocido';
    }
}
