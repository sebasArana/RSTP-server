const express = require('express');
const cors = require('cors');
const { proxy, scriptUrl } = require('rtsp-relay');

const app = express();
app.use(cors());

const handler = proxy({
  url: `rtsp://FamiliaConejin:Carnival2024@@@192.168.18.76:554/stream1`,
  verbose: false,
});

// Endpoint para la transmisión RTSP
app.ws('/api/stream', handler);

// Página HTML para mostrar el flujo de video
app.get('/', (req, res) =>
  res.send(`
  <canvas id="canvas"></canvas>
  <button id="playButton">Iniciar reproducción</button>

  <script src="${scriptUrl}"></script>
  <script>
    const playButton = document.getElementById('playButton');
    const canvas = document.getElementById('canvas');

    playButton.addEventListener('click', () => {
      // Iniciar el reproductor solo después de la interacción del usuario
      const wsProtocol = location.protocol === 'https:' ? 'wss://' : 'ws://';
      const wsUrl = wsProtocol + location.host + '/api/stream';

      loadPlayer({
        url: wsUrl,
        canvas: canvas
      });

      // Ocultar el botón una vez iniciado
      playButton.style.display = 'none';
    });
  </script>
`),
);

// Usar el puerto asignado por Render o uno predeterminado
const PORT = process.env.PORT || 2000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
