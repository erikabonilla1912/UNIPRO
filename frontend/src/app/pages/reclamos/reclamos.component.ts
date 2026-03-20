import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReclamoService } from '../../services/reclamo.service';
import { Reclamo } from '../../models';

@Component({
  selector: 'app-reclamos',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50 py-12 px-4">
      <div class="max-w-3xl mx-auto">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Quejas y Reclamos</h1>
        <p class="text-gray-600 mb-8">Envía tu reclamo y nuestro equipo te responderá pronto</p>

        <!-- Form -->
        <div class="bg-white rounded-lg shadow-sm p-8 mb-8">
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-5">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Asunto *</label>
              <input formControlName="subject" type="text" placeholder="Describe brevemente el asunto"
                     class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Mensaje *</label>
              <textarea formControlName="message" rows="5" placeholder="Detalla tu queja o reclamo..."
                        class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"></textarea>
            </div>
            @if (successMsg) {
              <p class="text-green-600 text-sm bg-green-50 px-3 py-2 rounded-md">{{ successMsg }}</p>
            }
            @if (errorMsg) {
              <p class="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-md">{{ errorMsg }}</p>
            }
            <button type="submit" [disabled]="loading"
                    class="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium py-2.5 rounded-md transition-colors">
              {{ loading ? 'Enviando...' : 'Enviar Reclamo' }}
            </button>
          </form>
        </div>

        <!-- Mis reclamos -->
        @if (reclamos.length > 0) {
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-xl font-semibold mb-4">Mis Reclamos</h2>
            <div class="space-y-4">
              @for (r of reclamos; track r._id) {
                <div class="border border-gray-200 rounded-lg p-4">
                  <div class="flex justify-between items-start mb-2">
                    <h3 class="font-medium text-gray-900">{{ r.subject }}</h3>
                    <span class="text-xs px-2 py-1 rounded-full"
                          [class.bg-yellow-100]="r.status === 'open'"
                          [class.text-yellow-700]="r.status === 'open'"
                          [class.bg-blue-100]="r.status === 'in_progress'"
                          [class.text-blue-700]="r.status === 'in_progress'"
                          [class.bg-green-100]="r.status === 'closed'"
                          [class.text-green-700]="r.status === 'closed'">
                      {{ statusLabel(r.status) }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-600">{{ r.message }}</p>
                  <p class="text-xs text-gray-400 mt-2">{{ r.createdAt | date:'medium' }}</p>
                </div>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class ReclamosComponent implements OnInit {
  private fb = inject(FormBuilder);
  private reclamoService = inject(ReclamoService);

  reclamos: Reclamo[] = [];
  loading = false;
  successMsg = '';
  errorMsg = '';

  form = this.fb.group({
    subject: ['', Validators.required],
    message: ['', [Validators.required, Validators.minLength(20)]],
  });

  ngOnInit() {
    this.reclamoService.getMisReclamos().subscribe({ next: (r) => (this.reclamos = r) });
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.errorMsg = '';
    const { subject, message } = this.form.value;
    this.reclamoService.create({ subject: subject!, message: message! }).subscribe({
      next: (res) => {
        this.successMsg = res.message;
        this.form.reset();
        this.reclamos.unshift(res.reclamo);
        this.loading = false;
      },
      error: (err) => {
        this.errorMsg = err.error?.message || 'Error al enviar';
        this.loading = false;
      },
    });
  }

  statusLabel(status: string) {
    return { open: 'Abierto', in_progress: 'En proceso', closed: 'Cerrado' }[status] ?? status;
  }
}
