const axios = require('axios');
const fs = require('fs');


class Busquedas{

    historial = []
    dbPath ='./db/database.json'

    constructor(){
        this.leertDB()
    }

    get historialCapitalizado(){
        return this.historial.map(lugar =>{
            let palabras = lugar.split(' ')
            palabras = palabras.map(p=>p[0].toUpperCase() + p.substring(1))
            return palabras.join(' ')
        })
    }

    get paramsMapbox(){
        return {
            'limit':6,
            'language':'es',
            'access_token': process.env.MAPBOX_KEY
        
        }
    }

    get paramsWeather(){
        return{
            appid: process.env.OPENWEATHER_KEY,
            units: 'metric',
            lang:'es'
        }
    }

    async ciudad(lugar=''){
        // console.log("ciudad: ", lugar);

        const instance = axios.create({
            baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
            params:this.paramsMapbox,
        
        
        });


        try {
            // const resp = await axios.get('https://api.mapbox.com/geocoding/v5/mapbox.places/madrid.json?limit=5&language=es&access_token=pk.eyJ1Ijoic29zYWp1YW5kYXZpZCIsImEiOiJjbGRqaWt0eHIwMHNzM3BsN2FoYTZzaW5oIn0.Iq8lqT8e2_zS_AXIF7iX0Q')
            const resp = await instance.get()

            return resp.data.features.map(lugar=>({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]

            }));
                
        } catch (error) {
            return [];            
        }
    }

    async climaLugar(lat, lon){
        try {
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {...this.paramsWeather, lat, lon},
        
            });

            const resp = await instance.get();
            const {weather, main} =  resp.data;
            return    {
                desc:weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp, 
            }
        } catch (error) {
            console.log(error)
        }
    }

    agregarHistorial(lugar=''){
        if(this.historial.includes(lugar.toLocaleLowerCase())){
            return
        }

        this.historial.unshift(lugar.toLocaleLowerCase())
        this.guardarDB();
    }

    guardarDB(){
        const payload = {
            historial : this.historial
        }
        fs.writeFileSync(this.dbPath, JSON.stringify(payload))
    }

    leertDB(){
        if(!fs.existsSync(this.dbPath)) return

        const info = fs.readFileSync(this.dbPath, {encoding:'utf-8'})
        const data = JSON.parse(info)
        this.historial =data.historial;
    }
}

module.exports= Busquedas;