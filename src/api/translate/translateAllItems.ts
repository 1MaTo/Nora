import { log } from "../../utils/log";
import { sleep } from "../../utils/sleep";
import { translateYandex } from "../yandex/translateYandex";

const maxLengthPerRequest = 10000;
const maxRequestPerSecond = 20;

export const translateAllItems = async (
  data: DataToTranslate,
  target: YandexLanguageCodeList
) => {
  const translationGroups = getTranslationRequestGroups(data.itemList);

  const results = [];

  while (translationGroups.length > 0) {
    const requestGroups = translationGroups.splice(0, maxRequestPerSecond);
    const groupTranslateResult = await Promise.all(
      requestGroups.map(async (group) => await translateGroup(group, target))
    );
    results.push(groupTranslateResult.flat());

    await sleep(1000);
  }

  return results.flat();
};

export const translateGroup = async (
  textGroup: string[],
  target: YandexLanguageCodeList
) => {
  try {
    const rawResult = await translateYandex({
      texts: textGroup,
      targetLanguageCode: target,
    });

    if (!rawResult) return [];

    return rawResult.translations.map((item) => item.text);
  } catch (error) {
    log("[translating groups] error when translating group");
    return [];
  }
};

export const getTranslationRequestGroups = (
  text: DataToTranslate["itemList"]
) => {
  const messageGroups = text.reduce(
    (data, item, index) => {
      const [_, value] = item;
      const curerntLength =
        getArrayTotalLength(data.currentGroup) + value.length;

      if (curerntLength >= maxLengthPerRequest) {
        data.groups.push(data.currentGroup);
        data.currentGroup = [];
      }

      const isLastItem = index + 1 === text.length;

      if (isLastItem) {
        data.groups.push([...data.currentGroup, value]);
        data.currentGroup = [];
        return data;
      }

      data.currentGroup.push(value);
      return data;
    },
    {
      groups: [] as Array<Array<string>>,
      currentGroup: [] as string[],
    }
  );
  return messageGroups.groups;
};

export const getArrayTotalLength = (arr: string[]) => {
  return arr.reduce((totalLength, item) => totalLength + item.length, 0);
};
