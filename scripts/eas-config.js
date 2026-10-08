// Ajusta app.json en CI para que Expo Go pueda abrir las actualizaciones publicadas.
const fs = require('fs');
const app = JSON.parse(fs.readFileSync('app.json', 'utf8'));
app.expo.runtimeVersion = { policy: 'sdkVersion' };
fs.writeFileSync('app.json', JSON.stringify(app, null, 2) + '\n');
const id = app.expo.extra && app.expo.extra.eas && app.expo.extra.eas.projectId;
console.log('EAS projectId:', id);
console.log('Abrir en Expo Go: exp://u.expo.dev/' + id + '?channel-name=main&runtime-version=exposdk:57.0.0');
