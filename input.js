const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Ingrese su entrada: ', (respuesta) => {
    console.log(`Usted ingresó: ${respuesta}`);

    // Aquí puedes realizar cualquier otra operación con la entrada del usuario

    rl.close();
});
