
const ytdl = require('ytdl-core');
const ytpl = require('ytpl');

const fs = require('fs');


async function descargarMP3() {
    const firstResultBatch = await ytpl('PLbJr1Hz1efqQLiG96yDtiZJkG7YGf8X-K');
    const listaDeReproduccion = firstResultBatch.items.map(item => {
        return item.shortUrl
    })

    listaDeReproduccion.forEach(async URL => {

        try {
            const info = await ytdl.getInfo(URL);
            const archivoMP3 = ytdl.downloadFromInfo(info, {
                filter: 'audioonly'
            });

            const nombreMP3 = `canciones/${info.videoDetails.title}.mp3`;

            console.log(nombreMP3);
            // archivoMP3.pipe(fs.createWriteStream(nombreMP3))
            archivoMP3.pipe(fs.createWriteStream(nombreMP3)).on('error', (error) => {
                console.log(`Ha habido un error en la canción ${nombreMP3}`);
                console.log(`Cancion no descargada`);
            });

            return nombreMP3;
        } catch (error) {
            console.log("error::", error);
            return null;
        }



    });


    // const listaMP3 = await Promise.all(listaPromises);

    // //Mostrar resultados

    // console.log('Descarga completa de la lista de reproducción');
    // listaMP3.forEach(mp3 => console.log(mp3));

}

descargarMP3();