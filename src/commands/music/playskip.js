const Command = require('../../structures/Command');

const play = require('../../player/loadTracks.js');
const spawnPlayer = require('../../player/spawnPlayer.js');

module.exports = class Playskip extends Command {
	constructor(client) {
		super(client, {
			name: 'playskip',
			description: 'Skips the current playing song and immediately plays the song provided.',
			args: true,
			usage: '<search query>',
			cooldown: '4',
			inVoiceChannel: true,
			sameVoiceChannel: true,
			player: true,
		});
	}
	async run(client, message, args) {
		let player = client.music.players.get(message.guild.id);
		if (!player) player = await spawnPlayer(client, message);

		const msg = await message.channel.send(`${client.emojiList.cd}  Searching for \`${args.join(' ')}\`...`);

		let searchQuery;
		searchQuery = args.join(' ');
		if (['youtube', 'soundcloud', 'bandcamp', 'twitch'].includes(args[0].toLowerCase())) {
			if (args[0].toLowerCase().includes('soundcloud')) return message.channel.send("Soundcloud has been temporarily disabled.")
			searchQuery = {
				source: args[0],
				query: args.slice(1).join(' '),
			};
		}
		play(client, message, msg, player, searchQuery, false).then(await playskip());


		async function playskip() {
			const delay = ms => new Promise(res => setTimeout(res, ms));
			await delay(1500);
			player.queue.splice(0, 0, player.queue[player.queue.length - 1]);
			await delay(500);
			player.queue.pop();
			if (player.trackRepeat) player.setTrackRepeat(false);
			if (player.queueRepeat) player.setQueueRepeat(false);
			player.stop();
		}
	}
};