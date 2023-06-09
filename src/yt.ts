import ytdl from "ytdl-core";
import ytpl from "ytpl";
import JSZip from "jszip";
import fs from "fs";
import path from "path";
import { promisify } from "util";

export default async function yt(pathYt: string) {
  const regex = /list=([^&]+)/;
  const match = pathYt.match(regex);
  const playlistId = match ? match[1] : null;

  if (playlistId) {
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
    const crearArchivoZIP = async (
      rutaCarpeta: string,
      nombreArchivoZIP: string
    ) => {
      const zip = new JSZip();

      const agregarArchivosRecursivamente = async (
        ruta: any,
        carpetaZip: any
      ) => {
        const archivos = await promisify(fs.readdir)(ruta);

        for (const archivo of archivos) {
          const rutaArchivo = path.join(ruta, archivo);
          const estadisticasArchivo = await promisify(fs.stat)(rutaArchivo);

          if (estadisticasArchivo.isFile()) {
            const contenidoArchivo = await promisify(fs.readFile)(rutaArchivo);
            carpetaZip.file(archivo, contenidoArchivo);
          } else if (estadisticasArchivo.isDirectory()) {
            const subcarpetaZip = carpetaZip.folder(archivo);
            await agregarArchivosRecursivamente(rutaArchivo, subcarpetaZip);
          }
        }
      };

      await agregarArchivosRecursivamente(rutaCarpeta, zip);

      const contenidoZIP = await zip.generateAsync({ type: "nodebuffer" });
      await promisify(fs.writeFile)(nombreArchivoZIP, contenidoZIP);

      await promisify(fs.rmdir)(rutaCarpeta, { recursive: true });
    };
    const descargarMP3 = async () => {
      // rome-ignore lint/suspicious/noExplicitAny: <explanation>
      const repetidas: any[] = [];
      const firstResultBatch = await ytpl(playlistId, {
        pages: 1000,
      });
      const listaDeReproduccion: { url: string; name: string }[] = [];

      firstResultBatch.items.map((item: any) => {
        if (
          listaDeReproduccion.findIndex(
            (item2) =>
              item2.name ===
              item.title.replace(/[|()[\]{}<>+*?^$\\.,"`'/]/g, "")
          ) === -1
        ) {
          listaDeReproduccion.push({
            url: item.shortUrl,
            name: item.title.replace(/[|()[\]{}<>+*?^$\\.,"`'/]/g, ""),
          });
        } else {
          repetidas.push(item);
        }
      });

      console.log("repetidas:", repetidas.length);

      const fallidas: { url: string; name: string }[] = [];
      const correctas: { url: string; name: string }[] = [];
      const canciones: { name: string; file: any }[] = [];
      let completadas = 0;
      if (!fs.existsSync("averch")) {
        fs.mkdirSync("averch");
      }

      for (const { url, name } of listaDeReproduccion) {
        try {
          const info = await ytdl.getInfo(url);
          const archivoMP3 = ytdl.downloadFromInfo(info, {
            filter: "audioonly",
          });
          canciones.push({ name, file: archivoMP3 });
          const nombreMP3 = `averch/${name}.mp3`;

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
      return fallidas;
    };
    let data: any = [];
    await descargarMP3().then(async (d) => {
      data = d;
      await crearArchivoZIP("./averch", "canciones.zip")
        .then(() => {
          console.log("¡Archivo ZIP creado exitosamente y carpeta eliminada!");
        })
        .catch((error) => {
          console.error("Error al crear el archivo ZIP:", error);
        });
    });
    return data;
  } else {
    return "error en la extraccion de la url";
  }
}
