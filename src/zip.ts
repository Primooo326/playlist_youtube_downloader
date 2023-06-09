import JSZip from "jszip";
import fs from "fs";
import path from "path";
import { promisify } from "util";

const crearArchivoZIP = async (
  rutaCarpeta: string,
  nombreArchivoZIP: string
) => {
  const zip = new JSZip();

  const agregarArchivosRecursivamente = async (ruta: any, carpetaZip: any) => {
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

export default crearArchivoZIP;
