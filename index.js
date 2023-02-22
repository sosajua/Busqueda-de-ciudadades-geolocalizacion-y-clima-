require('dotenv').config()


const {leerInput, inquireMenu, pausa,listarLugares} = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas');
// console.log(process.env.MAPBOX_KEY)
const main = async() =>{
    let opt;
    const busquedas = new Busquedas();



    do{
        opt = await inquireMenu();
        
        switch (opt) {
            case 1:
                //mostrar mensaje
                const termino = await leerInput('Ciudad: ');
                
                //Buscar lugares
                const lugares = await busquedas.ciudad(termino);
                
                //Selecionar lugar
                const idSelec = await listarLugares(lugares);

                if(idSelec==='0')continue;

                //guardar en DB

                const lugarSelc = lugares.find( lug => lug.id === idSelec)
                // console.log(lugarSelc)
                
                busquedas.agregarHistorial(lugarSelc.nombre)
                
                
                //clima
                const clima = await busquedas.climaLugar(lugarSelc.lat, lugarSelc.lng)
                // console.log(clima)


                //Mostrar resultados
                console.clear()
                console.log('\n Informacion de la ciudad \n'.green)
                console.log('Ciudad: ', lugarSelc.nombre);
                console.log('lat: ',lugarSelc.lat);
                console.log('long ',lugarSelc.lng);
                console.log('Temperatura ', clima.temp);
                console.log('Minima ', clima.min);
                console.log('maxima ', clima.max);
                console.log('El estado del clima es: ', clima.desc.blue);

            break; 

            case 2:
                busquedas.historialCapitalizado.forEach((lugar, i) =>{
                    const idx = `${i +1 }.`.green;
                    console.log(`${idx} ${lugar}`)
                })
            break;

        
        }
    
    
    
    
    
        // console.log({opt});
    
    
    
    
        if(opt!== 0) await pausa();
    }while(opt !=0)
}

main();