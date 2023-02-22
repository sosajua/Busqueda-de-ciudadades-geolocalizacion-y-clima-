const inquirer = require('inquirer');
// const Tareas = require('../models/tareas');

require('colors');



const preguntas =[
    {
        type: 'list',
        name:'option',
        message:'¿Que desea hacer?',
        choices: [
            {
                value: 1,
                name: `${'1.'.blue} Buscar ciudad`
            },
            {
                value: 2,
                name: `${'2.'.blue} Historial`
            },
            {
                value: 0,
                name: `${'0.'.blue} Salir`
            },
        ]
    }
]

const inquireMenu = async()=>{
    console.clear();
    console.log('======================='.green);
    console.log('Seleccione una opcion'.white);
    console.log('=======================\n'.green);

    const {option} = await inquirer.prompt(preguntas);

    return option;
}

const pausa = async()=>{
    const question={
        type: 'input',
        name:'enter',
        message:`Presione ${'Enter'.green} para continuar `
    }
    await inquirer.prompt(question);
}

const leerInput = async(message)=>{
    const question={
        type:'input',
        name:'desc',
        message, validate(value){
            if(value.length===0){
                return 'Por favor ingreseun nu numero'
            }
            return true;
        }
    };

    const {desc} = await inquirer.prompt(question);
    return desc;
}

const listarLugares = async(lugares=[])=>{
    const choices = lugares.map((lugar,i) =>{
    const idx = `${i+1}.`.green    
        return{
            value: lugar.id,
            name:`${idx} ${lugar.nombre}`
        }
    });

    choices.unshift({
        value:'0',
        name:'0.'.green + 'Cancelar'
    })

    const preguntas =[
        {
            type:'list',
            name:'id',
            message:'seleccione lugar:',
            choices
        }
    ]

    const {id} = await inquirer.prompt(preguntas);
    return id;
}


const mostrarTareaCheckList = async(tareas=[])=>{
    const choices = tareas.map((tarea,i) =>{
    const idx = `${i+1}.`.green    
        return{
            value: tarea.id,
            name:`${idx} ${tarea.desc}`,
            checked: (tarea.compleadoEn) ?true :false,
        }
    });


    const pregunta =[
        {
            type:'checkbox',
            name:'ids',
            message:'Selecciones',
            choices
        }
    ]

    const {ids} = await inquirer.prompt(pregunta);
    return ids;
}

const confirmarBorarr = async(message)=>{
    const question=[
        {
            type:'confirm',
            name: 'ok',
            message
        }
    ];
    const {ok} = await inquirer.prompt(question);
    return ok;
}
module.exports={
    inquireMenu,
    pausa,
    leerInput,
    listarLugares,
    confirmarBorarr,
    mostrarTareaCheckList
}