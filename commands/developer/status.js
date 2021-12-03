const { CommandInteraction, Client, MessageEmbed } = require("discord.js");
const { connection } = require("mongoose");
require("../../events/client/ready");

module.exports = {
    name: "status",
    description: "Displays the status of the client and database connection",
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */

    async execute(interaction, client) {
        const Response = new MessageEmbed().setColor("AQUA")
            .setDescription(`**Client**: \` 🟢 ONLINE\` - \`${
            client.ws.ping
        }ms\`\n **Uptime**: <t:${parseInt(client.readyTimestamp / 1000)}:R>\n
        **Database**: \`${switchTo(connection.readyState)}\``);

        interaction.reply({ embeds: [Response] });
    },
};

//func to change ready states
//0:disconnected, 1:connected, 2:connecting, 3:disconnecting
function switchTo(val) {
    var status = " ";
    switch (val) {
        case 0:
            status = `🔴 DISCONNECTED`;
            break;
        case 1:
            status = `🟢 CONNECTED`;
            break;
        case 2:
            status = `🟡 CONNECTING`;
            break;
        case 3:
            status = `🟠 DISCONNECTING`;
            break;
    }
    return status;
}
