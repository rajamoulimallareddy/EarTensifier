module.exports = async (client, message, msg, player, searchQuery, playlist) => {
	async function load(search) {
		const res = await client.music.search(search, message.author);
		if (res.loadType == 'PLAYLIST_LOADED') {
			for (const track of res.tracks) {
				player.queue.add(track);
				if (!player.playing && !player.paused && !player.queue.length) player.play();
			}
			msg.edit({
				content: ' ', embeds: [client.queuedEmbed(
					res.playlist.name,
					searchQuery,
					res.tracks.reduce((acc, cure) => ({
						duration: acc.duration + cure.duration,
					})).duration,
					res.tracks.length,
					res.tracks[0].requester.id,
				)],
			});
		}
		else if (res.loadType !== 'NO_MATCHES' && res.loadType !== 'LOAD_FAILED' && res.tracks.length > 0) {
			if (res.loadType == 'TRACK_LOADED' || res.loadType == 'SEARCH_RESULT') {
				player.queue.add(res.tracks[0]);
				if (!playlist && msg) msg.edit({
					content: ' ', embeds: [client.queuedEmbed(
						res.tracks[0].title,
						res.tracks[0].uri,
						res.tracks[0].duration,
						null,
						res.tracks[0].requester,
					)],
				});
				if (!player.playing && !player.paused && !player.queue.length) player.play();
			}
			return;
		}
		else return msg.edit('No results found.');
	}
	return load(searchQuery);
};

