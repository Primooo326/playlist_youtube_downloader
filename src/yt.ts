import ytdl from "ytdl-core";
import ytpl from "ytpl";
// import JSZip from "jszip";
import fs from "fs";

export default async function yt(urlPlayList: string) {
  let contador = 0;
  const mostrarLoader = (listaDeReproduccionLen: number, actual: string) => {
    contador++;
    const progreso = contador / listaDeReproduccionLen;
    const porcentaje = Math.floor(progreso * 100);

    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write(`Descargando: ${contador}. ${actual}`);
    process.stdout.write(
      `\nPorcentaje: ${porcentaje}% ${contador}/${listaDeReproduccionLen}`
    );
  };

  const descargarMP3 = async () => {
    const repetidas = [];
    const firstResultBatch = await ytpl(urlPlayList, {
      pages: 1000,
    });
    const listaDeReproduccion: { url: string; name: string }[] = [];

    firstResultBatch.items.map((item) => {
      if (
        listaDeReproduccion.findIndex((item2) => item2.name === item.title) ===
        -1
      ) {
        listaDeReproduccion.push({ url: item.shortUrl, name: item.title });
      } else {
        repetidas.push(item);
      }
    });

    console.log("repetidas:", repetidas.length);

    const fallidas: { url: string; name: string }[] = [];
    const correctas: { url: string; name: string }[] = [];
    let completadas = 0;

    mostrarLoader(
      listaDeReproduccion.length,
      listaDeReproduccion[completadas].name
    );
    for (const { url, name } of listaDeReproduccion) {
      try {
        const info = await ytdl.getInfo(url);
        const archivoMP3 = ytdl.downloadFromInfo(info, {
          filter: "audioonly",
        });

        const nombreMP3 = `canciones/${info.videoDetails.title}.mp3`;

        archivoMP3
          .pipe(fs.createWriteStream(nombreMP3))
          .on("error", (error) => {
            fallidas.push({ url, name });
          });

        if (fallidas.findIndex((i) => i.url === url) !== -1) {
          correctas.push({ url, name });
        }
        completadas++;
        mostrarLoader(
          listaDeReproduccion.length,
          listaDeReproduccion[completadas].name
        );
      } catch (error) {
        console.log(`error: ${error}`);
      }
    }

    console.log("\n¡Descarga de MP3 completada!"); // Imprimir mensaje de descarga completada
    return fallidas;
  };

  return await descargarMP3();
}
