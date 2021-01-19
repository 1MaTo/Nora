import { getPlayersNicknames } from "../db/db";
import { objectKey } from "../redis/objects";
import { redis } from "../redis/redis";
import { colors } from "../strings/constants";
import { defaultEmbed } from "../strings/embeds";
import { nicknameCommand } from "../strings/logsMessages";
import { prefix } from "../../config.json";
import { autodeleteMsg, autodeleteReaction, getUserById, guildUserRedisKey, parseUserId } from "../utils";

export const name = "nickname";
export const args = 1;
export const aliases = ["n"];
export const usage = "bind [<nickname>] | unbind [<nickname>] | show | (ADMIN ONLY) rebind [<nickname>] <user>";
export const description = `Bind ingame nickname to your discord id\nExample ${prefix}bind [vasya123]`;
export const guildOnly = true;
export const development = false;
export const adminOnly = false;
export const caseSensitive = true;
export const run = async (message, args) => {
    const action = args.shift().toLowerCase();
    const redisKey = guildUserRedisKey.struct(objectKey.bindNickname, message.guild.id, message.author.id);
    const userNicknames = await redis.get(redisKey);

    if (action === "show") {
        if (!userNicknames) return autodeleteMsg(message, nicknameCommand.noBindedNicknames);
        return autodeleteMsg(message, {
            embed: defaultEmbed(`📃 Your binded nicknames`, `\`\`\`[${userNicknames.join("]\n[")}]\`\`\``),
        });
    }

    const nickname = args.join(" ").split(/[\[\]]/)[1];

    if (action === "bind") {
        bindNickname(message, nickname, redisKey);
    }

    if (action === "unbind") {
        unbindNickname(message, nickname, redisKey);
    }

    if (action === "rebind") {
        if (!message.member.hasPermission("ADMINISTRATOR")) return autodeleteMsg(message, needAdminPermission);

        const existUser = args[1] && (await getUserById(message.guild, parseUserId(args[1])));

        if (!existUser) return autodeleteMsg(message, nicknameCommand.badUser);

        const userIds = getAllMembersId(message.guild);

        const userToUnbind = await checkIfNicknameUsed(message.guild.id, userIds, nickname);
        const userToBind = parseUserId(args[1]);

        const userUnbindKey = guildUserRedisKey.struct(objectKey.bindNickname, message.guild.id, userToUnbind);
        const userBindKey = guildUserRedisKey.struct(objectKey.bindNickname, message.guild.id, userToBind);

        if (userToUnbind) {
            const isUnbind = await unbindNickname(message, nickname, userUnbindKey);
            if (!isUnbind) return;
        }

        const binded = await bindNickname(message, nickname, userBindKey);
        if (!binded) return;

        return autodeleteMsg(
            message,
            nicknameCommand.rebindDone(
                message.guild.members.cache.get(userToUnbind)
                    ? message.guild.members.cache.get(userToUnbind).user.tag
                    : `none`,
                message.guild.members.cache.get(userToBind).user.tag
            )
        );
    }
};

const getAllMembersId = guild => guild.members.cache.map(member => member.user.id);

const checkIfNicknameUsed = async (guildId, usersId, nickname) => {
    const userList = await redis.mget(
        usersId.map(userId => guildUserRedisKey.struct(objectKey.bindNickname, guildId, userId))
    );
    return usersId[userList.findIndex(userNickArray => userNickArray && userNickArray.some(nick => nick === nickname))];
};

const bindNickname = async (message, nickname, userKey) => {
    const userNicknames = await redis.get(userKey);

    const existNicknames = await getPlayersNicknames();

    if (!existNicknames) {
        autodeleteMsg(message, nicknameCommand.noNicknames);
        return false;
    }

    const validNickname = existNicknames.indexOf(nickname) !== -1;

    if (!validNickname) {
        autodeleteMsg(message, nicknameCommand.badNickname);
        autodeleteMsg(message, {
            embed: defaultEmbed("📃 Valid nicknames", `\`\`\`[${existNicknames.join("]\n[")}]\`\`\``, colors.green),
        });
        return false;
    }

    const userIds = getAllMembersId(message.guild);
    const userWithThisNickname = await checkIfNicknameUsed(message.guild.id, userIds, nickname);

    if (userWithThisNickname && userWithThisNickname !== message.author.id) {
        autodeleteMsg(
            message,
            nicknameCommand.nicknameReserved(message.guild.members.cache.get(userWithThisNickname).user.tag)
        );
        return false;
    }

    if (!userNicknames) {
        await redis.set(userKey, [nickname]);
    } else {
        const alreadyExist = userNicknames.indexOf(nickname) !== -1;
        if (alreadyExist) {
            autodeleteMsg(message, nicknameCommand.alreadyBind);
            return false;
        }
        await redis.set(userKey, [...userNicknames, nickname]);
    }

    autodeleteReaction(message, "✅");
    return true;
};

const unbindNickname = async (message, nickname, userKey) => {
    const userNicknames = await redis.get(userKey);

    if (!userNicknames) {
        autodeleteMsg(message, nicknameCommand.noBindedNicknames);
        return false;
    }
    const nicknameIndex = userNicknames.indexOf(nickname);
    if (nicknameIndex === -1) {
        autodeleteMsg(message, nicknameCommand.alreadyUnbind);
        return false;
    }
    if (userNicknames.length === 1) {
        await redis.del(userKey);
    } else {
        userNicknames.splice(nicknameIndex, 1);
        await redis.set(userKey, [...userNicknames]);
    }
    autodeleteReaction(message, "✅");
    return true;
};
