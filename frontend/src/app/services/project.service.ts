import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Project, ProjectsResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private readonly API = '/api/proyectos';

  constructor(private http: HttpClient) {}

  getAll(filters: { category?: string; search?: string; page?: number } = {}) {
    let params = new HttpParams();
    if (filters.category && filters.category !== 'Todos')
      params = params.set('category', filters.category);
    if (filters.search) params = params.set('search', filters.search);
    if (filters.page) params = params.set('page', filters.page.toString());
    return this.http.get<ProjectsResponse>(this.API, { params });
  }

  getById(id: string) {
    return this.http.get<Project>(`${this.API}/${id}`);
  }

  create(formData: FormData) {
    return this.http.post<{ message: string; project: Project }>(this.API, formData);
  }

  update(id: string, data: Partial<Project>) {
    return this.http.put<{ message: string; project: Project }>(`${this.API}/${id}`, data);
  }

  delete(id: string) {
    return this.http.delete<{ message: string }>(`${this.API}/${id}`);
  }

  search(query: string) {
    return this.http.get<{ results: Project[]; total: number }>(`/api/busqueda?q=${query}`);
  }
}
