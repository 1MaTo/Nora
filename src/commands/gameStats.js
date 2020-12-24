const { dbErrors, gameStatsCommands } = require("../strings/logsMessages");
const { fbtSettings } = require("../../config.json");
const { logError, autodeleteMsg, checkValidChannel } = require("../utils");
const { statsCollectors } = require("../bot");
const { getFinishedGamesCount, getFinishedGamesId, getGamesDataByIds, saveMapStats } = require("../db/db");
const { gameStatsPoll } = require("../strings/embeds");

module.exports = {
    name: "gameStats",
    args: 0,
    aliases: ["gs"],
    usage: "<channel> | stop",
    description:
        "Command to enable/disable game stats collecting.\nIf no arguments provided, channel will be the one you tiped command",
    guildOnly: true,
    development: false,
    adminOnly: true,
    run: async (message, args) => {
        if (args[0] === "stop") {
            statsCollectors.delete(message.guild.id);
            return autodeleteMsg(message, gameStatsCommands.disabled);
        }

        if (statsCollectors.has(message.guild.id)) return autodeleteMsg(message, gameStatsCommands.alreadyEnabled);

        const channel = checkValidChannel(args[0], message);
        const newCollectorOptions = {
            channel,
            delay: 1000,
            currGameCount: await getFinishedGamesCount(),
        };
        statsCollectors.set(message.guild.id, newCollectorOptions);
        autodeleteMsg(message, gameStatsCommands.enabled);
        console.log(newCollectorOptions.currGameCount);
        setTimeout(() => checkNewFinishedGames(channel), newCollectorOptions.delay);
    },
};

const checkNewFinishedGames = async channel => {
    const options = statsCollectors.get(channel.guild.id);

    if (!options) return autodeleteMsg({ channel }, gameStatsCommands.disabled);

    const gamesId = await getFinishedGamesId();

    if (gamesId === null) setTimeout(() => checkNewFinishedGames(channel), options.delay);

    const newGamesCount = Number(gamesId.length) - Number(options.currGameCount);
    console.log(newGamesCount);
    if (newGamesCount) {
        options.currGameCount = gamesId.length;
        statsCollectors.set(options);
        startPolls(gamesId.splice(-newGamesCount), channel);
    }

    setTimeout(() => checkNewFinishedGames(channel), options.delay);
};

const startPolls = async (gamesId, channel) => {
    const gamesData = await getGamesDataByIds(gamesId, channel.guild.id);
    gamesData.forEach(game => {
        startGameCollector(game, channel);
    });
};

const startGameCollector = async (gameData, channel) => {
    const deleteDelay = 1000 * 60 * 5;
    channel.send(gameStatsCommands.gameEnded(deleteDelay)).then(firstMsg => {
        firstMsg.channel.send({ embed: gameStatsPoll(gameData) }).then(gameMsg => {
            const indexToEmoji = ["1⃣", "2⃣", "3⃣", "4⃣", "5⃣", "6⃣"];
            const currReaction = [];
            try {
                const addReactions = gameData.players.map(async (team, index) => {
                    currReaction.push(indexToEmoji[index]);
                    await gameMsg.react(indexToEmoji[index]);
                });
                const reactions = Promise.all(addReactions);
                setTimeout(() => endGameCollector(gameData.id, gameMsg, currReaction), deleteDelay);
            } catch (error) {
                console.log(error);
                endGameCollector(gameData.id, gameData.id, gameMsg);
            }
        });
        firstMsg.delete({ timeout: deleteDelay });
    });
};

const endGameCollector = async (gameid, gameMsg, reactions = []) => {
    const reactionsCount = reactions.map(reactionId => gameMsg.reactions.cache.get(reactionId).count);
    const mostReactCount = Math.max(...reactionsCount);
    if (mostReactCount <= 1) return gameMsg.delete();
    const winTeam = reactionsCount.indexOf(mostReactCount);
    if (reactionsCount.every(reactCount => reactCount === reactionsCount[winTeam])) return gameMsg.delete();
    saveMapStats(gameid, winTeam).then(result => {
        gameMsg.delete();
    });
};
