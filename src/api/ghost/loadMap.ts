import { ghostCommandsMarks } from "../../utils/globals";
import {
  sendCommand,
  whaitForCommandResult,
} from "../../utils/requestToGuiServer";

export const loadMap = async (map: string) => {
  const marks = await sendCommand(`map ${map ? map : ""}`);

  if (!marks) return null;

  const commandResult = await whaitForCommandResult({
    startMark: marks[0],
    endMark: marks[1],
    successMark: ghostCommandsMarks.map.success,
    errorMark: ghostCommandsMarks.map.error,
  });

  return commandResult;
};
