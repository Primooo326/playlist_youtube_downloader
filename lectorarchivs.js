const fs = require('fs')


const leerCarpeta = (rutaCarpeta) => {
    // Lee los archivos/carpetas dentro de la carpeta dada.
    const archivos = fs.readdirSync(rutaCarpeta);
    // Regresamos un arreglo con los nombres de los archivos.
    return archivos;
}

console.log(leerCarpeta("../ideasparacocinas/src/cocinasintegrales/cocinas"));