import { DiscordGatewayAdapterCreator, joinVoiceChannel } from "@discordjs/voice";
import { ChatInputCommandInteraction, PermissionsBitField, SlashCommandBuilder, TextChannel } from "discord.js";
import { bot } from "../index";
import { i18n } from "../utils/i18n";

import { config } from "../utils/config"


export default {
    data: new SlashCommandBuilder()
        .setName("chat")
        .setDescription(i18n.__("chat.description"))
        .addStringOption((option) =>
            option.setName('input').setDescription(i18n.__('optionDescription')).setRequired(true)),
    execute(interaction: ChatInputCommandInteraction) {
        let prompt = interaction.options.getString('input');
        if (prompt) {
            let formData = new FormData();
            formData.append('prompt', prompt);
            fetch(config.URL, {
                body: formData,
                method: 'post'
            }).then(async response => {
                const text = await response.text();
                interaction.editReply(text);
            });
        } else {
            interaction.reply('Something was wrong...');
        }
        return interaction.reply('⏳ Waiting...');
    }
};


async function response_chat_gpt(prompt: string) {
    let formData = new FormData();
    formData.append('prompt', prompt);
    fetch('http://8.217.64.123/gpt', {
        body: formData,
        method: 'post'
    }).then(async response => {
        return await response.text();
    })
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
