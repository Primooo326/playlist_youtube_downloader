const ytdl = require('ytdl-core');
const fs = require('fs');

const listaDeReproduccion = ['https://www.youtube.com/watch?v=Udxl17LVHYA', 'https://www.youtube.com/watch?v=lH3d69sbvX4', 'https://www.youtube.com/watch?v=66zDhaiUVQ4', 'https://www.youtube.com/watch?v=EDecJQxAjDk', 'https://www.youtube.com/watch?v=10EX-_h4pYc', 'https://www.youtube.com/watch?v=p38WgakuYDo', 'https://www.youtube.com/watch?v=krhh4Jmiru8'];

async function descargarMP3() {

    if (!fs.existsSync("averch")) {
        fs.mkdirSync("averch");
    }
    let count = 0
    const listaPromises = listaDeReproduccion.map(async URL => {
        const info = await ytdl.getInfo(URL);
        const archivoMP3 = ytdl.downloadFromInfo(info, {
            filter: 'audioonly'
        });

        const nombreMP3 = `averch/${count}.mp3`;

        archivoMP3.pipe(fs.createWriteStream(nombreMP3));

        count++
        return new Promise((resolve, reject) => {
            archivoMP3.on('finish', () => resolve(nombreMP3));
            archivoMP3.on('error', reject);
        });
    });

    for (const promesa of listaPromises) {
        console.log(await promesa);
    }
}

descargarMP3();