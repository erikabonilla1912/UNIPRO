import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div class="max-w-md w-full bg-white rounded-lg shadow-sm p-8">
        <div class="text-center mb-8">
          <div class="text-3xl font-bold mb-2">
            <span class="text-blue-600">UNI</span><span class="text-gray-800">PRO</span>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Crear Cuenta</h2>
          <p class="text-gray-600">Únete a la comunidad de UNIPRO</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
            <input formControlName="name" type="text" placeholder="Juan Pérez"
                   class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
            <input formControlName="email" type="email" placeholder="tu@universidad.edu"
                   class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Universidad</label>
            <input formControlName="university" type="text" placeholder="Universidad Nacional"
                   class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input formControlName="password" type="password" placeholder="••••••••"
                   class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Confirmar Contraseña</label>
            <input formControlName="confirmPassword" type="password" placeholder="••••••••"
                   class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            @if (form.errors?.['passwordMismatch'] && form.get('confirmPassword')?.dirty) {
              <p class="text-red-500 text-xs mt-1">Las contraseñas no coinciden</p>
            }
          </div>

          @if (errorMsg) {
            <p class="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-md">{{ errorMsg }}</p>
          }

          <button type="submit" [disabled]="loading"
                  class="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium py-2.5 rounded-md transition-colors mt-2">
            {{ loading ? 'Creando cuenta...' : 'Crear Cuenta' }}
          </button>
        </form>

        <p class="mt-6 text-center text-sm text-gray-600">
          ¿Ya tienes cuenta?
          <a routerLink="/login" class="text-blue-600 hover:text-blue-700 font-medium ml-1">Inicia sesión aquí</a>
        </p>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group(
    {
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      university: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: (g) => g.get('password')?.value !== g.get('confirmPassword')?.value ? { passwordMismatch: true } : null }
  );
  loading = false;
  errorMsg = '';

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.errorMsg = '';
    const { name, email, university, password } = this.form.value;
    this.auth.register({ name: name!, email: email!, university: university!, password: password! }).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => {
        this.errorMsg = err.error?.message || 'Error al registrarse';
        this.loading = false;
      },
    });
  }
}
