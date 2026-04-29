import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IaService } from '../../services/ia.service';

interface Mensaje {
  role: 'user' | 'assistant';
  text: string;
}

@Component({
  selector: 'app-chat-ia',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Botón flotante -->
    <button
      (click)="toggleChat()"
      class="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-50 transition-all"
      style="background: linear-gradient(135deg, #4F46E5, #7C3AED)">
      @if (abierto()) {
        <span class="text-white text-xl font-bold">✕</span>
      } @else {
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <circle cx="14" cy="14" r="13" fill="white" fill-opacity="0.15"/>
          <path d="M7 10h14M7 14h10M7 18h8" stroke="white" stroke-width="2" stroke-linecap="round"/>
          <circle cx="21" cy="18" r="3.5" fill="#34D399"/>
        </svg>
      }
    </button>

    <!-- Ventana del chat -->
    @if (abierto()) {
      <div class="fixed bottom-24 right-6 w-80 bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-100"
           style="height: 460px">

        <!-- Header -->
        <div class="px-4 py-3 flex items-center gap-3"
             style="background: linear-gradient(135deg, #4F46E5, #7C3AED)">
          <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">G</div>
          <div>
            <p class="text-white font-semibold text-sm">Asistente UNIPRO</p>
            <p class="text-white/70 text-xs">Powered by Gemini</p>
          </div>
        </div>

        <!-- Mensajes -->
        <div class="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50" #mensajesDiv>
          @if (historial().length === 0) {
            <div class="text-center py-6">
              <div class="text-4xl mb-3">👋</div>
              <p class="text-gray-700 font-medium text-sm">Hola, soy tu asistente</p>
              <p class="text-gray-500 text-xs mt-1">Puedo ayudarte con tus proyectos universitarios</p>
              <div class="mt-4 space-y-2">
                @for (s of sugerencias; track s) {
                  <button (click)="enviarMensaje(s)"
                          class="w-full text-left text-xs bg-white border border-gray-200 rounded-lg px-3 py-2 hover:bg-indigo-50 hover:border-indigo-300 transition-colors text-gray-600">
                    {{ s }}
                  </button>
                }
              </div>
            </div>
          }
          @for (msg of historial(); track $index) {
            <div [class.flex-row-reverse]="msg.role === 'user'" class="flex gap-2 items-end">
              @if (msg.role === 'assistant') {
                <div class="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white"
                     style="background: linear-gradient(135deg, #4F46E5, #7C3AED)">G</div>
              }
              <div class="max-w-[85%] px-3 py-2 rounded-2xl text-xs leading-relaxed"
                   [class.bg-indigo-600]="msg.role === 'user'"
                   [class.text-white]="msg.role === 'user'"
                   [class.rounded-br-sm]="msg.role === 'user'"
                   [class.bg-white]="msg.role === 'assistant'"
                   [class.text-gray-700]="msg.role === 'assistant'"
                   [class.border]="msg.role === 'assistant'"
                   [class.border-gray-200]="msg.role === 'assistant'"
                   [class.rounded-bl-sm]="msg.role === 'assistant'">
                {{ msg.text }}
              </div>
            </div>
          }
          @if (cargando()) {
            <div class="flex gap-2 items-end">
              <div class="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white"
                   style="background: linear-gradient(135deg, #4F46E5, #7C3AED)">G</div>
              <div class="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-3 py-2">
                <div class="flex gap-1">
                  <div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
                  <div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
                  <div class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
                </div>
              </div>
            </div>
          }
        </div>

        <!-- Input -->
        <div class="p-3 bg-white border-t border-gray-100">
          <div class="flex gap-2">
            <input
              [(ngModel)]="inputMensaje"
              (keydown.enter)="enviarMensaje()"
              placeholder="Escribe tu pregunta..."
              class="flex-1 text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              [disabled]="cargando()" />
            <button
              (click)="enviarMensaje()"
              [disabled]="cargando() || !inputMensaje.trim()"
              class="w-8 h-8 rounded-xl flex items-center justify-center disabled:opacity-40 transition-colors"
              style="background: linear-gradient(135deg, #4F46E5, #7C3AED)">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 7h12M7 1l6 6-6 6" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class ChatIaComponent {
  private ia = inject(IaService);

  abierto = signal(false);
  cargando = signal(false);
  historial = signal<Mensaje[]>([]);
  inputMensaje = '';

  sugerencias = [
    'Como publico mi proyecto?',
    'Que categorias hay disponibles?',
    'Como mejoro la descripcion de mi proyecto?',
    'Como busco proyectos similares al mio?',
  ];

  toggleChat() {
    this.abierto.update(v => !v);
  }

  enviarMensaje(texto?: string) {
    const msg = texto || this.inputMensaje.trim();
    if (!msg || this.cargando()) return;

    this.historial.update(h => [...h, { role: 'user', text: msg }]);
    this.inputMensaje = '';
    this.cargando.set(true);

    const historialApi = this.historial().slice(0, -1).map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      text: m.text,
    }));

    this.ia.chat(msg, historialApi).subscribe({
      next: (res) => {
        this.historial.update(h => [...h, { role: 'assistant', text: res.respuesta }]);
        this.cargando.set(false);
      },
      error: () => {
        this.historial.update(h => [...h, { role: 'assistant', text: 'Lo siento, ocurrió un error. Intenta de nuevo.' }]);
        this.cargando.set(false);
      },
    });
  }
}
