import { DiscordGatewayAdapterCreator, joinVoiceChannel } from "@discordjs/voice";
import { ChatInputCommandInteraction, PermissionsBitField, SlashCommandBuilder, TextChannel } from "discord.js";
import { bot } from "../index";

import { i18n } from "../utils/i18n";

import puppeteer from "puppeteer";





export default {
    data: new SlashCommandBuilder()
        .setName("chat")
        .setDescription(i18n.__("activity.description"))
        .addStringOption((option) => option.setName('input').setDescription('your question you want to ask').setRequired(true)),
    execute(interaction: ChatInputCommandInteraction) {
        let input = interaction.options.getString('input');
        response_chat_gpt(input + '').then((res) => {
            interaction.editReply(res + '');
        });
        return interaction.reply('⏳ Loading...');
    }
};


async function response_chat_gpt(str_input: string) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ["--start-maximized", "--disable-notifications"],
    });
    let pages = await browser.pages();

    const fb_page = await pages[0];

    console.log("start...");
    await fb_page.setDefaultNavigationTimeout(0);
    await fb_page.setViewport({ width: 1000, height: 500 });



    await fb_page.goto(
        "http://8.217.64.123:2002/chat/"
    );

    await sleep(1000);

    await fb_page.setExtraHTTPHeaders({
        "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
    });
    await fb_page.setJavaScriptEnabled(true);


    const input = await fb_page.$("#message-input");
    if (input) {
        console.log("input...");
        str_input = str_input + ', respone in one paragraph'
        await input.type(str_input);
        const btn_send = await fb_page.$('#send-button');
        if (btn_send) {
            console.log('waiting response...');
            btn_send.click();
            await sleep(10000)
            const p_tags = await fb_page.$$('p');
            let length = p_tags.length;
            const last_response = p_tags[length - 1];
            const str_last_response = await last_response.evaluate(el => el.textContent);
            console.log(str_last_response);
            return str_last_response;
        } else {
            return 'can not find button send';
        }
    } else {
        return 'can not find input';
    }
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
