const ytdl = require('ytdl-core');
const ytpl = require('ytpl');
const fs = require('fs');

let contador = 0




function mostrarLoader(completadas, listaDeReproduccionLen, correctas, fallidas, actual) {
  contador++
  const progreso = contador / listaDeReproduccionLen
  const porcentaje = Math.floor(progreso * 100);

  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write(`Descargando: ${contador}. ${actual}`);
  process.stdout.write(`\nPorcentaje: ${porcentaje}% ${correctas + fallidas}/${listaDeReproduccionLen}`);

}

async function descargarMP3() {
  const repetidas = []
  const firstResultBatch = await ytpl('PLbJr1Hz1efqQLiG96yDtiZJkG7YGf8X-K', { pages: 1000 });
  const listaDeReproduccion = []

  firstResultBatch.items.map(item => {
    if (listaDeReproduccion.findIndex((item2) => item2.name === item.title) == -1) {
      listaDeReproduccion.push({ url: item.shortUrl, name: item.title });
    } else {
      repetidas.push(item);

    }
  });

  console.log("repetidas:", repetidas.length);

  const fallidas = [];
  const correctas = [];
  let completadas = 0

  const loaderInterval = mostrarLoader(completadas, listaDeReproduccion.length, correctas.length, fallidas.length, listaDeReproduccion[completadas].name);
  for (const { url, name } of listaDeReproduccion) {
    try {
      const info = await ytdl.getInfo(url);
      const archivoMP3 = ytdl.downloadFromInfo(info, {
        filter: 'audioonly'
      });

      const nombreMP3 = `aver/${info.videoDetails.title}.mp3`;

      archivoMP3.pipe(fs.createWriteStream(nombreMP3)).on('error', (error) => {
        fallidas.push(info.videoDetails.video_url);
      });

      if (!fallidas.includes(info.videoDetails.video_url)) {
        correctas.push(info.videoDetails.video_url)
      };
      completadas++
      mostrarLoader(completadas, listaDeReproduccion.length, correctas.length, fallidas.length, listaDeReproduccion[completadas].name);
    } catch (error) {
      console.log("error: " + error);
    }

  }

  clearInterval(loaderInterval); // Detener el loader
  console.log('\n¡Descarga de MP3 completada!'); // Imprimir mensaje de descarga completada
  console.log(fallidas);
}

descargarMP3();



