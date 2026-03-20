import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Reclamo } from '../models';

@Injectable({ providedIn: 'root' })
export class ReclamoService {
  private readonly API = '/api/reclamos';

  constructor(private http: HttpClient) {}

  create(data: { subject: string; message: string }) {
    return this.http.post<{ message: string; reclamo: Reclamo }>(this.API, data);
  }

  getMisReclamos() {
    return this.http.get<Reclamo[]>(`${this.API}/mis-reclamos`);
  }

  getAll() {
    return this.http.get<Reclamo[]>(this.API);
  }
}
