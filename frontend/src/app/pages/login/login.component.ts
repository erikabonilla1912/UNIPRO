import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div class="max-w-md w-full bg-white rounded-lg shadow-sm p-8">
        <div class="text-center mb-8">
          <div class="text-3xl font-bold mb-2">
            <span class="text-blue-600">UNI</span><span class="text-gray-800">PRO</span>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-2">Iniciar Sesión</h2>
          <p class="text-gray-600">Accede a tu cuenta de UNIPRO</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
            <input formControlName="email" type="email" placeholder="tu@universidad.edu"
                   class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input formControlName="password" type="password" placeholder="••••••••"
                   class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          @if (errorMsg) {
            <p class="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-md">{{ errorMsg }}</p>
          }

          <button type="submit" [disabled]="loading"
                  class="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium py-2.5 rounded-md transition-colors">
            {{ loading ? 'Entrando...' : 'Iniciar Sesión' }}
          </button>
        </form>

        <p class="mt-6 text-center text-sm text-gray-600">
          ¿No tienes cuenta?
          <a routerLink="/registro" class="text-blue-600 hover:text-blue-700 font-medium ml-1">Regístrate aquí</a>
        </p>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  loading = false;
  errorMsg = '';

  onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.errorMsg = '';
    const { email, password } = this.form.value;
    this.auth.login(email!, password!).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => {
        this.errorMsg = err.error?.message || 'Error al iniciar sesión';
        this.loading = false;
      },
    });
  }
}
