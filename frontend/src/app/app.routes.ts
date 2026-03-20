import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'quienes-somos',
    loadComponent: () =>
      import('./pages/about/about.component').then((m) => m.AboutComponent),
  },
  {
    path: 'proyectos',
    loadComponent: () =>
      import('./pages/projects/projects.component').then((m) => m.ProjectsComponent),
  },
  {
    path: 'proyectos/:id',
    loadComponent: () =>
      import('./pages/project-detail/project-detail.component').then(
        (m) => m.ProjectDetailComponent
      ),
  },
  {
    path: 'publicar',
    loadComponent: () =>
      import('./pages/publish-project/publish-project.component').then(
        (m) => m.PublishProjectComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'registro',
    loadComponent: () =>
      import('./pages/register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'quejas-reclamos',
    loadComponent: () =>
      import('./pages/reclamos/reclamos.component').then((m) => m.ReclamosComponent),
    canActivate: [authGuard],
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./pages/admin/admin.component').then((m) => m.AdminComponent),
    canActivate: [authGuard],
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];
