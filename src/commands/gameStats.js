import { gameStatsCommands } from "../strings/logsMessages";
import { autodeleteMsg, checkValidChannel, guildRedisKey } from "../utils";
import {
    getFinishedGamesCount,
    getFinishedGamesId,
    getGamesDataByIds,
    saveMapStats,
    searchMapConfigOrDefault,
} from "../db/db";
import { gameStatsPoll } from "../strings/embeds";
import { colors } from "../strings/constants";
import { objectKey } from "../redis/objects";
import { redis } from "../redis/redis";
import { statsCollectors } from "../bot";
import { parseMapName } from "../db/utils";

export const name = "gameStats";
export const args = 0;
export const aliases = ["gs"];
export const usage = "<channel> | stop";
export const description =
    "Command to enable/disable game stats collecting.\nIf no arguments provided, channel will be the one you tiped command";
export const guildOnly = true;
export const development = false;
export const adminOnly = true;
export const run = async (message, args) => {
    const redisKey = guildRedisKey.struct(objectKey.gameStats, message.guild.id);

    if (args[0] === "stop") {
        statsCollectors.delete(message.guild.id);
        await redis.del(redisKey);
        return autodeleteMsg(message, gameStatsCommands.disabled);
    }

    if (statsCollectors.has(message.guild.id)) return autodeleteMsg(message, gameStatsCommands.alreadyEnabled);

    const channel = checkValidChannel(args[0], message);
    const newCollectorOptions = {
        channel,
        delay: 5000,
        currGameCount: await getFinishedGamesCount(),
    };
    statsCollectors.set(message.guild.id, newCollectorOptions);
    await redis.set(redisKey, { ...newCollectorOptions, channel: channel.id });
    autodeleteMsg(message, gameStatsCommands.enabled);
    setTimeout(() => checkNewFinishedGames(channel), newCollectorOptions.delay);
};

export const checkNewFinishedGames = async channel => {
    const options = statsCollectors.get(channel.guild.id);

    if (!options) return autodeleteMsg({ channel }, gameStatsCommands.disabled);

    const gamesId = await getFinishedGamesId();

    if (gamesId === null) setTimeout(() => checkNewFinishedGames(channel), options.delay);

    const newGamesCount = Number(gamesId.length) - Number(options.currGameCount);
    if (newGamesCount) {
        options.currGameCount = gamesId.length;
        statsCollectors.set(channel.guild.id, options);
        const redisKey = guildRedisKey.struct(objectKey.gameStats, channel.guild.id);
        await redis.set(redisKey, { ...options, channel: channel.id });
        setTimeout(() => startPolls(gamesId.splice(-newGamesCount), channel), 10000);
    }

    setTimeout(() => checkNewFinishedGames(channel), options.delay);
};

const startPolls = async (gamesId, channel) => {
    const gamesData = await getGamesDataByIds(gamesId, channel.guild.id);
    await Promise.all(
        gamesData.map(async game => {
            if (game.players.length < 2) return;
            const config = await searchMapConfigOrDefault(channel.guild.id, {
                map: parseMapName(game.map),
                slotstotal: null,
            });
            if (config.options.ranking === "false") return;
            startGameCollector(game, channel);
        })
    );
};

const startGameCollector = async (gameData, channel) => {
    const deleteDelay = 1000 * 60 * 2;
    channel.send(gameStatsCommands.gameEnded(deleteDelay)).then(firstMsg => {
        firstMsg.channel.send({ embed: gameStatsPoll(gameData, colors.black) }).then(gameMsg => {
            const indexToEmoji = ["1⃣", "2⃣", "3⃣", "4⃣", "5⃣", "6⃣"];
            const currReaction = [];
            try {
                const addReactions = gameData.players.map(async (team, index) => {
                    currReaction.push(indexToEmoji[index]);
                    await gameMsg.react(indexToEmoji[index]);
                });
                setTimeout(() => endGameCollector(gameData.id, gameMsg, currReaction, gameData), deleteDelay);
            } catch (error) {
                console.log(error);
                endGameCollector(gameData.id, gameMsg, currReaction);
            }
        });
        firstMsg.delete({ timeout: deleteDelay });
    });
};

const endGameCollector = async (gameid, gameMsg, reactions = [], gameData) => {
    const reactionsCount = reactions.map(reactionId => gameMsg.reactions.cache.get(reactionId).count);
    const mostReactCount = Math.max(...reactionsCount);
    if (mostReactCount <= 1) return gameMsg.delete();
    const winTeam = reactionsCount.indexOf(mostReactCount);
    if (reactionsCount.every(reactCount => reactCount === reactionsCount[winTeam])) return gameMsg.delete();
    saveMapStats(gameid, winTeam).then(() => {
        gameMsg.reactions.removeAll();
        gameMsg.edit({ embed: gameStatsPoll(gameData, colors.green, winTeam) });
    });
};
