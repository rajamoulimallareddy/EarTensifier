const Command = require('../../structures/Command');

const { MessageEmbed } = require('discord.js'); // destructor MessageEmbed from discord.js

class Lavalink extends Command {
    constructor(client) {
        super(client, {
            name: 'lavalink',
            description: 'Displays the bot\'s lavalink stats',
            usage: '',
            enabled: true,
            cooldown: 5,
            args: false,
        });
    }

    async run(client, message) {.
        // changed message, as "Stats" could be anything
        const msg = await message.channel.send(`${client.emojiList.loading} Getting lavalink stats...`);

        // we can destructor a bunch of thigns
        const { 
            memory, 
            cpu, 
            uptime, 
            frameStats,
            playingPlayers,
            players,
        } = client.music.nodes.first().stats; // ErelaClient#nodes returns a Collection<number, Node>, therefore we can use Collection#first();

        const allocated = Math.floor(memory.allocated / 1024 / 1024);
        const used = Math.floor(memory.used / 1024 / 1024);
        const free = Math.floor(memory.free / 1024 / 1024);
        const reservable = Math.floor(memory.reservable / 1024 / 1024);

        const systemLoad = (cpu.systemLoad * 100).toFixed(2);
        const lavalinkLoad = (cpu.lavalinkLoad * 100).toFixed(2);
        
        // get the uptime using a better method
        const uptime = this.uptime(uptime);

        const embed = new MessageEmbed() // change var to embed
            .setAuthor('Lavalink Statistics')
            .setColor(client.colors.main)
            .setThumbnail(client.settings.avatar)
            .addField('Playing Players/Players', `\`\`\`${playingPlayers} playing / ${players} players\`\`\``)
            .addField('Memory', `\`\`\`Allocated: ${allocated} MB\nUsed: ${used} MB\nFree: ${free} MB\nReservable: ${reservable} MB\`\`\``)
            .addField('CPU', `\`\`\`Cores: ${cpu.cores}\nSystem Load: ${systemLoad}%\nLavalink Load: ${lavalinkLoad}%\`\`\``)
            .addField('Uptime', `\`\`\`${uptime}\`\`\``)
            .setTimestamp(Date.now());

        if (frameStats) { // from the old code, "typeof stats.frameStats != 'undefined'" was completely uneeded.
            const { sent, deficit, nulled } = frameStats;
            embed.addField('Frame Stats', `\`\`\`Sent: ${sent}\nDeficit: ${deficit}\nNulled: ${nulled}\`\`\``);
        }

        return msg.edit('', embed);
    }

    uptime(time) {
        const calculations = {
            week: Math.floor(time / (1000 * 60 * 60 * 24 * 7)),
            day: Math.floor(time / (1000 * 60 * 60 * 24)),
            hour: Math.floor((time / (1000 * 60 * 60)) % 24),
            minute: Math.floor((time / (1000 * 60)) % 60),
            second: Math.floor((time / 1000) % 60),
        }

        let str = ``;

        for (const [key, val] of Object.entries(calculations)) {
            if (val > 0) str += `${val} ${key}${val > 1 ? "s" : ""} `
        }

        return str;
    }
}

module.exports = Lavalink;
