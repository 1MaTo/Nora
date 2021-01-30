import { groupsKey, redisKey } from "../redis/kies";
import { redis } from "../redis/redis";

export const defaultOptions = {
  ranking: false,
  spectatorLivesMatter: false,
} as mapConfigOption;

export const searchMapConfigByMapName = async (
  mapName: string,
  guildID: string
) => {
  const configs = await getGuildMapConfigs(guildID);
  const config = configs.find((cfg) =>
    mapName.match(new RegExp(cfg.name, "i"))
  );
  return config;
};

export const searchMapConfigByName = async (
  configName: string,
  guildID: string
) => {
  const configs = await getGuildMapConfigs(guildID);
  const config = configs.find((cfg) => cfg.name === configName);
  return config;
};

export const getGuildMapConfigs = async (
  guildID: string
): Promise<Array<mapConfig>> => {
  const key = redisKey.struct(groupsKey.mapConfig, [guildID]);
  const results = await redis.get(key);
  return results ? results : [];
};

export const createOrUpdateMapConfig = async (
  guildID: string,
  newConfig: mapConfig
) => {
  const guildConfigs = await getGuildMapConfigs(guildID);
  const configIndex = guildConfigs.findIndex(
    (cfg) => cfg.name === newConfig.name
  );
  const key = redisKey.struct(groupsKey.mapConfig, [guildID]);
  if (configIndex === -1) {
    await redis.set(key, [
      ...guildConfigs,
      { ...newConfig, options: defaultOptions },
    ]);
    return true;
  }
  guildConfigs.splice(configIndex - 1, 1, {
    ...newConfig,
    options: guildConfigs[configIndex].options,
  });
  await redis.set(key, guildConfigs);
  return false;
};

export const updateMapConfigOptions = async (
  guildID: string,
  configName: string,
  configOption: {
    fieldName: string;
    value: any;
  }
) => {
  const guildConfigs = await getGuildMapConfigs(guildID);
  const configIndex = guildConfigs.findIndex((cfg) => cfg.name === configName);

  if (configIndex === -1) return false;

  const key = redisKey.struct(groupsKey.mapConfig, [guildID]);
  guildConfigs[configIndex].options[configOption.fieldName] =
    configOption.value;

  await redis.set(key, guildConfigs);
  return true;
};

export const deleteMapConfig = async (guildID: string, configName: string) => {
  const guildConfigs = await getGuildMapConfigs(guildID);
  const configIndex = guildConfigs.findIndex((cfg) => cfg.name === configName);

  if (configIndex === -1) return false;

  const key = redisKey.struct(groupsKey.mapConfig, [guildID]);
  guildConfigs.splice(configIndex - 1, 1);
  redis.set(key, guildConfigs);
  return true;
};
