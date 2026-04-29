const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = 'llama-3.3-70b-versatile';

// POST /api/ia/mejorar-descripcion
const mejorarDescripcion = async (req, res) => {
  try {
    const { titulo, descripcion, categoria } = req.body;
    if (!titulo || !descripcion) {
      return res.status(400).json({ message: 'Titulo y descripcion son requeridos' });
    }

    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: `Eres un asistente para una plataforma universitaria llamada UNIPRO.
Mejoras descripciones de proyectos universitarios para que sean claras, profesionales y detalladas.
Responde SOLO con la descripcion mejorada, sin titulos ni explicaciones adicionales.`,
        },
        {
          role: 'user',
          content: `Mejora esta descripcion de proyecto universitario:
- Titulo: ${titulo}
- Categoria: ${categoria || 'No especificada'}
- Descripcion actual: ${descripcion}

La descripcion mejorada debe tener minimo 150 palabras y mencionar objetivos, metodologia y resultados esperados.`,
        },
      ],
      max_tokens: 1024,
      temperature: 0.7,
    });

    const texto = completion.choices[0]?.message?.content || '';
    res.json({ descripcion: texto });
  } catch (error) {
    console.error('ERROR mejorar:', error.message);
    res.status(500).json({ message: 'Error al mejorar descripcion', error: error.message });
  }
};

// POST /api/ia/chat
const chat = async (req, res) => {
  try {
    const { mensaje, historial } = req.body;
    if (!mensaje) {
      return res.status(400).json({ message: 'Mensaje requerido' });
    }

    const messages = [
      {
        role: 'system',
        content: `Eres un asistente amigable de UNIPRO, una plataforma de proyectos universitarios latinoamericana.
Ayudas a estudiantes con sus proyectos academicos, investigaciones y publicaciones.
Responde siempre en español, de forma amigable y concisa. Maximo 3 parrafos por respuesta.`,
      },
      ...(historial || []).map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.text,
      })),
      { role: 'user', content: mensaje },
    ];

    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages,
      max_tokens: 512,
      temperature: 0.7,
    });

    const respuesta = completion.choices[0]?.message?.content || '';
    res.json({ respuesta });
  } catch (error) {
    console.error('ERROR chat:', error.message);
    res.status(500).json({ message: 'Error en el chat', error: error.message });
  }
};

// POST /api/ia/sugerencias-busqueda
const sugerenciasBusqueda = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ message: 'Query requerido' });
    }

    const completion = await groq.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: 'system',
          content: `Eres un asistente de busqueda para UNIPRO, una plataforma de proyectos universitarios.
Responde SOLO con un array JSON de strings, sin explicaciones ni markdown.`,
        },
        {
          role: 'user',
          content: `El usuario busca: "${query}"
Genera 5 sugerencias de busqueda relacionadas con proyectos universitarios.
Responde SOLO con el array JSON. Ejemplo: ["sugerencia 1", "sugerencia 2", "sugerencia 3", "sugerencia 4", "sugerencia 5"]`,
        },
      ],
      max_tokens: 256,
      temperature: 0.5,
    });

    const texto = completion.choices[0]?.message?.content || '[]';
    const clean = texto.replace(/```json|```/g, '').trim();
    const sugerencias = JSON.parse(clean);
    res.json({ sugerencias });
  } catch (error) {
    console.error('ERROR sugerencias:', error.message);
    res.status(500).json({ message: 'Error al generar sugerencias', error: error.message });
  }
};

module.exports = { mejorarDescripcion, chat, sugerenciasBusqueda };