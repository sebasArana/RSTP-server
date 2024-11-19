const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

const { proxy, scriptUrl } = require('rtsp-relay')(app);

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
      loadPlayer({
        url: 'ws://' + location.host + '/api/stream',
        canvas: canvas
      });
      playButton.style.display = 'none'; // Ocultar el botón una vez iniciado
    });
  </script>
`),
);

app.listen(2000, () => {
  console.log('Servidor ejecutándose en http://localhost:2000');
});
