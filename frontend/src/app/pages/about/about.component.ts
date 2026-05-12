import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  template: `
    <div class="min-h-screen bg-gray-50">
      <div class="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-20">
        <div class="max-w-4xl mx-auto px-4 text-center">
          <h1 class="text-4xl lg:text-5xl font-bold mb-4">Quiénes Somos</h1>
          <p class="text-xl text-blue-100">La plataforma que conecta el talento universitario</p>
        </div>
      </div>
      <div class="max-w-4xl mx-auto px-4 py-16">
        <div class="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h2 class="text-2xl font-bold mb-4 text-gray-900">Nuestra Misión</h2>
          <p class="text-gray-600 leading-relaxed">
            UNIPRO es la plataforma líder en Latinoamérica para compartir y descubrir proyectos universitarios.
            Creemos que el conocimiento académico debe ser accesible para todos, y que los estudiantes merecen
            un espacio donde su trabajo sea reconocido y valorado.
          </p>
        </div>
        <div class="grid md:grid-cols-3 gap-6">
          @for (v of values; track v.title) {
            <div class="bg-white rounded-xl shadow-sm p-6 text-center">
              <div class="text-4xl mb-3">{{ v.icon }}</div>
              <h3 class="font-semibold text-gray-900 mb-2">{{ v.title }}</h3>
              <p class="text-sm text-gray-600">{{ v.desc }}</p>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class AboutComponent {
  values = [
    { icon: '🎓', title: 'Educación', desc: 'Promovemos el aprendizaje continuo y la excelencia académica.' },
    { icon: '🤝', title: 'Comunidad', desc: 'Construimos redes de apoyo entre estudiantes y profesionales.' },
    { icon: '💡', title: 'Innovación', desc: 'Impulsamos soluciones creativas a problemas reales.' },
  ];
}
