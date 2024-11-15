Este proyecto utiliza MongoDB y Node.js y está configurado para ejecutar pruebas unitarias automáticamente usando GitHub Actions.

Tabla de Contenidos

Requisitos

Instalación

Ejecución de Pruebas Localmente

Configuración de GitHub Actions

Contribuir


Requisitos

Node.js (versión 18 o superior)

MongoDB (local o en contenedor Docker)


Instalación

1. Clona este repositorio:

git clone https://github.com/tu_usuario/tu_repositorio.git


2. Navega al directorio del proyecto:

cd tu_repositorio


3. Instala las dependencias:

npm install



Ejecución de Pruebas Localmente

1. Asegúrate de que MongoDB esté en ejecución en mongodb://localhost:27017.

Puedes usar Docker para levantar un contenedor de MongoDB si no lo tienes instalado:

docker run --name mongodb -p 27017:27017 -d mongo:4.4


2. Ejecuta las pruebas:

npm test

Esto ejecutará las pruebas configuradas en tu proyecto (usando Jest, Mocha, u otra librería de pruebas que hayas configurado).



Configuración de GitHub Actions

Este proyecto está configurado para ejecutar pruebas automáticamente en cada push o pull request a la rama main usando GitHub Actions.

Configuración del Workflow

El archivo de workflow se encuentra en .github/workflows/nodejs-tests.yml y está configurado de la siguiente manera:

name: Run Unit Tests

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      mongodb:
        image: mongo:4.4
        ports:
          - 27017:27017
        options: --bind_ip_all
        env:
          MONGO_INITDB_DATABASE: Unipro

    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Run tests
        env:
          MONGODB_URI: mongodb://localhost:27017/Unipro
        run: npm test

Cómo Funciona

1. Activación del workflow: El workflow se activa en cada push o pull request a la rama main.


2. Entorno de pruebas: Se crea un servicio de MongoDB que corre en el mismo entorno de ejecución.


3. Instalación de dependencias: Se instala Node.js y todas las dependencias necesarias para ejecutar el proyecto.


4. Ejecución de pruebas: Se ejecuta el comando npm test, que debe estar configurado en el archivo package.json para ejecutar las pruebas unitarias del proyecto.



Visualización de Resultados

Puedes ver los resultados de las pruebas en la pestaña Actions del repositorio en GitHub. Aquí se muestra el historial de ejecuciones y cualquier error que necesite revisión.

Contribuir

1. Haz un fork de este repositorio.


2. Crea una nueva rama:

git checkout -b feature/nueva-funcionalidad


3. Realiza tus cambios y ejecuta las pruebas localmente.


4. Haz un push de tus cambios y abre un Pull Request para revisión.
