const ytdl = require('ytdl-core');
const fs = require('fs'); 

const listaDeReproduccion = 'https://www.youtube.com/playlist?list=PLbJr1Hz1efqQLiG96yDtiZJkG7YGf8X-K';
 
//Crear una función asíncrona para obtener la lista de vídeos

async function obtenerListaDeVideosDeListaDeReproduccion() {

  //Crear una lista temporal para las URLs 
  let listaVideosURL = []; 
  
  let paginaActual = '';
  let hayPaginasSiguientes = true;

  //Mientras haya páginas siguientes, obtiene los vídeos
  while (hayPaginasSiguientes) {

    //La primera vez, la URL será la de la lista de reproduccion
    let URL;
    if (paginaActual) {
        URL = paginaActual;
    } else {
        URL = listaDeReproduccion;
    }
   
    //Recuperar los vídeos de la página
    const { videos, proximaPaginaURL } = await ytdl.getInfo(URL)
    listaVideosURL.push(...videos);

    //Verificar si hay páginas siguientes
    if (proximaPaginaURL) {
        paginaActual = proximaPaginaURL;
    } else {
        hayPaginasSiguientes = false;
    }
  }
  return listaVideosURL;
}
  
//Crear una función para descargar las canciones
async function descargarMP3() {
  const listaVideosURL = await obtenerListaDeVideosDeListaDeReproduccion();

  const listaPromise = listaVideosURL.map(async URL => {
    const info = await ytdl.getInfo(URL);
    const archivoMP3 = ytdl.downloadFromInfo(info, {
        filter: 'audioonly' 
    });
    
    const nombreMP3 = `canciones/${info.videoDetails.title}.mp3`;
      

    archivoMP3.pipe(fs.createWriteStream(nombreMP3));

    return new Promise ((resolve, reject) => {
        archivoMP3.on('end', ()=> {
            resolve(nombreMP3);
        });

        archivoMP3.on('error', error => {
            reject(error);
        });
    });
  });

  const listaMP3 = await Promise.all(listaPromise);

  //Mostrar resultados
  console.log('Descarga completa de la lista de reproducción');
  listaMP3.forEach(mp3 => console.log(mp3));

}

descargarMP3();