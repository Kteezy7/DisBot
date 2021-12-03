const { Client, Collection } = require("discord.js");
const client = new Client({ intents: 32767 });
const { Token } = require("./config.json");

const { promisify } = require("util");
const { glob } = require("glob");
const PG = promisify(glob);
const Ascii = require("ascii-table");

client.commands = new Collection();

const { Distube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");

// client.distube = new Distube(client, {
//     emitNewSongOnly: true,
//     leaveOnFinish: true,
//     emitAddSongWhenCreatingQueue: false,
//     plugins: [new SpotifyPlugin()]
// });
// module.exports = client;

["events", "commands"].forEach((handler) => {
    require(`./handlers/${handler}`)(client, PG, Ascii);
});
// require("./handlers/events")(client);
// require("./handlers/commands")(client);

client.login(Token);
