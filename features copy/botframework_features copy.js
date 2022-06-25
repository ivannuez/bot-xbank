/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

module.exports = function (controller) {

    // send welcome
    controller.on('conversationUpdate', async (bot, message) => {
        await bot.reply(message, `Welcome xBank`);
    });

}