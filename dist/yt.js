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
const fs_1 = __importDefault(require("fs"));
function yt(urlPlayList) {
    return __awaiter(this, void 0, void 0, function* () {
        let contador = 0;
        const mostrarLoader = (listaDeReproduccionLen, correctas, fallidas, actual) => {
            contador++;
            const progreso = contador / listaDeReproduccionLen;
            const porcentaje = Math.floor(progreso * 100);
            process.stdout.clearLine(0);
            process.stdout.cursorTo(0);
            process.stdout.write(`Descargando: ${contador}. ${actual}`);
            process.stdout.write(`\nPorcentaje: ${porcentaje}% ${correctas + fallidas}/${listaDeReproduccionLen}`);
        };
        const descargarMP3 = () => __awaiter(this, void 0, void 0, function* () {
            const repetidas = [];
            const firstResultBatch = yield (0, ytpl_1.default)(urlPlayList, {
                pages: 1000,
            });
            const listaDeReproduccion = [];
            firstResultBatch.items.map((item) => {
                if (listaDeReproduccion.findIndex((item2) => item2.name === item.title) ==
                    -1) {
                    listaDeReproduccion.push({ url: item.shortUrl, name: item.title });
                }
                else {
                    repetidas.push(item);
                }
            });
            console.log("repetidas:", repetidas.length);
            const fallidas = [];
            const correctas = [];
            let completadas = 0;
            var loaderInterval = mostrarLoader(listaDeReproduccion.length, correctas.length, fallidas.length, listaDeReproduccion[completadas].name);
            for (const { url, name } of listaDeReproduccion) {
                try {
                    const info = yield ytdl_core_1.default.getInfo(url);
                    const archivoMP3 = ytdl_core_1.default.downloadFromInfo(info, {
                        filter: "audioonly",
                    });
                    const nombreMP3 = `aver/${info.videoDetails.title}.mp3`;
                    archivoMP3
                        .pipe(fs_1.default.createWriteStream(nombreMP3))
                        .on("error", (error) => {
                        fallidas.push(info.videoDetails.video_url);
                    });
                    if (!fallidas.includes(info.videoDetails.video_url)) {
                        correctas.push(info.videoDetails.video_url);
                    }
                    completadas++;
                    mostrarLoader(listaDeReproduccion.length, correctas.length, fallidas.length, listaDeReproduccion[completadas].name);
                }
                catch (error) {
                    console.log("error: " + error);
                }
            }
            console.log("\n¡Descarga de MP3 completada!"); // Imprimir mensaje de descarga completada
            console.log(fallidas);
            return fallidas;
        });
        console.log("breve");
        return yield descargarMP3();
    });
}
exports.default = yt;
