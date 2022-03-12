import { ghostCommandsMarks } from "../../utils/globals";
import {
  sendCommand,
  whaitForCommandResult,
} from "../../utils/requestToGuiServer";

export const loadMapFromFile = async (map: string) => {
  const marks = await sendCommand(`load ${map ? map : ""}`);

  if (!marks) return null;

  const commandResult = await whaitForCommandResult({
    startMark: marks[0],
    endMark: marks[1],
    successMark: ghostCommandsMarks.load.success,
    errorMark: ghostCommandsMarks.load.error,
  });

  return commandResult;
};
