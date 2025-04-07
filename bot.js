const { Client, GatewayIntentBits, Collection, SlashCommandBuilder } = require("discord.js");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const config = require("./config.json");
const fs = require("fs");

const bot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

bot.commands = new Collection();

fs.readdir("./commands/", (err, files) => {
    if (err) console.log(err);

    let jsfile = files.filter(f => f.split(".").pop() === "js");
    if (jsfile.length <= 0) {
        console.log("No commands were found?");
        return;
    }

    jsfile.forEach((f) => {
        let props = require(`./commands/${f}`);
        console.log(`${f} INIT!`);
        bot.commands.set(props.help.name, props);
    });
});

const commands = [
    new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!'),
    new SlashCommandBuilder().setName('activity').setDescription('Shows bot activity'),
].map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(config.token);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(Routes.applicationCommands(config.clientId), { body: commands });
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();

bot.on("ready", () => {
    console.log(`${bot.user.username} active!`);
    bot.user.setActivity("Prefix is '!'", { type: "PLAYING" });
});

bot.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    const commandFile = bot.commands.get(commandName);
    if (commandFile) {
        try {
            await commandFile.run(bot, interaction); 
        } catch (error) {
            console.error(error);
            await interaction.reply('There was an error while executing this command!');
        }
    }
});


bot.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;

    let prefix = config.prefix;
    let messageArr = message.content.split(" ");
    let cmd = messageArr[0];
    let args = messageArr.slice(1);

    if (!cmd.startsWith(prefix)) return;

    let commandName = cmd.slice(prefix.length);
    let commandfile = bot.commands.get(commandName);

    if (commandfile) commandfile.run(bot, message, args);
});

bot.login(config.token);

