# ZGYM Socio

App del socio para ZGYM DIAZ, hecha con Expo (React Native). Usa datos simulados: sirve como demo para enseñar a gimnasios.

Pantallas: Inicio (aforo en directo), Entrenar (rutinas al estilo Hevy, temporizador de descanso, récords), Clases (reservas), Acceso (QR rotativo) y Perfil (progreso y congelar cuota).

## Abrirla en el móvil (siempre disponible)

1. Instala **Expo Go** (App Store o Google Play).
2. Escanea este enlace como QR o ábrelo en el móvil: `exp://u.expo.dev/3f182b83-9873-4a03-be84-6164264cc751?channel-name=main&runtime-version=exposdk:57.0.0`

Cada vez que se sube un cambio a `main`, GitHub Actions lo publica automáticamente (EAS Update) en ese mismo enlace.

## Modo desarrollo con Codespaces

1. Instala **Expo Go** en el móvil (App Store o Google Play).
2. En esta página de GitHub pulsa **Code → Codespaces → Create codespace on main**. Se abre un editor en el navegador y prepara el proyecto solo (tarda un par de minutos la primera vez).
3. En la terminal de abajo escribe `npm run movil` y pulsa Enter.
4. Cuando salga el código QR, escanéalo con la cámara (iPhone) o desde Expo Go (Android).

Si ya tienes Node.js en tu ordenador, también vale: `npm install` y luego `npm run movil`.

## Versión web

```bash
npx expo export -p web
```
