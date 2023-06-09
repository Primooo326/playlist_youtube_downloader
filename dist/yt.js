"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ytdl_core_1 = __importDefault(require("ytdl-core"));
const ytpl_1 = __importDefault(require("ytpl"));
const jszip_1 = __importDefault(require("jszip"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const util_1 = require("util");
function yt(pathYt) {
    return __awaiter(this, void 0, void 0, function* () {
        const regex = /list=([^&]+)/;
        const match = pathYt.match(regex);
        const playlistId = match ? match[1] : null;
        if (playlistId) {
            let contador = 0;
            const mostrarLoader = (listaDeReproduccionLen, actual) => {
                contador++;
                const progreso = contador / listaDeReproduccionLen;
                const porcentaje = Math.floor(progreso * 100);
                process.stdout.clearLine(0);
                process.stdout.cursorTo(0);
                process.stdout.write(`Descargando: ${contador}. ${actual}`);
                process.stdout.write(`\nPorcentaje: ${porcentaje}% ${contador}/${listaDeReproduccionLen}`);
            };
            const crearArchivoZIP = (rutaCarpeta, nombreArchivoZIP) => __awaiter(this, void 0, void 0, function* () {
                const zip = new jszip_1.default();
                const agregarArchivosRecursivamente = (ruta, carpetaZip) => __awaiter(this, void 0, void 0, function* () {
                    const archivos = yield (0, util_1.promisify)(fs_1.default.readdir)(ruta);
                    for (const archivo of archivos) {
                        const rutaArchivo = path_1.default.join(ruta, archivo);
                        const estadisticasArchivo = yield (0, util_1.promisify)(fs_1.default.stat)(rutaArchivo);
                        if (estadisticasArchivo.isFile()) {
                            const contenidoArchivo = yield (0, util_1.promisify)(fs_1.default.readFile)(rutaArchivo);
                            carpetaZip.file(archivo, contenidoArchivo);
                        }
                        else if (estadisticasArchivo.isDirectory()) {
                            const subcarpetaZip = carpetaZip.folder(archivo);
                            yield agregarArchivosRecursivamente(rutaArchivo, subcarpetaZip);
                        }
                    }
                });
                yield agregarArchivosRecursivamente(rutaCarpeta, zip);
                const contenidoZIP = yield zip.generateAsync({ type: "nodebuffer" });
                yield (0, util_1.promisify)(fs_1.default.writeFile)(nombreArchivoZIP, contenidoZIP);
                yield (0, util_1.promisify)(fs_1.default.rmdir)(rutaCarpeta, { recursive: true });
            });
            const descargarMP3 = () => __awaiter(this, void 0, void 0, function* () {
                // rome-ignore lint/suspicious/noExplicitAny: <explanation>
                const repetidas = [];
                const firstResultBatch = yield (0, ytpl_1.default)(playlistId, {
                    pages: 1000,
                });
                const listaDeReproduccion = [];
                // rome-ignore lint/suspicious/noExplicitAny: <explanation>
                firstResultBatch.items.map((item) => {
                    if (listaDeReproduccion.findIndex((item2) => item2.name === item.title) === -1) {
                        listaDeReproduccion.push({ url: item.shortUrl, name: item.title });
                    }
                    else {
                        repetidas.push(item);
                    }
                });
                console.log("repetidas:", repetidas.length);
                const fallidas = [];
                const correctas = [];
                // rome-ignore lint/suspicious/noExplicitAny: <explanation>
                const canciones = [];
                let completadas = 0;
                if (!fs_1.default.existsSync("averch")) {
                    fs_1.default.mkdirSync("averch");
                }
                for (const { url, name } of listaDeReproduccion) {
                    try {
                        const info = yield ytdl_core_1.default.getInfo(url);
                        const archivoMP3 = ytdl_core_1.default.downloadFromInfo(info, {
                            filter: "audioonly",
                        });
                        canciones.push({ name, file: archivoMP3 });
                        const nombreMP3 = `averch/${info.videoDetails.title}.mp3`;
                        archivoMP3
                            .pipe(fs_1.default.createWriteStream(nombreMP3))
                            .on("error", (error) => {
                            fallidas.push({ url, name });
                        });
                        if (fallidas.findIndex((i) => i.url === url) !== -1) {
                            correctas.push({ url, name });
                        }
                        completadas++;
                        mostrarLoader(listaDeReproduccion.length, listaDeReproduccion[completadas].name);
                    }
                    catch (error) {
                        console.log(`error: ${error}`);
                    }
                }
                return fallidas;
            });
            yield descargarMP3().then(() => __awaiter(this, void 0, void 0, function* () {
                yield crearArchivoZIP("./averch", "canciones.zip")
                    .then(() => {
                    console.log("¡Archivo ZIP creado exitosamente y carpeta eliminada!");
                })
                    .catch((error) => {
                    console.error("Error al crear el archivo ZIP:", error);
                });
            }));
            return [];
        }
        else {
            return "error en la extraccion de la url";
        }
    });
}
exports.default = yt;
