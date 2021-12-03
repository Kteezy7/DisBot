const { Events } = require("../validation/eventNames");

module.exports = async (client, PG, Ascii) => {
    const table = new Ascii("Events Loaded");

    (await PG(`${process.cwd()}/events/*/*.js`)).map(async (file) => {
        const event = require(file);

        if (event.name) {
            if (!Events.includes(event.name))
                return table.addRow(
                    file.split("/")[7],
                    "🔸 FAILED",
                    "Event name is missing."
                );
        }

        if (event.once) {
            client.once(event.name, (...args) =>
                event.execute(...args, client)
            );
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        }
        console.log(event.name);
        await table.addRow(event.name, "Successful");
    });

    console.log(table.toString());
};
