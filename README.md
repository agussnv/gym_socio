# ZGYM Socio

App del socio para ZGYM DIAZ, hecha con Expo (React Native). Usa datos simulados: sirve como demo para enseñar a gimnasios.

Pantallas: Inicio (aforo en directo), Entrenar (rutinas al estilo Hevy, temporizador de descanso, récords), Clases (reservas), Acceso (QR rotativo) y Perfil (progreso y congelar cuota).

## Abrirla en el móvil con Expo Go (sin instalar nada en el ordenador)

1. Instala **Expo Go** en el móvil (App Store o Google Play).
2. En esta página de GitHub pulsa **Code → Codespaces → Create codespace on main**. Se abre un editor en el navegador y prepara el proyecto solo (tarda un par de minutos la primera vez).
3. En la terminal de abajo escribe `npm run movil` y pulsa Enter.
4. Cuando salga el código QR, escanéalo con la cámara (iPhone) o desde Expo Go (Android).

Si ya tienes Node.js en tu ordenador, también vale: `npm install` y luego `npm run movil`.

## Versión web

```bash
npx expo export -p web
```
