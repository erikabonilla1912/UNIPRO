import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class IaService {
  private readonly API = '/api/ia';

  constructor(private http: HttpClient) {}

  mejorarDescripcion(titulo: string, descripcion: string, categoria: string) {
    return this.http.post<{ descripcion: string }>(
      `${this.API}/mejorar-descripcion`,
      { titulo, descripcion, categoria }
    );
  }

  chat(mensaje: string, historial: { role: string; text: string }[] = []) {
    return this.http.post<{ respuesta: string }>(
      `${this.API}/chat`,
      { mensaje, historial }
    );
  }

  sugerenciasBusqueda(query: string) {
    return this.http.post<{ sugerencias: string[] }>(
      `${this.API}/sugerencias-busqueda`,
      { query }
    );
  }
}
