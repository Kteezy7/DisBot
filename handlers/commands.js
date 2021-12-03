const { Perms } = require("../validation/permissions");
const { Client } = require("discord.js");

/**
 * @param {Client} client
 */

module.exports = async (client, PG, Ascii) => {
    const table = new Ascii("Command Loaded");

    CommandsArray = [];

    (await PG(`${process.cwd()}/commands/*/*.js`)).map(async (file) => {
        const command = require(file);

        if (!command.name)
            return table.addRow(
                file.split("/")[8],
                "FAILED",
                "Missing a name."
            );

        if (!command.type && !command.description)
            return table.addRow(
                command.name,
                " FAILED",
                "Missing a description."
            );

        if (command.permission) {
            if (Perms.includes(command.permission))
                command.defaultPermission = false;
            else
                return table.addRow(
                    command.name,
                    " FAILED",
                    "Permission is invalid"
                );
        }

        client.commands.set(command.name, command);
        CommandsArray.push(command);

        await table.addRow(command.name, "Successful");
    });
    console.log(table.toString());

    // Permissions check

    client.on("ready", async () => {
        const MainGuild = await client.guilds.cache.get("857503765253980170");

        MainGuild.commands.set(CommandsArray).then(async (command) => {
            const Roles = (commandName) => {
                const cmdPerms = CommandsArray.find(
                    (c) => c.name === commandName
                ).permission;
                if (!cmdPerms) return null;

                return MainGuild.roles.cache.filter((r) =>
                    r.permissions.has(cmdPerms)
                );
            };

            const fullPermissions = command.reduce((accumulator, r) => {
                const roles = Roles(r.name);
                if (!roles) return accumulator;

                const permissions = roles.reduce((a, r) => {
                    return [...a, { id: r.id, type: "ROLE", permission: true }];
                }, []);
                return [...accumulator, { id: r.id, permissions }];
            }, []);
            await MainGuild.commands.permissions.set({ fullPermissions });
        });
    });
};
