/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const {
    BotkitConversation
} = require('botkit');

module.exports = function (controller) {

    const MY_DIALOG_ID = 'dialogo_quiero_cuenta';
    let convo = new BotkitConversation(MY_DIALOG_ID, controller);

    //Consultamos si quiere abrir una cuenta
    //dependiendo de la respuesta iniciamos el flujo
    convo.ask('Quieres abrir una cuenta?! \n 1 - SI \n 2 - No', async (response, convoDialog, bot, full_message) => {
        console.log(`El usuario quiere cuenta : ${ response }`);
        if (response === '1') {
            convo.addAction('si_cuenta');
            return await convoDialog.gotoThread('si_cuenta');
        }
        if (response === '2') {
            bot.say('Que lastima queriamos que formases parte de esta gran familia xBank!');
            convo.addAction('complete');
            return await convoDialog.stop();
        }
        await bot.say('No entiendo tu respuesta!');
        return await convoDialog.repeat();
    }, 'abrir_cuenta');

    //Flujo si_cuenta
    convo.addMessage('Genial, para la apertura de la cuenta solo necesitas tener a mano tu cedula, y algunos datos básicos, empecemos.', 'si_cuenta');
    convo.addQuestion('Cual es tu nombre?', async (response, convo, bot) => {
        console.log(`El nombre del cliente es :  ${ response }`);
    }, 'nombre', 'si_cuenta');

    convo.addQuestion('y tus apellidos?', async (response, convo, bot) => {
        console.log(`El apellido del cliente es : ${ response }`);
    }, 'apellido', 'si_cuenta');

    convo.addQuestion('{{vars.nombre}}, en que fecha naciste? favor responder en el siguiente formato (dia/mes/año) Ej: 05/08/1993', async (response, convo, bot) => {
        console.log(`Fecha de nacimiento del cliente : ${ response }`);
    }, 'fecha_nacimiento', 'si_cuenta');

    convo.addMessage('{{vars.nombre}}, estamos analizando los datos :)', 'si_cuenta');
    convo.addMessage('Genial en breve te llegará por sms tu número de cuenta en xBank, hasta pronto!!', 'si_cuenta');
    convo.addAction('complete');


    /*
        // go to a confirmation
        convo.addAction('confirmation', 'favorite_color');

        // do a simple conditional branch looking for user to say "no"
        convo.addQuestion('Your name is {{vars.name}} and your favorite color is {{vars.color}}. Is that right?', [{
                pattern: 'no',
                handler: async (response, convo, bot) => {
                    // if user says no, go back to favorite color.
                    await convo.gotoThread('favorite_color');
                }
            },
            {
                default: true,
                handler: async (response, convo, bot) => {
                    // do nothing, allow convo to complete.

                }
            }
        ], 'confirm', 'confirmation');
    */



    /*controller.on('message', async (bot, message) => {
        await bot.beginDialog('my-dialog');
    });*/

    controller.addDialog(convo);

    //Mensaje de Bienvenida y Inicio de Flujo
    controller.on('conversationUpdate', async (bot, message) => {
        await bot.reply(message, `Bienvenido xBank tu banco digital, tenemos una cuenta gratis para vos, sin costo de mantenimiento y con muchos beneficios`);
        await bot.beginDialog('dialogo_quiero_cuenta');
    });

}