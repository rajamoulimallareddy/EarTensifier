const Discord = require("discord.js");
const emojis = require("../data/emojis.json");
const colors = require("../data/colors.json");
const { Utils } = require("erela.js");

module.exports = {
    name: "leave",
    description: "Plays a song",
    aliases: ["disconnect"],
    cooldown: "10",
    async execute(client, message, args) {
        const voiceChannel = message.member.voice.channel;
        const player = client.music.players.get(message.guild.id);

        if(!voiceChannel) return message.channel.send("You need to be in a voice channel to use this command");
        if(voiceChannel != message.guild.members.get(client.user.id).voice.channel) return message.channel.send("You are not in the same voice channel as the bot.");


        if(player) client.music.players.destroy(message.guild.id);
        return message.channel.send(`Left ${emojis.voice}**${voiceChannel}**`)
    }
}